const express = require('express');
const app = express();
const http = require('http');
const ms = require("ms");
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://higor.glitch.me/`);
}, 280000);

const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new Youtube('AIzaSyCQsrwLAdT8GBoWoCuAXdHqLthdqtLYLx0');
const client = new Discord.Client();
const active = new Map();  

const prefixoComando = 'h!';

const servidores = {};

// let estouPronto = false; SUBSTITUIDO POR 'emCanalDeVoz'

// To-do: Entender por que o !leave está quebrando
//        imprimir nome das músicas com comando !queue
// Para video: 
//        Implementar como lidar com multiplos servidores
//        Implementar !queue
//        Implementar como lidar com permissões
//        Implementar

function changing_status() {
    let status = ['👉Use: h!ajuda', '🎶Tocando Música para você.', '💖Desenvolvido por Pauloo']
    let random = status[Math.floor(Math.random() * status.length)]
    client.user.setActivity(random)
}

function radio() {
  const streamOptions = {seek: 0, volume: 1};
    let RaLofi = client.channels.get('709330622493229083')
    if(RaLofi !== null) {
        console.log('[RÁDIO] - Voice Channel has been found, and is playing.');
        RaLofi.join()
        .then(connection => {
            const stream = connection.playStream('https://stream.radiojovempop.com/top40/stream_hd');
            const DJ = connection.playStream(stream, streamOptions);
            DJ.on('end', end => {
            RaLofi.join()
            .then(connection => {
              const stream = connection.playStream('https://stream.radiojovempop.com/top40/stream_hd');
              const DJ = connection.playStream(stream, streamOptions);              
        })          
    }) 
  })
}   
}

client.on('ready', () => {
  console.log(`[BOT] - Login token was a success!`)
  console.log(`[BOT OK] - Bot is ready to execute commands.`)
  console.log(`[BOT INFO] - The bot is on ${client.guilds.size} servers, with a total of ${client.users.size} members.`)
  setInterval(changing_status, 10000);
  setInterval(radio, 3600000);
  
  const streamOptions = {seek: 0, volume: 1};
  
    let RaLofi = client.channels.get('709330622493229083')
    if(RaLofi !== null) {
        console.log('[RÁDIO] - Voice Channel has been found, and is playing.');
        RaLofi.join()
        .then(connection => {
            const stream = connection.playStream('https://stream.radiojovempop.com/top40/stream_hd');
            const DJ = connection.playStream(stream, streamOptions);
            DJ.on('end', end => {
            RaLofi.join()
            .then(connection => {
              const stream = connection.playStream('https://stream.radiojovempop.com/top40/stream_hd');
              const DJ = connection.playStream(stream, streamOptions);              
        })          
    }) 
  })
}  
  
});

client.on("message", async message => {
  
    if (message.content.includes(`711724435349962803`)) {
      if(message.author.bot) return
         const message_bot = await message.channel.send(`Olá ${message.author}, sou o ` + '``Higor#5688``' + `\nPara saber mais sobre mim, digite: h!comandos.`);
          setTimeout(() => { message_bot.delete(); }, 10000)
            message.delete()
    }
  
});

client.on('message', async msg => {
    // !join = Bot se junta ao canal de voz
     if (msg.content === `${prefixoComando}join`){
        if (msg.member.voiceChannel){           

            servidores[msg.guild.id] = [];

            console.log(`Novo servidor: ${msg.guild.name}\nChave criada: ${msg.guild.id}\nNúmero atual de Servidores conectados: ${Object.keys(servidores).length}\n`);
            msg.member.voiceChannel.join();
          let embed = new Discord.RichEmbed()
            .setDescription('<:certo:708273670367477761> | Você me conectou ao __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)          
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }
    }

    // !leave = Bot sai do canal de voz
    else if (msg.content === `${prefixoComando}leave`){
        if (msg.member.voiceChannel){
            msg.member.voiceChannel.leave();
            delete servidores[msg.guild.id];
            console.log(`Servidor saindo!\nNome do servidor: ${msg.guild.name}\n`);
          let embed = new Discord.RichEmbed()
            .setDescription('<:negado:708273670409289740> | Você me desconectou ao __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)            
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }
    }

    // !play [link] = Bot toca músicas
    else if (msg.content.startsWith(`${prefixoComando}play `)){
        if (msg.guild.id in servidores){ // se o servidor (guilda) está presente no map, então estou num canal de voz
            let oQueTocar = msg.content.replace(`${prefixoComando}play `,'');
            console.log(`Servidor ${msg.guild.name.toUpperCase()} insere comando PLAY usando: ${oQueTocar}.\n`);
            try { // tenta encontrar música por link
                let video = await youtube.getVideo(oQueTocar);
                msg.channel.send(`O video foi encontrado!: ${video.title}`);
                servidores[msg.guild.id].push(oQueTocar);
                if (servidores[msg.guild.id].length === 1) {
                    tocarMusica(msg);
                    console.log(`Música inserida!\nNome do servidor: ${msg.guild.name}\nFila atual: ${servidores[msg.guild.id]}\n`);
                }
            } catch (error) {
                try { // tenta encontrar música por pesquisa
                    let videosPesquisados = await youtube.searchVideos(oQueTocar, 5);
                    let videoEncontrado;
                    for (let i in videosPesquisados){
                        videoEncontrado = await youtube.getVideoByID(videosPesquisados[i].id);
                        msg.channel.send(`${i}: ${videoEncontrado.title}`);
                    }
                    msg.channel.send({embed: {
                        color: 0x045FB4,
                        description: '<a:alerta:711743753093906512> | Escolha uma __música de 1 á 5__, clicando nas reações!'
                    }}).then( async (embedMessage) => {
                        await embedMessage.react(':1_blue:712736700555591690');
                        await embedMessage.react(':2_blue:712736699767193611');
                        await embedMessage.react(':3_blue:712736700111126539');
                        await embedMessage.react(':4_blue:712736699809005631');
                        await embedMessage.react(':5_blue:712736700107063399');

                        const filter = (reaction, user) => {
                            return ['1_blue', '2_blue', '3_blue', '4_blue', '5_blue'].includes(reaction.emoji.name)
                                && user.id === msg.author.id;
                        }

                        let collector = embedMessage.createReactionCollector(filter, {time: 20000});
                        collector.on('collect', async (reaction, rectionCollector) => {
                            if (reaction.emoji.name === '1_blue'){
                                let tocando = new Discord.RichEmbed()
                                  .setDescription('<:musicas:711153744078700545> | Estou tocando ``' + `${videoEncontrado.title}` + '``.')
                                  .setColor('#045FB4')
                                msg.channel.send(tocando)
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[0].id);
                                servidores[msg.guild.id].push(`\nhttps://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '2_blue'){
                                let tocando = new Discord.RichEmbed()
                                  .setDescription('<:musicas:711153744078700545> | Estou tocando ``' + `${videoEncontrado.title}` + '``.')
                                  .setColor('#045FB4')
                                msg.channel.send(tocando)
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[1].id);
                                servidores[msg.guild.id].push(`\nhttps://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '3_blue'){
                                let tocando = new Discord.RichEmbed()
                                  .setDescription('<:musicas:711153744078700545> | Estou tocando ``' + `${videoEncontrado.title}` + '``.')
                                  .setColor('#045FB4')
                                msg.channel.send(tocando)
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[2].id);
                                servidores[msg.guild.id].push(`\nhttps://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '4_blue'){
                                let tocando = new Discord.RichEmbed()
                                  .setDescription('<:musicas:711153744078700545> | Estou tocando ``' + `${videoEncontrado.title}` + '``.')
                                  .setColor('#045FB4')
                                msg.channel.send(tocando)
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[3].id);
                                servidores[msg.guild.id].push(`\nhttps://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            else if (reaction.emoji.name === '5_blue'){
                                let tocando = new Discord.RichEmbed()
                                  .setDescription('<:musicas:711153744078700545> | Estou tocando ``' + `${videoEncontrado.title}` + '``.')
                                  .setColor('#045FB4')
                                msg.channel.send(tocando)
                                videoEncontrado = await youtube.getVideoByID(videosPesquisados[4].id);
                                servidores[msg.guild.id].push(`\nhttps://www.youtube.com/watch?v=${videoEncontrado.id}`);
                            }
                            if (servidores[msg.guild.id].length === 1) {
                                tocarMusica(msg);
                                console.log(`Música inserida!\nNome do servidor: ${msg.guild.name}\nFila atual: ${servidores[msg.guild.id]}\n`);
                            }
                        });
                    });
                } catch (error2) { // pesquisa não retornou nada
                  let embed = new Discord.RichEmbed()
                    .setDescription('<:AVISO:592056840943304704> | Você precisa inserir __Nome de uma Música__.')
                    .setColor('#045FB4')
                  msg.channel.send(embed)
                }
            }
        }
    }

    // !pause = Bot pausa a música
    if (msg.content === `${prefixoComando}pause`){
        if (msg.member.voiceChannel){
            if( (msg.guild.id) in servidores){
                if (msg.member.voiceChannel.connection.dispatcher){
                    if (!msg.member.voiceChannel.connection.dispatcher.paused){
                        msg.member.voiceChannel.connection.dispatcher.pause();
                    } 
                    else {
                      let embed = new Discord.RichEmbed()
                        .setDescription('<:AVISO:592056840943304704> | A música já está pausada.')
                        .setColor('#045FB4')
                      msg.channel.send(embed)
                    }
                }
                else {
                  let embed = new Discord.RichEmbed()
                    .setDescription('<:AVISO:592056840943304704> | Eu não estou tocando nenhuma música para pausar.')
                    .setColor('#045FB4')
                  msg.channel.send(embed)
                }
            }
            else {
              let embed = new Discord.RichEmbed()
                .setDescription('<:AVISO:592056840943304704> | Não estou em um __Canal de Voz__.')
                .setColor('#045FB4')
              msg.channel.send(embed)
            }
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }

    }

    // !resume = Bot retoma a música
    if (msg.content === `${prefixoComando}resume`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                if (msg.member.voiceChannel.connection.dispatcher.paused){
                    msg.member.voiceChannel.connection.dispatcher.resume();
                } 
                else {
                  let embed = new Discord.RichEmbed()
                    .setDescription('<:AVISO:592056840943304704> | A música não está pausada.')
                    .setColor('#045FB4')
                  msg.channel.send(embed)
                }
            }
            else {
              let embed = new Discord.RichEmbed()
                .setDescription('<:AVISO:592056840943304704> | Eu não estou tocando nenhuma música para continuar.')
                .setColor('#045FB4')
              msg.channel.send(embed)
            }
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }
    }

    // !end = Bot para a música e limpa a fila
    else if (msg.content === `${prefixoComando}end`){
        if (msg.member.voiceChannel){
            if (msg.member.voiceChannel.connection.dispatcher){
                msg.member.voiceChannel.connection.dispatcher.end();
                while (servidores[msg.guild.id].length > 0){
                    servidores[msg.guild.id].shift();
                }
            }
            else {
              let embed = new Discord.RichEmbed()
                .setDescription('<:AVISO:592056840943304704> | Eu não estou tocando nenhuma música para pular pro final.')
                .setColor('#045FB4')
              msg.channel.send(embed)
            }
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }
    }

    // !skip = Bot toca a próxima música da fila
    else if (msg.content === `${prefixoComando}skip`){
        if (msg.member.voiceChannel){
            if(msg.member.hasPermission('ADMINISTRATOR')){
                if (msg.member.voiceChannel.connection.dispatcher) {
                    if (servidores[msg.guild.id].length > 1){
                        msg.member.voiceChannel.connection.dispatcher.end();
                    }
                    else {
                      let embed = new Discord.RichEmbed()
                        .setDescription('<:AVISO:592056840943304704> | Não existem mais músicas para eu tocar, por favor adicione na fila.')
                        .setColor('#045FB4')
                      msg.channel.send(embed)   
                    }
                }
                else {
                  let embed = new Discord.RichEmbed()
                    .setDescription('<:AVISO:592056840943304704> | Eu não estou tocando nenhuma música para mudar de música.')
                    .setColor('#045FB4')
                msg.channel.send(embed)
                }
            }
            else {
              let embed = new Discord.RichEmbed()
                .setDescription('<:AVISO:592056840943304704> | Você precisa ter __PERMISSÕES__ para executar esse comando.')
                .setColor('#045FB4')
              msg.channel.send(embed)
            }
        }
        else {
          let embed = new Discord.RichEmbed()
            .setDescription('<:AVISO:592056840943304704> | Você precisa estar conectado a um __Canal de Voz__.')
            .setColor('#045FB4')
          msg.channel.send(embed)
        }
    }
  
    if (msg.content === `${prefixoComando}help`){
      let usuario = msg.member
      let embed = new Discord.RichEmbed()
        .setTitle("<:ajuda_blue:711786958115962881> Ajuda do Bot Higor")
        .setDescription("Olá " + `${usuario}` +  ", você esta na central de ajuda. E irei lhe mostrar algumas informações sobre mim...")
        .addField("<:statusdobot_blue:711786626950627349> Status do Bot:", '\n<:servidores_blue:711788829476126780> Servidores: ' + `${client.guilds.size.toLocaleString()}` + '\n<:members_blue:711788829463281704> Membros: ' + `${client.users.size.toLocaleString()}` +  '\n<:sinal_blue:711788829442441227> Ping atual: ' + `${Math.round(client.ping)}ms`)    
        .addField("<:pasta_blue:711785954456764538> **Pasta de Comandos**", 'Essa é a minha Pasta Principal de Comandos, aqui você pode acessar cada comando disponível.')
        .addField("<:musicas_blue:711785954762948668> Músicas (8):", '``join``, ``play``, ``pause``, ``resume``, ``skip``, ``fila``,``end``, ``leave``.')
        .addField("Outros:", '<:vote_blue:711785954825863231> Vote em mim:' + `[ Clique Aqui](http://votar.khaue.gq)` + '\n<:convite_blue:711785954691776594> Me adiciona em seu Servidor?' + `[ Clique Aqui](https://discord.com/oauth2/authorize?client_id=711724435349962803&scope=bot&permissions=36990784)`)
        .setThumbnail(client.user.avatarURL)
        .setColor('#045FB4')
      msg.channel.send(embed)

    }
  
    if (msg.content === `${prefixoComando}ajuda`){
      let usuario = msg.member
      let embed = new Discord.RichEmbed()
        .setTitle("<:ajuda_blue:711786958115962881> Ajuda do Bot Higor")
        .setDescription("Olá " + `${usuario}` +  ", você esta na central de ajuda. E irei lhe mostrar algumas informações sobre mim...")
        .addField("<:statusdobot_blue:711786626950627349> Status do Bot:", '\n<:servidores_blue:711788829476126780> Servidores: ' + `${client.guilds.size.toLocaleString()}` + '\n<:members_blue:711788829463281704> Membros: ' + `${client.users.size.toLocaleString()}` +  '\n<:sinal_blue:711788829442441227> Ping atual: ' + `${Math.round(client.ping)}ms`)    
        .addField("<:pasta_blue:711785954456764538> **Pasta de Comandos**", 'Essa é a minha Pasta Principal de Comandos, aqui você pode acessar cada comando disponível.')
        .addField("<:musicas_blue:711785954762948668> Músicas (8):", '``join``, ``play``, ``pause``, ``resume``, ``skip``, ``fila``,``end``, ``leave``.')
        .addField("Outros:", '<:vote_blue:711785954825863231> Vote em mim:' + `[ Clique Aqui](http://votar.khaue.gq)` + '\n<:convite_blue:711785954691776594> Me adiciona em seu Servidor?' + `[ Clique Aqui](https://discord.com/oauth2/authorize?client_id=711724435349962803&scope=bot&permissions=36990784)`)
        .setThumbnail(client.user.avatarURL)
        .setColor('#045FB4')
      msg.channel.send(embed)

    }

    if (msg.content === `${prefixoComando}teste`){
      let usuario = msg.member
      let embed = new Discord.RichEmbed()
        .setTitle(`💼 Saldo de ${usuario}`)
        .addField("💸 Saldo em mãos", '```css\nR$50```', true)  
        .addField("💰 Saldo bancário", '```css\nR$84```', true)
        .addField("🌞 Saldo de BitCoin",'```css\nR$1.000```', true)
        .setThumbnail(client.user.avatarURL)
        .setColor('#045FB4')
      msg.channel.send(embed)

    }   

    if (msg.content === `${prefixoComando}ping`){
      const { RichEmbed } = require("discord.js");
        msg.delete(5000)
   
        let embed = new RichEmbed()
          .setTitle(`${msg.author.username}`)
          .setDescription(`<a:ping:671561120992985098>  Meu ping atual é de: **${Math.round(client.ping)}**ms`)
          .setColor('#045FB4')
        msg.channel.send(embed)

    }
    if (msg.content === `${prefixoComando}fila`){
      const { RichEmbed } = require("discord.js");
        msg.delete(5000)
      
      if (servidores[msg.guild.id].length > 1){
        let embed = new RichEmbed()
          .setTitle(`<:musicas_blue:711785954762948668> Músicas em fila:`)
          .setDescription(`${servidores[msg.guild.id]}`)
          .setColor('#045FB4')
        msg.channel.send(embed)
      }
      else {
        let embed = new Discord.RichEmbed()
          .setDescription('<:negado:708273670409289740> | Não existe nenhuma música na fila para reproduzir.')
          .setColor('#045FB4')
        msg.channel.send(embed)   
      }      

    }   

});

function tocarMusica(msg){
    msg.member.voiceChannel.connection.playStream(ytdl(servidores[msg.guild.id][0]))
        .on('end', () => {
            if (servidores[msg.guild.id].length > 0){
                servidores[msg.guild.id].shift();
                tocarMusica(msg);
            }
        });
}

client.on('guildMemberAdd', member => {
    const role = member.guild.roles.find(role => role.name == '👤 MEMBRO');
   member.addRole(role);
  })
client.on('guildMemberAdd', member => {
    const role = member.guild.roles.find(role => role.name == 'Pintinho');
   member.addRole(role);
  })  

client.login(process.env.TOKEN);