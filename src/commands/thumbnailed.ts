import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from './Command'
import { generateThumbnail } from '../utils/generateThumbnail'

const data = new SlashCommandBuilder()
  .setName('thumbailed')
  .setDescription('Replies with a mockup of your title and thumbnail')
  .addStringOption(option =>
    option.setName('title').setDescription('The video title').setRequired(true)
  )
  .addAttachmentOption(option =>
    option
      .setName('thumbnail')
      .setDescription('The video thumbnail')
      .setRequired(true)
  )

async function execute(interaction: CommandInteraction) {
  const title = interaction.options.get('title')
  const thumbnail = interaction.options.get('thumbnail')
  if (
    !title ||
    title.type !== ApplicationCommandOptionType.String ||
    !title.value
  ) {
    throw Error('invalid title provided')
  }
  if (
    !thumbnail ||
    thumbnail.type !== ApplicationCommandOptionType.Attachment ||
    !thumbnail.attachment
  ) {
    throw Error('invalid thumbnail provided')
  }
  const generatedImage = await generateThumbnail(
    title.value?.toString() || '',
    interaction.user.username,
    thumbnail.attachment.url,
    interaction.user.displayAvatarURL() || ''
  )
  await interaction.reply({
    content: `Here's your thumbnail, ${interaction.user}!`,
    files: [
      new AttachmentBuilder(generatedImage, {
        name: `${interaction.user.username}-thumbnail-${Date.now()}.png`,
      }),
    ],
  })
}

export default { data, execute } as Command
