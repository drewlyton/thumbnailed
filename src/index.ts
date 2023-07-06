import { Client, Collection, GatewayIntentBits, Options } from 'discord.js'
import * as Sentry from '@sentry/node'
import { CaptureConsole } from '@sentry/integrations'

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

const client = Object.assign(
  new Client({
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
        interval: 3600, // Every hour...
        lifetime: 1800, // Remove messages older than 30 minutes.
      },
      users: {
        interval: 3600, // Every hour...
        filter: () => user => user.bot && user.id !== client.user.id, // Remove all bots.
      },
    },
  }),
  { commands: new Collection() }
)

for (const command of Commands) {
  client.commands.set(command.data.name, command)
}

ready(client)
interactionCreate(client)

client.login(getEnv().DISCORD_BOT_TOKEN)
