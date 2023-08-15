module.exports = async (client, discord, member) => {

    if(member.guild.id === "1119677624915079320"){

        const bienvenidaChannel = client.channels.cache.get("1119677625519067177");
        const reglasChannel = client.channels.cache.get("1134751084682948618");
        
        // Comprueba si el miembro tiene un apodo. Si no lo tiene, usa el nombre de usuario.
        const displayName = member.nickname ? member.nickname : member.user.username;

        const msg = new discord.MessageEmbed()
            .setTitle(`✨ ¡Bienvenido, ${displayName}! ✨`)
            .setColor("#d41393")
            .setDescription(`🎮 ¡Holis! Estoy emocionada de tenerte acá ♥. Este es el lugar perfecto para hacer amigos y jugar juntos.\n\n¡Espero que te diviertas!\n\nRecuerda revisar las ${reglasChannel}.\n¡Nos vemos en el juego!`)
            .setTimestamp();

        bienvenidaChannel.send({ embeds: [msg] });
    }

} 
