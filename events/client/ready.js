module.exports = async (client) => {

    console.log(`Bot ${client.user.username} en línea.`);

    client.user.setActivity("www.franciscososa.net", { type: 'WATCHING' });
    client.user.setStatus("online");

  };