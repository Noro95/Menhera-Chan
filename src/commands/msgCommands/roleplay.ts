import CommandInt from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import { Message, User } from "discord.js";
import { getRolePlayGifs } from "../../database/functions/RolePlayFunctions";
import { CustomEmbed, rpTextCollection } from "../../utils/functions/Custom";

const RolePlay: CommandInt = {
    name: "roleplay",
    description: "roleplay message interactions",
    requireArgs: true,
    usage: "<action> [user(s)]",
    example: [
        "bully @Noro#4477",
        "bite @Noro#4477",
        "cry @Noro#4477 @Julio_#7057",
        "cuddle @Noro#4477",
        "greet @Major Senpai スレーブマスター#7814",
        "highfive @Major Senpai スレーブマスター#7814",
        "kill @Noro#4477",
        "kiss @Julio_#7057 @Noro#4477 @Major Senpai スレーブマスター#7814",
        "pat @Julio_#7057",
        "tickle @Noro#4477",
        "tsundere",
        "tsundere @Julio_#7057",
        "yeet @Noro#4477",
        "smile @Major Senpai スレーブマスター#7814",
        "punch @Noro#4477",
        "lick @Major Senpai スレーブマスター#7814",
    ],
    aliases: [
        "bully",
        "bite",
        "cry",
        "cuddle",
        "greet",
        "highfive",
        "kill",
        "kiss",
        "pat",
        "tickle",
        "tsundere",
        "yeet",
        "smile",
        "punch",
        "lick",
    ],
    async run(
        client: DiscordClient,
        message: Message,
        args: string[],
        cmdName: string
    ) {
        if (cmdName == "roleplay") return;
        const author = message.author;
        let members = getMentions(message);
        if (members.length < 1) {
            const embed = new CustomEmbed(message, false).setDescription(
                "You have to mention someone!"
            );
            return await message.reply({ embeds: [embed] });
        }
        // Writing user's message
        let user_msg = getText(message, members[members.length - 1]);
        user_msg ? (user_msg = `~ ` + user_msg) : (user_msg = " ");
        if (user_msg && user_msg.length > 500) {
            user_msg = "||~ Text is too long ||";
        }
        if (members.includes(author)) {
            const embed = new CustomEmbed(message, false).setDescription(
                "You can't roleplay on yourself!"
            );
            return await message.reply({ embeds: [embed] });
        }
        // Defining the embed
        const embed = new CustomEmbed(message);
        // Getting the collection and array
        const textarray = rpTextCollection(
            author.id,
            (members.length > 1
                ? members
                      .filter((u) => u.id != members[members.length - 1].id)
                      .map((u) => u.id)
                      .join(">, <@!") + "> and <@!"
                : "") + members[members.length - 1].id
        ).get(cmdName as RpTypes)!;
        // Choosing text
        const rtxt = textarray[Math.floor(Math.random() * textarray.length)];
        if (cmdName == "tsundere") {
            embed.setDescription(
                `<@!${author.id}> to ${members.map(
                    (m) => `<@!${m.id}>`
                )}:\n**${rtxt}**`
            );
        } else {
            // Getting an img from mongodb
            let data = (await getRolePlayGifs(cmdName))?.get("images");
            if (data == null || undefined) {
                return await message.reply({
                    content: "This command is currently not working",
                });
            }
            embed
                .setImage(data[Math.floor(Math.random() * data.length)])
                .setDescription(`**${rtxt}** ${user_msg}`);
        }

        return await message.reply({ embeds: [embed] });
    },
};

function getMentions(message: Message) {
    let mentions = [];
    if (message.mentions.repliedUser) {
        mentions.push(message.mentions.repliedUser);
    }
    if (message.mentions.users) {
        mentions = message.mentions.users.map((u) => u);
    }
    return mentions;
}

function getText(message: Message, lastMention: User) {
    return message.content.split(lastMention.id + ">")[1];
}

export default RolePlay;
