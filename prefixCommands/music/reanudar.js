const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {

  name: "reanudar",
  description: "Reanudar la reproducción de música.",

  async execute(client, message, args, discord) {

    const vc = message.member.voice.channel.id;
    const pvc = getVoiceConnection(message.guild.id);

    if(!vc) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en un canal de voz.`, ephemeral: false });
    if(!pvc) return message.reply({ content: `<@${message.author.id}>, el bot no está reproduciendo música.`, ephemeral: false });
    if(vc != pvc.joinConfig.channelId) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en el mismo canal de voz que el bot`, ephemeral: false });

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    if(player.state.status == "playing") return message.reply({ content: `<@${message.author.id}>, el bot no está pausado.`});

    if(player.state.status == "paused"){

      player.unpause();

      const msg = new discord.MessageEmbed()
        .setColor("GREYPLE")
        .setTitle("MÚSICA REANUDADA")
        .setDescription(`Para volver a pausar, utilizar **xb.pausar**.`)
        .setFooter( `Reanudado por: ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}` )
        .setTimestamp()

      message.reply({ embeds: [msg], ephemeral: false });

    } 

  }

};