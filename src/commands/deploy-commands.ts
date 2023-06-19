import { REST, Routes } from 'discord.js'
import { Commands } from '.'
import { getEnv } from '../getEnv'

;(async () => {
  const rest = new REST().setToken(getEnv().DISCORD_BOT_TOKEN)
  const commands = Commands.map(c => c.data.toJSON())

  console.info(
    `Started refreshing ${commands.length} application (/) commands.`
  )

  //   In production, make the (/) commands global and not server specific
  const applicationCommands =
    getEnv().NODE_ENV === 'production'
      ? Routes.applicationCommands(getEnv().CLIENT_ID)
      : Routes.applicationGuildCommands(getEnv().CLIENT_ID, getEnv().SERVER_ID)

  try {
    const data = (await rest.put(applicationCommands, {
      body: commands,
    })) as unknown[]

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    )
  } catch (e) {
    console.error(e)
  }
})()
