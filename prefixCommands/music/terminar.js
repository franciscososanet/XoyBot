const { getVoiceConnection } = require("@discordjs/voice");
const { queue } = require("../../global/music");

module.exports = {

  name: "terminar",
  description: "Parar y desconectar el bot de musica",

  async execute(client, message, args, discord) {

    const pvc = getVoiceConnection(message.guild.id);
    const vc = message.member.voice.channel;

    if(!vc) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en un canal de voz.`, ephemeral: false });
    if(!pvc) return message.reply({ content: `<@${message.author.id}>, el bot no está reproduciendo música.`, ephemeral: false });
    if(vc != pvc.joinConfig.channelId) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en el mismo canal de voz que el bot`, ephemeral: false });

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    queue.delete(message.guild.id);

    player.stop();
    pvc.destroy();

    const msg = new discord.MessageEmbed()
      .setColor("LUMINOUS_VIVID_PINK")
      .setTitle("MÚSICA FINALIZADA")
      .setDescription("Bot desconectado y vaciada la lista de reproducción.")
      .setFooter( `Música finalizada por: ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
      .setTimestamp();


    message.reply({ embeds: [msg] });

  }

};