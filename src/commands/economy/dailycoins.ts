import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
const DBL = require("dbl-api");

import { CommandInteraction } from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

const EconDailyCoins: CommandInt = {
    name: "econ dailycoins",
    description: "get daility coins",
    async run(
        client: DiscordClient,
        interaction: CommandInteraction<"cached">
    ) {
        if (!client.guildSettings.get(interaction.guildId)?.misc.econ) {
            interaction.reply({
                content: "This command is disabled in this server",
                ephemeral: true
            });
            return;
        }
        const DBL_TOKEN = process.env.DBL_TOKEN;
        if (DBL_TOKEN == ("" || undefined)) {
            interaction.reply({
                content: "Command not set up.",
            });
            return;
        }
        const dbl = new DBL(DBL_TOKEN, client);
        const embed = new CustomEmbed(interaction);
        dbl.hasVoted(interaction.member?.user.id).then((votes: any) => {
            if (votes == false) {
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            `vote to get daily coins \nGo to https://top.gg/bot/${client.user?.id} to vote!`
                        ),
                    ],
                });
                return;
            } else {
                interaction.reply({
                    embeds: [
                        embed.setDescription(
                            "You already got you daily coins! \nCome back at a later time."
                        ),
                    ],
                    ephemeral: true
                });
                return;
            }
        });
        return;
    },
};

export default EconDailyCoins;
