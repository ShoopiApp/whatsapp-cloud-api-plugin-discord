import path from "path";
import fs from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CommandInterface } from "./command.interface";

export const DeployCommands = () => {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: CommandInterface = require(filePath);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

  rest
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
};
