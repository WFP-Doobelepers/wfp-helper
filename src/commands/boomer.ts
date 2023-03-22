import { CommandInteraction, CacheType, GuildChannel, PermissionsBitField, SlashCommandBuilder} from 'discord.js'
import fs from 'fs'

module.exports = {

    data: new SlashCommandBuilder()
    .setName('boomer')
    .setDescription('Boomerfy the channel'),

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply()

        const file = fs.readFileSync('./commands/boomerlist.json', 'utf8')
        let userList = JSON.parse(file)

        if (userList.users.indexOf(interaction.user.id) === -1) {

            await interaction.editReply('**ERROR:** You do not have permission to use this.')
            return
        }

        if (interaction.channel.parentId !== '1086575845310746734') {

            await interaction.editReply(`**ERROR:** Can only be used in a Modmail Channel.`)
            return
        }

        const channel = interaction.channel as GuildChannel

        let overwritePerms: { id: string ; deny?: bigint[]; allow?: bigint[] ;}[] = [
            {
                id: '791662675516063754', // FG Role ID
                deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
                id: '793625421521879052', // TG Role ID
                deny: [PermissionsBitField.Flags.ViewChannel]
            }
        ]

        userList.users.forEach( (userId: string) => {

            overwritePerms.push({

                id: userId,
                allow: [PermissionsBitField.Flags.ViewChannel]
            })
            
        });

        try {

            await channel.edit({

                permissionOverwrites: overwritePerms
            })

            await interaction.editReply(`Boomerfied the ${interaction.channel.name}!`)

        } catch (error) {

            await interaction.editReply(`Command Failed:\nReason: ${error}`)
        } 
    }
}