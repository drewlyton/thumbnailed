import { Client, Collection, GatewayIntentBits } from 'discord.js'
import * as Sentry from '@sentry/node'
import { CaptureConsole } from '@sentry/integrations'
import { Commands } from './commands'
import { getEnv } from './getEnv'
import interactionCreate from './listeners/interactionCreate'
import ready from './listeners/ready'

Sentry.init({
  integrations: [new CaptureConsole()],
  environment: process.env.NODE_ENV,
  release: 'thumbnailed@' + process.env.npm_package_version,
})

const client = Object.assign(
  new Client({ intents: [GatewayIntentBits.Guilds] }),
  { commands: new Collection() }
)

for (const command of Commands) {
  client.commands.set(command.data.name, command)
}

ready(client)
interactionCreate(client)

client.login(getEnv().DISCORD_BOT_TOKEN)
