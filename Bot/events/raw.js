module.exports = (client, raw) => {
	if (raw.t !== "INTERACTION_CREATE") return;
	let command = client.SlashCommands.get(raw.d.data.name);
	if (!command) return;
	let guild = client.guilds.cache.get(raw.d.guild_id);
	command.run(client, raw.d, guild);
};
