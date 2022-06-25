import { Client, Collection, Intents } from "discord.js";
import path from "path";
import fs from "node:fs";
import WhatsappMessage from "@shoopi/whatsapp-cloud-api-responder";
import { Sender } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";
import Cache, {
  getConversation,
  getFeatureConversation,
  setFeatureConversation,
} from "@shoopi/whatsapp-cloud-api-cache";
import { IncomeMessage } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
import { DeployCommands } from "./deploy-commands";
import { CommandInterface } from "./command.interface";

export default class DiscorBot {
  private static instance: DiscorBot;
  public client: Client;
  private isLogin = false;

  private constructor() {
    this.client = new Client({
      shards: "auto",
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
    });

    DeployCommands();

    this.client.commands = new Collection();
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command: CommandInterface = require(filePath);
      this.client.commands.set(command.data.name, command);
    }
  }

  public async init(config?: { token: string; server: string; queue_channel: string }): Promise<void> {
    if (!this.isLogin) {
      try {
        const token = config?.token || process.env.DISCORD_TOKEN;
        if (!token) {
          throw new Error();
        }
        await this.client.login(token);
        this.isLogin = true;
        this.client.on("interactionCreate", async (interaction) => {
          if (!interaction.isCommand()) return;
          const command: CommandInterface = this.client.commands.get(interaction.commandName);
          if (!command) return;
          try {
            await command.run(interaction);
          } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
          }
        });
        this.client.on("messageCreate", async (message) => {
          if (!message.author.bot) {
            const id = message.channel.id;
            const channel = message.guild.channels.cache.get(id);
            const featureConversation = await getFeatureConversation(channel.name);
            if (featureConversation) {
              const whatsappMessage = new WhatsappMessage(featureConversation.sender.phone_number_id);
              whatsappMessage.sendMessage(featureConversation.contact.wa_id, {
                type: "text",
                text: { body: message.content },
              });
            }
          }
        });
      } catch (error) {
        this.client.destroy();
        process.exit(1);
      }
    }
  }

  public async SendMessage(message: IncomeMessage) {
    try {
      const conversation = await getConversation(message.from);
      if (conversation && conversation.context.type === "waiting_to_talk_with_human") {
        const channel = this.client.channels.cache.get(process.env.DISCORD_QUEUE_CHANNEL);
        if (channel.type === "GUILD_TEXT") {
          channel.send(`New user in queue **${conversation.id}**\nTopic: ${message.text.body}`);
          await setFeatureConversation(conversation.id, {
            id: conversation.id,
            topic: message.text.body,
            contact: conversation.contact,
            sender: conversation.sender,
          });
        }
      } else if (conversation && conversation.context.type === "talking_with_human") {
        const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
        const channel = guild.channels.cache.find((channel) => channel.name === conversation.id);
        if (channel?.type == "GUILD_TEXT") {
          const webhooks = await channel.fetchWebhooks();
          const webhook = webhooks.find((wh) => (wh.token ? true : false));
          if (!webhook) {
            return console.log("No webhook was found that I can use!");
          }
          if (message.type === "text") {
            await webhook.send({ content: message.text?.body });
          }
        }
      }
    } catch (error) {}
  }

  public static getInstance(): DiscorBot {
    if (!DiscorBot.instance) {
      Cache.getInstance().init();
      DiscorBot.instance = new DiscorBot();
    }

    return DiscorBot.instance;
  }

  public getMiddleware() {
    const _this = this;
    return async function DiscordBotMiddleware(sender: Sender, message: IncomeMessage, next: Function) {
      const conversation = await getConversation(message.from);
      if (
        conversation?.context?.type === "waiting_to_talk_with_human" ||
        conversation?.context?.type === "talking_with_human"
      ) {
        await _this.SendMessage(message);
      } else {
        next();
      }
    };
  }
}
