const { getVoiceConnection } = require("@discordjs/voice");
const { nextSong } = require("../../global/music");

module.exports = {

  name: "siguiente",
  description: "Saltear a la siguiente canción",

  async execute(client, message, args, discord) {

    const mvc = message.member.voice.channel.id;
    const pvc = getVoiceConnection(message.guild.id);

    if (!pvc) return message.reply({ content: `<@${message.author.id}, el bot no está reproduciendo música.`, ephemeral: true });
    if (mvc != pvc.joinConfig.channelId) return message.reply({ content: `<@${message.author.id}, tenés que estar conectado en el mismo canal de voz que el bot.`, ephemeral: true });

    const player = getVoiceConnection(message.guild.id).state.subscription.player;

    nextSong(message.guild.id, player.state.resource.metadata.key, message, player, pvc, "cmd");

  }

};