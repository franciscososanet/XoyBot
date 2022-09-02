module.exports = {
    
    name: "ping",
    description: "Mostrar el ping del bot",

    run: async(client, interaction) => {

        interaction.reply({ content: `Actualmente cuento con **${client.ws.ping} ms**` });
        
    }
    
}