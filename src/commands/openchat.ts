import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getConversation, getFeatureConversation, updateContext } from "@shoopi/whatsapp-cloud-api-cache";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("openchat")
    .setDescription("Create new WhatsApp chat")
    .addStringOption((options) => options.setName("id").setDescription("Queue id").setRequired(true)),
  async run(interaction: CommandInteraction) {
    const id = interaction.options.getString("id");
    const featureConversation = await getFeatureConversation(id);
    const conversation = await getConversation(featureConversation.contact.wa_id);
    let message = `The conversation doesn't exist or was deleted`;
    if (conversation && conversation.context.type === "waiting_to_talk_with_human") {
      await updateContext(conversation.contact.wa_id, "talking_with_human");
      const parent = interaction.channel.parentId;
      const channel = await interaction.guild.channels.create(conversation.id, {
        parent: process.env.DISCORD_CHATS_CATEGORY || parent,
      });
      await channel.createWebhook("Batman", { avatar: "https://i.imgur.com/9dKKPME.png" });
      channel.setTopic(featureConversation.topic);
      message = `New conversation in the channel: <#${channel.id}>`;
    }
    await interaction.reply({ content: message, ephemeral: true });
  },
};
