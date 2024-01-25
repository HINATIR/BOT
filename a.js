const token = process.env('TOKEN')
const clientid = process.env('CLIENTID')
const fs = require("fs");
const Discord = require("discord.js");
const { ModalBuilder,TextInputBuilder,Client, PermissionsBitField,ActivityType , DMChannel,GatewayIntentBits, Partials ,ChannelType,EmbedBuilder,ActionRowBuilder,SlashCommandBuilder,SelectMenuBuilder,InteractionType,StringSelectMenuBuilder,StringSelectMenuOptionBuilder} = require('discord.js');
const client = new Discord.Client({intents: [
  Discord.GatewayIntentBits.DirectMessageReactions,
  Discord.GatewayIntentBits.DirectMessageTyping,
  Discord.GatewayIntentBits.DirectMessages,
  Discord.GatewayIntentBits.GuildBans,
  Discord.GatewayIntentBits.GuildEmojisAndStickers,
  Discord.GatewayIntentBits.GuildIntegrations,
  Discord.GatewayIntentBits.GuildInvites,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessageReactions,
  Discord.GatewayIntentBits.GuildMessageTyping,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.GuildPresences,
  Discord.GatewayIntentBits.GuildScheduledEvents,
  Discord.GatewayIntentBits.GuildVoiceStates,
  Discord.GatewayIntentBits.GuildWebhooks,
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.MessageContent
], partials: [
  Discord.Partials.Channel,
  Discord.Partials.GuildMember,
  Discord.Partials.GuildScheduledEvent,
  Discord.Partials.Message,
  Discord.Partials.Reaction,
  Discord.Partials.ThreadMember,
  Discord.Partials.User
]});
//現在時間
function nowtime(){
  var now = new Date();
  d = now.getDate()
  h = now.getHours()
  m = now.getMinutes()
  s = now.getSeconds()
}
//mainBOT
client.on('ready', async () => {
	nowtime()
  console.log(`{${d}日${h}時${m}分${s}秒} [BOT起動]\x1b[35m パッケージバージョン:${Discord.version}\u001b[0m `);
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing }],
    status: 'dnd',
  });
});

client.on('guildCreate', guild => {
  nowtime()
  console.log(`{${d}日${h}時${m}分${s}秒} [BOT追加]  \x1b[36m${guild.name}\x1b[0m(${guild.id})に追加された`)
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing }],
    status: 'dnd',
  });
})
client.on('guildDelete', guild => {
  nowtime()
  console.log(`{${d}日${h}時${m}分${s}秒} [BOT削除]  \x1b[36m${guild.name}\x1b[0m(${guild.id})から消された`)
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size}サーバー`, type: ActivityType.Competing }],
    status: 'dnd',
  });
})

const tex = new SlashCommandBuilder()
.setName('tex')
.setDescription('texコードを画像にします。')
.addStringOption(option =>
  option
        .setName('color')
        .setDescription('文字色を設定します。')
        .setRequired(true)
        .addChoices(
          {name:'文字色白', value:'t'},
          {name:'文字色黒', value:'f'}
        )
)


const commands = [tex]
const { REST } = require('@discordjs/rest');
 const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(token)
async function main(){
 	await rest.put(
			Routes.applicationCommands(clientid),
			{ body: commands }
		)
}
main().catch(err => console.log(err))

var colors = []
client.on('interactionCreate', async (interaction,) => {
  // コマンド実行時
  if (interaction.type === InteractionType.ApplicationCommand) {
    if(interaction.commandName == 'tex'){

      for(i=0;i < colors.length;i++){
        if(colors[i][0] == interaction.user.id){
          colors.splice(i, 1)
        }
      }
      colors.push([interaction.user.id,interaction.options.getString('color')])

      const modal = new ModalBuilder()
 				.setTitle("texから画像に")
 				.setCustomId("user_submit");
      const TextInput = new TextInputBuilder()
 				.setLabel("Texのソースを入れてね")
 				.setCustomId("code")
        .setMaxLength(1950)
 				.setStyle('Paragraph')
 				.setRequired(true);
      const ActionRow = new ActionRowBuilder().setComponents(TextInput);
      modal.setComponents(ActionRow);
 			return interaction.showModal(modal);

    }
  }
})
client.on('interactionCreate', async (interaction) => {
  if (interaction.user.bot) return;
  if(!interaction.guild)return;
  if (!interaction.isModalSubmit()) return;
    if (interaction.customId == "user_submit"){
      for(i=0;i < colors.length;i++){
        if(colors[i][0] == interaction.user.id){
          interaction.reply({files: ['https://texclip.marutank.net/render.php/texclip20240115181015.png?s='+ encodeURIComponent(interaction.fields.getTextInputValue('code'))+'&f=nt&r=300&m=pn&b=f&k='+colors[i][1]] })
          console.log(`{${d}日${h}時${m}分${s}秒} [Tex2img] \u001b[32m${interaction.user.displayName}\u001b[0mが使用`);
        }
      }
      
    }
});

client.login(token);