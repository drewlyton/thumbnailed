import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

export type Command = {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}
