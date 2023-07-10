import { Client, CommandInteraction, Events } from 'discord.js'

export default (client: Client): void => {
  client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction)
    }
  })
}

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const command = client.commands.get(interaction.commandName)

  if (!command)
    throw Error(`No command found matching ${interaction.commandName}`)

  try {
    await command.execute(interaction)
  } catch (e) {
    console.error(e)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
}
