const play = require("play-dl");
const { v4: uuidv4 } = require("uuid");
const { queue, agregar, musicEmbed, queueEmbed, nextSong } = require("../../global/music");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, getVoiceConnection } = require("@discordjs/voice");

module.exports = {

  name: "play",
  description: "Reproducir musica",

  async execute(client, message, args, discord) {
    
    const vc = message.member.voice.channel;

    if(args.length < 1) return message.reply({ content: `Tenés que escribir el nombre o link de la canción.`, ephemeral: true });
    if (!vc) return message.reply({ content: `Tenés que estar conectado en un canal de voz.`, ephemeral: true });

    //Búsqueda de canción
    let ytInfo = await play.search(args.join(" "));
    let stream = await play.stream(ytInfo[0].url);

    //Agregar canción a lista de reproducción
    const song = { key: uuidv4(), title: ytInfo[0].title, url: ytInfo[0].url };
    agregar(message.guild.id, song);

    //Comprobar si se está reproduciendo música
    const pvc = getVoiceConnection(message.guild.id);
    if (pvc) return message.reply({ embeds: [queueEmbed(ytInfo[0].title, ytInfo[0].url, ytInfo[0].thumbnail.url, message.author)] });

    //Conexión
    const connection = joinVoiceChannel({ channelId: vc.id, guildId: message.guildId, adapterCreator: message.guild.voiceAdapterCreator });
    const resource = createAudioResource(stream.stream, {inputType: stream.type, metadata: { title: ytInfo[0].title, key: song.key } });

    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    message.reply({ embeds: [musicEmbed(ytInfo[0].title, ytInfo[0].durationRaw, ytInfo[0].uploadedAt, ytInfo[0].views, ytInfo[0].url, ytInfo[0].thumbnail.url, message.author)] });

    //Desconectar bot al terminar la reproducción
    player.on(AudioPlayerStatus.Idle, async (oldS, newS) => {
      if(queue.get(message.guild.id).songs.length <= 1 && queue.get(message.guild.id).loop == "false"){
        connection.destroy();
        queue.delete(guildId);
        return message.channel.send("Bot desconectado al no tener más canciones pore reproducir.");
      }else{
        return nextSong(message.guild.id, oldS.resource.metadata.key, message, player, connection, "auto");
      }
    });
  }

};