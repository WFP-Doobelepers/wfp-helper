import { CommandInteraction, CacheType, GuildChannel, SlashCommandBuilder} from 'discord.js'
import fs from 'fs'

module.exports = {

    data: new SlashCommandBuilder()
    .setName('boomerize')
    .setDescription('Show all boomers')
    .addUserOption( option => 
        option
            .setName('user')
            .setDescription('User to add or remove from boomerlist')
            .setRequired(true)
    ),

    async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply()

        const file = fs.readFileSync('../db/boomerlist.json', 'utf8')
        let userList = JSON.parse(file)

        if (userList.users.indexOf(interaction.user.id) === -1) {

            await interaction.editReply('**ERROR:** You do not have permission to use this.')
            return
        }

        const user = interaction.options.getUser('user')
        const index = userList.users.indexOf(<string> user?.id)

        let channels: GuildChannel[] = [];

        channels.push(await interaction.guild.channels.fetch('1086355068476985475') as GuildChannel)
        channels.push(await interaction.guild.channels.fetch('1086355096624959608') as GuildChannel)

        if (index !== -1) {

        userList.users.splice(index, 1)

        channels.forEach(async (channel) => {

            await channel.permissionOverwrites.edit(user.id, {

                ViewChannel: false
            })
            
        });

        await interaction.editReply(`Removed user ${user.username} from boomer list.`)

        } else {

            userList.users.push(<string> user?.id)

            channels.forEach(async (channel) => {

                await channel.permissionOverwrites.edit(user.id, {

                    ViewChannel: true
                })
                
            });

            await interaction.editReply(`Added user ${user.username} to boomer list.`)
        }

        fs.writeFileSync('../db/boomerlist.json', JSON.stringify(userList))     
    }
}