const { fullQueue } = require("../../global/music");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {

  name: "cola",
  description: "Mostrar las canciones en la lista de reproducción.",

  async execute(client, message, args, discord) {

    const pvc = getVoiceConnection(message.guild.id);
    if (!pvc) return message.reply("No se esta reproduciendo música.");

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    // console.log(player.state.resource.metadata.title);

    const songs = fullQueue(message.guild.id);

    const embed = new discord.MessageEmbed()
      .setColor("WHITE")
      .setTitle("LISTA DE REPRODUCCIÓN")
      .setDescription(`${songs.join("")}\nPodés utilizar **xb.anterior** o **xb.siguiente** para reproducir otra canción de la lista.`)

    message.reply({ embeds: [embed] });

  }
  
};