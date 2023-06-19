import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { Commands } from './commands'
import { getEnv } from './getEnv'
import interactionCreate from './listeners/interactionCreate'
import ready from './listeners/ready'

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
