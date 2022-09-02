const { getVoiceConnection } = require("@discordjs/voice");
const { previousSong } = require("../../global/music");

module.exports = {

  name: "anterior",
  description: "Reproducir la canción anterior.",

  async execute(client, message, args, discord) {

    const mvc = message.member.voice.channel.id;
    const pvc = getVoiceConnection(message.guild.id);

    if (!pvc) return message.reply({ content: `<@${message.author.id}>, actualmente no se está reproduciendo música.`, ephemeral: true });
    if (mvc != pvc.joinConfig.channelId) return message.reply({ content: `<@${message.author.id}>, tenés que estar conectado en el mismo canal de voz que el bot.`, ephemeral: true });

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    previousSong(message.guild.id, player.state.resource.metadata.key, message, player, pvc);

  }

};