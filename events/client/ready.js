
require('dotenv').config();

const Discord = require("discord.js");
const mongoose = require("mongoose");

module.exports = async (client) => {

  //Hardcodeado el id del servidor
  const guildId = '1119677624915079320';
  const guild = client.guilds.cache.get(guildId);

  console.log(`Bot ${client.user.username} en línea en el servidor ${guild.name}`);

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

  //NOTIFICACION TWITCH
  let wasOnline = false;

  async function checkTwitchStatus(){

    const streamerRol = guild.roles.cache.find(role => role.name === "streamer");
  
    if(streamerRol){

      streamerRol.members.each(async member => {
  
        const username = member.user.username;
        const activities = member.presence?.activities;

        console.log(username); //-> Todos los miembros que tienen rol streamer
  
        if(activities && activities.length > 0){
  
          for(const activity of activities){ 

            if(activity.type === "STREAMING"){ //Buscar a todos los usuarios que esten en estado STREAMING
  
              const titleStream = activity.details;
              const urlStream = activity.url;
              const userStream = urlStream.split('/').pop();
  
              console.log(`UserDiscord: ${username}, UserTwitch: ${userStream}, TitleStream: ${titleStream}, URL: ${urlStream}`);
  
              const fetchModule = await import('node-fetch');
              const fetch = fetchModule.default;
  
              const uptimeResponse = await fetch(`https://decapi.me/twitch/uptime/${userStream}`);
              const avatarResponse = await fetch(`https://decapi.me/twitch/avatar/${userStream}`);
              const viewersResponse = await fetch(`https://decapi.me/twitch/viewercount/${userStream}`);
              const gameResponse = await fetch(`https://decapi.me/twitch/game/${userStream}`);
  
              const uptime = await uptimeResponse.text();
              const avatar = await avatarResponse.text();
              const viewers = await viewersResponse.text();
              const title = titleStream;
              const game = await gameResponse.text();
  
              const gameValue = game || "Juego no disponible";
              const viewersValue = viewers || "Viewers no disponibles";
              const titleValue = title || "Titulo no disponible";

              const twitch = require("../../schemas/twitchSchema.js");
              let data = twitch.findOne({
                user: userStream,
                titulo: titleStream
              });
  
              if(uptime !== `${userStream} is offline`){
                if(!wasOnline){
                  const embed = new Discord.MessageEmbed()
                    .setAuthor({ name: userStream, iconURL: avatar })
                    .setTitle(titleValue)
                    .setThumbnail(avatar)
                    .setURL(urlStream)
                    .addField("Game:", gameValue, true)
                    .addField("Viewers:", viewersValue, true)
                    .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${userStream}-620x378.jpg`)
                    .setColor("#d41393")
  
                  if(!data){
                    const newdata = new twitch({
                      user: userStream,
                      titulo: titleStream,
                    });
  
                    await newdata.save();
                  }
  
                  if(data && data.titulo === title) return;
  
                  await client.channels.cache.get("1134752606485491812").send({
                    content: `**${userStream}** está en directo. ¡Échale un vistazo a su transmisión!\n${urlStream}`,
                    embeds: [embed]
                  });
  
                  await twitch.findOneAndUpdate({ user: userStream, }, { titulo: titleStream });
  
                  wasOnline = true;
                }
              } else {
                wasOnline = false;
              }
            }
          }
        }
      });
    } else {
      console.error(`No se encontró el rol '${streamerRol}' en ningún usuario del servidor.`);
    }
  }

  let xoyOnline = false;

  async  function checkXoyStatus(){
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

    const gameValue = game || "Juego no disponible";
    const viewersValue = viewers || "Viewers no disponible";
    const titleValue = title || "Titulo no disponible";

    const twitch = require("../../schemas/twitchSchema.js");

    let data = await twitch.findOne({ user: user, titulo: title });

    if(uptime !== `${user} is offline`){
      if(!xoyOnline){ 
        const embed = new Discord.MessageEmbed()
          .setAuthor({ name: user, iconURL: avatar })
          .setTitle(titleValue)
          .setThumbnail(avatar)
          .setURL(`https://twitch.tv/${user}`)
          .addField("Game", gameValue, true)
          .addField("Viewers", viewersValue, true)
          .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
          .setColor("#d41393");

        if(!data){
          const newdata = new twitch({
            user: user,
            titulo: title
          });

          await client.channels.cache.get("1134752606485491812").send({
            content: `**¡Xoy está en directo!** ¡Échale un vistazo a su transmisión!\nhttps://www.twitch.tv/${user}`,
            embeds: [embed]
          });

          await newdata.save();
        }

        if(data && data.titulo === title) return;

        await twitch.findOneAndUpdate({ user: user }, { titulo: title });

        xoyOnline = true;
      }
    } else {
      xoyOnline = false;
    }
  }
  
  setInterval(checkTwitchStatus, 300000);
  setInterval(checkXoyStatus, 300000);

}