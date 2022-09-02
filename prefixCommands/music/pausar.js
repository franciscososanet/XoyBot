const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {

  name: "pausar",
  description: "Pausar reproducción.",
  
  async execute(client, message, args, discord) {

    const mvc = message.member.voice.channel.id;
    const pvc = getVoiceConnection(message.guild.id);

    if(!pvc) return message.reply({ content: `<@${message.author.id}>, el bot no está reproduciendo música.`, ephemeral: true });
    if(!mvc) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en un canal de voz.`, ephemeral: true });

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    if(player.state.status == "paused") return message.reply({ content: `<@${message.author.id}>, el bot no está reproduciendo música.`});

    if(player.state.status == "playing"){

      player.pause();

      const msg = new discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("MÚSICA PAUSADA")
        .setDescription(`Para volver a reproducir, utilizar **xb.reanudar**.`)
        .setFooter(`Pausado por: ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
        .setTimestamp();

      message.reply({ embeds: [msg], ephemeral: false });

    }

  }

};