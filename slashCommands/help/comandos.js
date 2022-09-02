const discord = require("discord.js");

module.exports = { 

    name: "comandos",
    description: "Mostrar la lista de comandos disponibles.",
 
    run: async (client, interaction) => {

        const msg = new discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`COMANDOS DE MÚSICA`)
            .setDescription(`**xb.play**\n**xb.pausar**\n**xb.reanudar**\n**xb.cola**\n**xb.anterior**\n**xb.siguiente**\n**xb.terminar**`)
            .setFooter(`Solicitado por: ${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp();

        interaction.reply({ embeds: [msg] });
    }

};