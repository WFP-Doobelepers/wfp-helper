import { CommandInteraction, CacheType, EmbedBuilder, SlashCommandBuilder} from 'discord.js'
import fs from 'fs'

module.exports = {

    data: new SlashCommandBuilder()
    .setName('boomerlist')
    .setDescription('Show all boomers'),

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply()

        const file = fs.readFileSync('../db/boomerlist.json', 'utf8')
        let userList = JSON.parse(file)

        if (userList.users.indexOf(interaction.user.id) === -1) {

            await interaction.editReply('**ERROR:** You do not have permission to use this.')
            return
        }

        let description = 'The boomers are :-\n\n'

        userList.users.forEach(user  => {

            description += `<@${user}>\n`
            
        });

        const embed = new EmbedBuilder()
                            .setTitle('Boomer List')
                            .setDescription(description)
                            .setThumbnail(interaction.guild.iconURL())
                            .setFooter({
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: interaction.user.avatarURL()
                            })
                            .setColor(0xFFFFFF)
                            .toJSON()
                            

        await interaction.editReply({ embeds: [embed]})        

    }
}