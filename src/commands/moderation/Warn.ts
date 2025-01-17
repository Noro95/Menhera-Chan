import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { CheckPermsBoth } from "../../utils/functions/mod";
import { CommandInteraction, MessageEmbed } from "discord.js";
import config from "../../utils/config";
import { addWarn } from "../../database/functions/WarnsFunctions";

const ModWarn: CommandInt = {
    name: "mod warn",
    description: "Warn a user",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!(await CheckPermsBoth(interaction, "MANAGE_MESSAGES"))) {
            return;
        }
        const member = interaction.options.getMember("user", true);
        const reason =
            interaction.options.getString("reason", false) ||
            "No Reason Provided";
        addWarn(
            interaction.guild.id,
            member.user.id,
            interaction.user.id,
            reason
        );
        try {
            const message = await interaction.reply({
                embeds: [
                    new MessageEmbed().setDescription(
                        `${config.emojis.whiteHeavyCheckMark} Warned **${member.user.tag}**\nReason: ${reason}`
                    ),
                ],
                fetchReply: true,
            });
            member
                .send({
                    content: `You were warned in ${interaction.guild.name}\nReason: ${reason}`,
                })
                .catch((err) => {
                    message
                        .edit({ content: `Couldn't dm **${member.user.tag}**` })
                        .catch((e) => {});
                });
            return;
        } catch {
            await interaction.reply({
                content: `${config.emojis.redCrossMark} Command errored out`,
                ephemeral: true,
            });
            return;
        }
    },
};

export default ModWarn;
