import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from 'discord.js'
import * as Sentry from '@sentry/node'
import { Command } from './Command'
import { generateThumbnail } from '../utils/generateThumbnail'
import { getEnv } from '../getEnv'
import { allowedContentTypes } from '../utils/allowedContentTypes'

const data = new SlashCommandBuilder()
  .setName(
    getEnv().NODE_ENV === 'production' ? 'thumbnailed' : 'thumbnailed-dev'
  )
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
  const transaction = Sentry.startTransaction({
    name: 'generateThumbnail.execute',
  })

  // Set transaction on scope to associate with errors and get included span instrumentation
  // If there's currently an unfinished transaction, it may be dropped
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction))

  Sentry.setUser({ id: interaction.user.id })
  const spanValidation = transaction.startChild({ op: 'validation' }) // This function returns a Span
  const title = interaction.options.get('title')
  const thumbnail = interaction.options.get('thumbnail')
  if (
    !title ||
    title.type !== ApplicationCommandOptionType.String ||
    !title.value
  ) {
    await interaction.reply({
      ephemeral: true,
      content: `Hey ${interaction.user} 👋, please check your title and try again.`,
    })
    return
  }
  if (
    !thumbnail ||
    thumbnail.type !== ApplicationCommandOptionType.Attachment ||
    !thumbnail.attachment ||
    !allowedContentTypes.includes(thumbnail.attachment.contentType || '')
  ) {
    await interaction.reply({
      ephemeral: true,
      content: `Hey ${interaction.user} 👋, please check your thumbnail is a '.jpg', '.jpeg', '.png' or '.gif' and try again.`,
    })
    return
  }
  spanValidation.finish()
  const generatedImage = await generateThumbnail(
    title.value?.toString() || '',
    interaction.user.username,
    thumbnail.attachment.url,
    interaction.user.displayAvatarURL() || ''
  )
  const spanReply = transaction.startChild({
    op: 'interaction.reply',
    description: 'Sending back attachment to discord caller.',
  })
  await interaction.reply({
    content: `Here's your thumbnail, ${interaction.user}!`,
    files: [
      new AttachmentBuilder(generatedImage, {
        name: `${interaction.user.username}-thumbnail-${Date.now()}.png`,
      }),
    ],
  })
  spanReply.finish()
  transaction.finish()
}

export default { data, execute } as Command
