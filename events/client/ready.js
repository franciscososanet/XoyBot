module.exports = async (client) => {

    console.log(`Bot ${client.user.username} en línea.`);

    client.user.setActivity("www.franciscososa.net", { type: 'WATCHING' });
    client.user.setStatus("online");

    client.on('voiceStateUpdate', (oldState, newState) => {
      const member = newState.member;
      const channel = newState.channel;

      if (channel && !oldState.channel) {

        const xoy = client.users.cache.get('691117937771413514');
        const message = `Amorcito, **${member.user.username}** se conectó a '**${channel.name}**'`;

        xoy.send(message);
      }
    });

  }