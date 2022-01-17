import BaseCommand from "../../structures/BaseCommand";
import DiscordClient from "../../client/client";
import {
    CommandInteraction,
    MessageEmbed
} from "discord.js";
import fetch from "cross-fetch";
import { embed } from "../../utils/functions/embed";

export default class AniCharCommand extends BaseCommand {
    constructor() {
        super("ani char", "Search for a character in anilist's database");
    }
    async run(client: DiscordClient, interaction: CommandInteraction) {
        let name = interaction.options.getString("name", true);
        var query = `query ($id: Int, $page: Int, $perPage: Int, $search: String) {
            Page(page: $page, perPage: $perPage) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              characters(id: $id, search: $search) {
                name {
                  full
                }
                image {
                  large
                }
                description
                gender
                age
                anime: media(page: 1, perPage: 5, type: ANIME) {
                  nodes {
                    title {
                      romaji
                    }
                  }
                }
                manga: media(page: 1, perPage: 5, type: MANGA) {
                  nodes {
                    title {
                      romaji
                    }
                  }
                }
              }
            }
          }`;
        var variables = {
            search: name,
            page: 1,
            perPage: 25,
        };

        var url = "https://graphql.anilist.co",
            options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables,
                }),
            };

        var AnimeData = await fetch(url, options)
            .then(handleResponse)
            .catch(console.error);

        if (AnimeData == undefined) {
            interaction.followUp({ content: `Could not find anything` });
            return;
        }
        var data = AnimeData.data.Page.characters;
        var page = 0;
        var embeds: MessageEmbed[] = [];
        data.forEach((element1: any) => {
            var anime = "";
            var manga = "";
            element1.anime.nodes.forEach((Aelement: any) => {
                anime = Aelement.title.romaji + ` \n` + anime;
            });
            element1.manga.nodes.forEach((Melement: any) => {
                manga = Melement.title.romaji + ` \n` + manga;
            });
            const embed = new MessageEmbed()
                .setTitle(element1.name.full)
                .setImage(element1.image.large)
                .setDescription("No description available.")
                .addField(
                    "Gender",
                    element1.gender == null ? "Not available." : element1.gender
                )
                .addField(
                    "Age",
                    element1.age == null ? "Not available." : element1.age
                )
                .addField("Anime", anime ? anime : "None")
                .addField("Manga", manga ? manga : "None");
            if (element1.description != null) {
                if (element1.description.length < 2000) {
                    embed.setDescription(element1.description.toString());
                } else {
                    embed.setDescription(
                        (element1.description as string).slice(
                            0,
                            2000 - element1.description.length
                        ) + "..."
                    );
                }
            }
            embeds.push(embed);
        });
        await embed(interaction,embeds,page);
    }
}

async function handleResponse(response: Response) {
    const json = await response.json();
    return response.ok ? json : Promise.reject(json);
}