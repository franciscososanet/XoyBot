
require('dotenv').config();

const Discord = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client) => {
  console.log(`Bot ${client.user.username} en línea.`);

  client.user.setActivity("twitch.tv/xoy_gamer", { type: 'WATCHING' });
  client.user.setStatus("online");

  mongoose.connect((process.env.DB), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log("Conectado correctamente a MongoDB");
  }).catch(() => {
    console.log("Ocurrio un error al conectarse a la base de datos");
  })

  setInterval(async function() {

    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;

    let user = "xoy_gamer";

    const uptimeResponse = await fetch(`https://decapi.me/twitch/uptime/${user}`);
    const avatarResponse = await fetch(`https://decapi.me/twitch/avatar/${user}`);
    const viewersResponse = await fetch(`https://decapi.me/twitch/viewercount/${user}`);
    const titleResponse = await fetch(`https://decapi.me/twitch/title/${user}`);
    const gameResponse = await fetch(`https://decapi.me/twitch/game/${user}`);

    const uptime = await uptimeResponse.text();
    const avatar = await avatarResponse.text();
    const viewers = await viewersResponse.text();
    const title = await titleResponse.text();
    const game = await gameResponse.text();

    const twitch = require("../../schemas/twitchSchema.js");

    let data = await twitch.findOne({ user: user, titulo: title });

    if (uptime !== `${user} is offline`) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: user, iconURL: avatar })
        .setTitle(title)
        .setThumbnail(avatar)
        .setURL(`https://twitch.tv/${user}`)
        .addField("Game", game, true)
        .addField("Viewers", viewers, true)
        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
        .setColor("BLURPLE");

      if (!data) {
        const newdata = new twitch({
          user: user,
          titulo: title
        });

        await client.channels.cache.get("1134752606485491812").send({
          content: `**Xoy está en directo**.\nhttps://www.twitch.tv/${user}`,
          embeds: [embed]
        });

        return await newdata.save();
      }

      if (data.titulo === `${title.body}`) return;

      await client.channels.cache.get("1134752606485491812").send({
        content: `${user} está en directo.\nhttps://www.twitch.tv/${user}`,
        embeds: [embed]
      });

      await twitch.findOneAndUpdate({ user: user }, { titulo: title });
    }
  }, 120000);
};
