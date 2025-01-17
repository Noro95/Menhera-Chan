import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CommandInteraction } from "discord.js";
import type { MessageEmbedOptions } from "discord.js";
import { editGuildTag } from "../../database/functions/TagsFunctions";
import { CheckPerms } from "../../utils/functions/mod";
import config from "../../utils/config";
import { ReportBug } from "../../utils/functions/Custom";

const TagEdit: CommandInt = {
    name: "tag edit",
    description: "Edits a tag",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (
            !(await CheckPerms(
                interaction,
                interaction.user.id,
                "MANAGE_MESSAGES"
            ))
        ) {
            return;
        }
        const name = interaction.options.getString("name", true);
        const content = interaction.options.getString("content", false);
        const embed: MessageEmbedOptions | undefined =
            interaction.options.getString("embed", false)
                ? JSON.parse(interaction.options.getString("embed", false)!)
                : null;
        const result = await editGuildTag(
            interaction.guildId,
            name,
            content ? content : undefined,
            embed ? JSON.stringify(embed) : undefined
        );
        if (result) {
            interaction.reply({
                content: `Tag was updated successfully,\nTo try the tag use \`t.${name}\``,
            });
        } else {
            interaction.reply({
                content: `There was an error while updating the tag,\nIf this had happened more than once, Please contact the developers at ${config.links.server}`,
                ephemeral: true
            });
            await ReportBug(
                `Couldn't edit a tag in guildId: **${
                    interaction.guild.id
                }**,\ncontent: ${
                    content ? content : "Nothing (not null)"
                }\nembed: ${embed ? JSON.stringify(embed) : "No Embeds..."}`,
                interaction.user,
                interaction.guild
            );
            return;
        }
    },
};

export default TagEdit;
