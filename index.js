const ms = require("ms");
const moment = require("moment")
const fs = require("fs");
const db = require("pro.db")
const Discord = require("discord.js")
const client = new Discord.Client({ intents: 32767 })
const prefix = "$"
const { MessageEmbed } = require('discord.js')
client.on("ready", async () => {
  console.log(`${client.user.username} im Ready`)
  client.user.setActivity(`${client.user.username}`);
  client.user.setStatus("online");

})




client.on("messageCreate" , async message => {
  if(message.content.startsWith("فحص")) {
        const args = message.content.split(' ');
  
    const user = message.mentions.users.first() || client.users.cache.get(args[1]);  
    if(!user) return message.reply("> \`-\` **ضـع أي دي أو مـنـشـن الـشـخـص .**")
    if(user.bot) return message.reply("> \`-\` ** مفيش بوت نصاب -__-  .**")
    let embed1 = new MessageEmbed()
    .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic:true}))
       .setTitle("** فحص شخص **")
    .setDescription(`** ليس موجود في قائمه النصابين**`)
    .setFooter("ولكن انتبه ! هذا لا يعني انه مضمون" , message.guild.iconURL())
    .setColor(`#1a1a1a`)
    if(!db.has(`user_${user.id}`)) return message.reply({embeds:[embed1]})
    const userid = db.fetch(`user_${user.id}`)
    const reason = db.fetch(`reason_${user.id}`)
    let embed = new MessageEmbed()
    .setAuthor(user.tag , user.displayAvatarURL({dynamic:true}))
        .setTitle("** فحص شخص **")
      	.addFields(
		{ name: 'الحاله', value: '! نصاب' },
		{ name: 'الاسم عند الاضافه', value: `${user.username}` },
		{ name: 'الايدي', value: `${user.id}`, inline: true },
		{ name: 'عمليه النصاب', value: `${reason}`, inline: true },
	)
      .setFooter(message.guild.name , message.guild.iconURL())
    .setColor(`#1a1a1a`)
    message.channel.send({embeds:[embed]})
  }
});

client.on("messageCreate" , async message => {
  if(message.content.startsWith("نصاب")) {
  if(!message.member.permissions.has("ADMINISTRATOR")) return; 
    const user = message.mentions.members.first()
    if(!user) return message.reply("> \`-\` **ضـع أي دي أو مـنـشـن الـشـخـص .**")
    if(user.bot) return message.reply("> \`-\` **لا يمكن اضافت بوت.**")
    let member = message.author;
    if(user == member) return message.reply("> \`-\` **لا تسطيع اضافت نفسك .**")
        if(db.has(`user_${user.id}`,`reason_${user.id}`)) return message.reply("> \`-\` **هـذا الشخص موجود في القائمه النصبين بي الفعل .**")
    const reason = message.content.split(" ").slice(2).join(" ")
    if(!reason) return message.reply("> \`-\` **ضع السبب .**")
    db.set(`user_${user.id}`, user.id)
    db.set(`reason_${user.id}`, reason)
    await message.reply(`> \`-\` **تـم أضـافـة ${user}  في فائمه النصابين ✅ .**`)
  }
});


 client.on("messageCreate" , async message => {  
    if(message.content.startsWith("مسح")) {
       const args = message.content.split(' ');
    if(!message.member.permissions.has("ADMINISTRATOR")) return;  
    const user = message.mentions.members.first() || client.users.cache.get(args[1]);  
    if(!user) return message.reply("> \`-\` **ضـع أي دي أو مـنـشـن الـشـخـص .**")
    if(user.bot) return message.reply("> \`-\` ** مفيش بوت نصاب -__-  .**")
    let member = message.author;
    // if(user == member) return message.reply("> \`-\` **لا تـسـتـطـيـع أزالـة نـفـسـك .**")
      let embed1 = new MessageEmbed()
    .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic:true}))
     .setDescription(`** ليس موجود في قائمه النصابين**`)
    .setFooter(message.guild.name , message.guild.iconURL())
    .setColor(`#1a1a1a`)
     if(!db.has(`user_${user.id}`)) return message.reply({embeds:[embed1]})
    db.delete(`user_${user.id}`)
    db.delete(`reason_${user.id}`)
    message.reply(`> \`-\` **تـم أزالـة ${user} من قائمه النصابين ✅ .**`)
  }
});

client.login(process.env.token);
  