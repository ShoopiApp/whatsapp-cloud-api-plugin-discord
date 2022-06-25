import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  deleteConversation,
  deleteFeatureConversation,
  getConversation,
  getFeatureConversation,
} from "@shoopi/whatsapp-cloud-api-cache";

module.exports = {
  data: new SlashCommandBuilder().setName("closechat").setDescription("Close the current chat"),
  async run(interaction: CommandInteraction) {
    const featureConversation = await getFeatureConversation(interaction.channel.name);
    let message = `The conversation doesn't exist or was already deleted`;
    if (featureConversation) {
      const conversation = await getConversation(featureConversation.contact.wa_id);
      if (conversation && conversation.context.type === "talking_with_human") {
        deleteFeatureConversation(featureConversation.id);
        deleteConversation(conversation.contact.wa_id);
        message = `The conversation will be deleted soon`;
      }
    }
    await interaction.reply({ content: message, ephemeral: true });
    setTimeout(async () => {
      await interaction.channel.delete();
    }, 3000);
  },
};
