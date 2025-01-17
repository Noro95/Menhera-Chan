import BaseEvent from "../structures/BaseEvent";
import DiscordClient from "../client/client";
import { GuildBan, MessageEmbed } from "discord.js";
import { ModLog } from "../utils/functions/mod";

export default class Event extends BaseEvent {
    constructor() {
        super("guildBanAdd");
    }
    async run(client: DiscordClient, ban: GuildBan) {
        const reason = ban.reason ? ban.reason : "No Reason Provided";
        var embed = new MessageEmbed()
            .setTitle("Banned")
            .setColor("RANDOM")
            .addFields(
                {
                    name: "user:",
                    value: `\`${ban.user.username}(${ban.user.id})\``,
                },
                { name: "Reason", value: reason }
            );
        ModLog(client, ban.guild.id, embed);
    }
}
