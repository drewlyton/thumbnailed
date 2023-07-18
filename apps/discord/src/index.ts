import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/node'
import { Client, Collection, GatewayIntentBits, Options } from 'discord.js'

import { Commands } from './commands'
import { getEnv } from './getEnv'
import interactionCreate from './listeners/interactionCreate'
import ready from './listeners/ready'

Sentry.init({
  integrations: [new CaptureConsole()], //, new ProfilingIntegration()],
  environment: process.env.NODE_ENV,
  release: 'thumbnailed@' + process.env.npm_package_version,
  profilesSampleRate: 1.0,
})

const botClient: Client = new Client({
  intents: [GatewayIntentBits.Guilds],
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    ApplicationCommandManager: 0,
    AutoModerationRuleManager: 0,
    BaseGuildEmojiManager: 0,
    GuildBanManager: 0,
    GuildEmojiManager: 0,
    GuildForumThreadManager: 0,
    GuildInviteManager: 0,
    GuildMemberManager: 0,
    GuildScheduledEventManager: 0,
    GuildStickerManager: 0,
    GuildTextThreadManager: 0,
    MessageManager: 0,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
    UserManager: 0,
    VoiceStateManager: 0,
  }),
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 1800, // Every 30 minutes...
      lifetime: 900, // Remove messages older than 15 minutes.
    },
    users: {
      interval: 1800, // Every 30 minutes ...
      filter: () => (user) => {
        if (botClient.user) {
          return user.id !== botClient.user.id
        } else {
          return false
        }
      }, // Clear everyone except us
    },
  },
})
const client = Object.assign(botClient, { commands: new Collection() })

for (const command of Commands) {
  client.commands.set(command.data.name, command)
}

ready(client)
interactionCreate(client)

client.login(getEnv().DISCORD_BOT_TOKEN)
