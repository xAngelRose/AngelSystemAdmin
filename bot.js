const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

client.on('ready', () => {
  console.log(`-------------------------------\nWelcome to the system Admin With Mysql\nCreator / Developper : AngelRose#9999\nConnected to ${client.user.tag}!\n-------------------------------`);
});

var mysql      = require('mysql');
var con   = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'DiscordDB'
});

function QueryDb(sql, cb){
  con.getConnection(function(err, connection) {
    if (err) {
		console.log(err)
		return
	  }    
    connection.query(sql, function (err, result) {
        connection.release();
      if (err) {
		console.log(err)
		return
	  }
      cb(result).catch(function(error) {
		  console.error(error);
		});
    });
  });
}

client.on('message', message => {
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let userid = message.author.id;
  if (message.content.indexOf(config.prefix) !== 0) return;

  if(command === "mod") {
    QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result10){
      if(result10[0] && (result10[0].modo == 2) ){
      }else{
        message.channel.send("You dont have permission")
        return
      }
      let member = message.mentions.members.first();
      if(args[0] == "add") {
        QueryDb("INSERT INTO `moderator`(`DiscordID`, `modo`) VALUES ('"+member+"',1)", async function(result2){
        message.channel.send("I added the moderator : <@" + member + ">")
        })
      }
      if(args[0] == "remove") {
        QueryDb("DELETE FROM moderator WHERE DiscordID = '"+member.id+"'", async function(result4){
        message.channel.send("I deleted the moderator: <@" + member + ">")
        })
      }
      if(member == undefined) {
        message.channel.send("Misuse of the command\nExample: !mod add/remove @blabla")
      }
      if(args[0] == undefined) {
        message.channel.send("Misuse of the command\nExample: !mod add/remove @blabla")
      }
    })
    }
    if(command === "admintest") {
      QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result99){
        if(result99[0] && (result99[0].modo == 1)){
          message.channel.send("you're a moderator")
          //your code if moderator
        }else if(result99[0] && (result99[0].modo == 2)){
          message.channel.send("YOU HAVE FUCKING ALL PERM")
          //your code if not moderator
        }else{
          message.channel.send("You just user")
        }
      })
    }
    if(command === "ban") {
      QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result999){
        if(result999[0] && (result999[0].modo == 1) || result999[0] && (result999[0].modo == 2)){
          const user = message.mentions.users.first();
          if(user === undefined) {
            message.channel.send("[-] You need mentions user")
            return
          }
          const member = message.guild.member(user);
          let {guild} = message;
          let raison = args.slice(1).join(' '); // arguments should already be defined
          if(raison === undefined) {
            message.channel.send("[-] You need say a reason")
            return
          }
          member.send("[-] You have been banned from server : ``" + guild.name + "`` | Reason : ``" + raison + "``")
          member
          .ban({
            reason: raison,
          })
          message.channel.send("[+] Successfully banned")
        }else{
          message.channel.send("[-] You dont have permission")
        }
        })
    }
    if(command === "kick") {
      QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result9999){
        if(result9999[0] && (result9999[0].modo == 1) || result9999[0] && (result9999[0].modo == 2)){
          const user = message.mentions.users.first();
          if(user === undefined) {
            message.channel.send("[-] You need mentions user")
            return
          }
          const member = message.guild.member(user);
          let {guild} = message;
          let raison = args.slice(1).join(' '); // arguments should already be defined
          if(raison === undefined) {
            message.channel.send("[-] You need say a reason")
            return
          }
          member.send("[-] You have been kicked from server : ``" + guild.name + "`` | Reason : ``" + raison + "``")
          member
          .kick({
            reason: raison,
          })
          message.channel.send("[+] Successfully kicked")
        }else{
          message.channel.send("[-] You dont have permission")
        }
        })
    }
    if(command === "clear") {
      QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result9999){
        if(result9999[0] && (result9999[0].modo == 1) || result9999[0] && (result9999[0].modo == 2)){
    }else{
      message.channel.send("[-] You dont have permission")
      return
    }
})
      const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
      const amount = args.join(' '); // Amount of messages which should be deleted
      if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
      if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
      if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
      if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1
      message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
      message.channel.bulkDelete(messages)
});
    }
});

client.login(config.token);
