const Discord = require("discord.js");
const config = require("../config.json");
const guilds = require("../models/guilds");
module.exports.run = async (client, message, args) => {
  guilds.findOne({ guild_id: message.guild.id }, (err, guild) => {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.channel.send(
        "You don't have permission to use this command."
      );
    let settingsEmbed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter(client.user.username, client.user.avatarURL);
    if (!args[0]) {
      let vchannel = "";
      let checkC = message.guild.channels.get(guild.verifychannel);
      if (checkC) {
        vchannel += checkC;
      } else vchannel += "None";
      let vrole = "";
      let checkR = message.guild.roles.get(guild.verifyrole);
      if (checkR) {
        vrole += checkR;
      } else vrole += "None";
      settingsEmbed.setTitle("Settings for " + message.guild.name);
      settingsEmbed.setThumbnail(message.guild.iconURL);
      settingsEmbed.addField(
        "Verify Channel",
        vchannel +
          "\n\n`" +
          config.prefix +
          "settings verifyc <channel>` to set a new channel."
      );
      settingsEmbed.addField(
        "Verify Role",
        vrole +
          "\n\n`" +
          config.prefix +
          "settings verifyr <role>` to set a new role."
      );
      message.channel.send(settingsEmbed);
    }
    if (args[0] === "verifyc") {
      if (args[1]) {
        let checkR = message.guild.channels.get(
          message.content.replace(/\D/g, "")
        );
        if (!checkR) {
          settingsEmbed.setColor("RED");
          settingsEmbed.setTitle(":x: Error");
          settingsEmbed.setDescription("An invalid channel was inserted.");
          message.channel.send(settingsEmbed);
          return;
        }
        guild.verifychannel = message.content.replace(/\D/g, "");
        guild
          .save()
          .catch(err =>
            message.channel.send("Couldn't update the verify channel.")
          );
        settingsEmbed.setTitle(":white_check_mark: Success");
        settingsEmbed.setDescription("The verify channel is now on " + checkR);
        message.channel.send(settingsEmbed);
      } else {
        settingsEmbed.setColor("RED");
        settingsEmbed.setTitle(":x: Error");
        settingsEmbed.setDescription("No channel was inserted.");
        message.channel.send(settingsEmbed);
      }
    }
    if (args[0] === "verifyr") {
      if (args[1]) {
        let checkR = message.guild.roles.get(
          message.content.replace(/\D/g, "")
        );
        if (!checkR) {
          settingsEmbed.setColor("RED");
          settingsEmbed.setTitle(":x: Error");
          settingsEmbed.setDescription("An invalid role was inserted.");
          message.channel.send(settingsEmbed);
          return;
        }
        guild.verifyrole = message.content.replace(/\D/g, "");
        guild
          .save()
          .catch(err =>
            message.channel.send("Couldn't update the verify role.")
          );
        settingsEmbed.setTitle(":white_check_mark: Success");
        settingsEmbed.setDescription("The verify role was set to " + checkR);
        message.channel.send(settingsEmbed);
      } else {
        settingsEmbed.setColor("RED");
        settingsEmbed.setTitle(":x: Error");
        settingsEmbed.setDescription("No role was inserted.");
        message.channel.send(settingsEmbed);
      }
    }
  });
};

module.exports.help = {
  name: "settings",
  aliases: [],
  usage: ["<verifyc {channel}> or <verifyr {role}>"]
};
