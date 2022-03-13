import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { getBalance } from "../../database/functions/EconFunctions";

import { CommandInteraction } from "discord.js";
import { CustomEmbed } from "../../utils/functions/Custom";

export default class EconBalanceCommand extends BaseCommand {
    constructor() {
        super("econ balance", "Shows Balance");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        const balance = await getBalance(interaction.user.id!);
        const embed = new CustomEmbed(interaction, false)
            .setTitle(`${interaction.user.username}'s Balance`)
            .setDescription(`Coins:\n${balance}`);

        await interaction.followUp({ embeds: [embed] });
    }
}
