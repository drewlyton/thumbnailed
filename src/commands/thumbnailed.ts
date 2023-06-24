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

const data = new SlashCommandBuilder()
  .setName(
    getEnv().NODE_ENV === 'production' ? 'thumbailed' : 'thumbnailed-dev'
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
  // interaction.user.id
  const spanValidation = transaction.startChild({ op: 'validation' }) // This function returns a Span
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
