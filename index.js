const Discord = require ('discord.js');
const fs = require("fs");
const ImageDataURI = require("image-data-uri");
var swearjar = require('swearjar');
const WolframAlphaAPI = require('wolfram-alpha-api');
const client = new Discord.Client();
const version = 'Wolfram Alpha Discord V1.0.0';
const PREFIX = '?'
const imagePath = './images/wolf'

const secretsFile = fs.readFileSync('./secrets.json'); //Load Secrets File
const secrets = JSON.parse(secretsFile); //Parse Secrets File
const discordToken = secrets.discordToken;
const waApi = WolframAlphaAPI(secrets.wolframToken);

const talkedRecently = new Set();

client.on('message', msg=>{
    if (msg.author.bot) return;
    let args = msg.content.split(' ');
    let lastWordStr = args[args.length - 1]
    let lastWordArr = lastWordStr.split('');
    if(lastWordArr[lastWordArr.length - 1] == '?') {
        if(swearjar.profane(msg.content) == false) {
            msg.channel.send(`Let me think about that one for a second... 🤔`)
                .then(message => {
                    message.delete({ timeout: 3000 })
                }).catch(console.error);
            waApi.getSimple({i: msg.content, background: '2F3136', foreground: 'white', fontsize: '22', width: '1600'}).then((queryresult) => {
                ImageDataURI.outputFile(queryresult, imagePath)
                    .then(res =>{
                        console.log('Image Saved')
                        let output = new Discord.MessageEmbed()
                            .setTitle(msg.content)
                            .setColor('2F3136')
                            .attachFiles(['./images/wolf.gif'])
                            .setImage('attachment://wolf.gif')
                            .setFooter('This message will auto-delete in 60 seconds');
                        msg.channel.send(output)
                            .then(message => {
                                message.delete({ timeout: 60000 })
                            }).catch(console.error);
                    })
              }).catch(console.error);
        } else {
            msg.channel.send(`⛔ Sorry please don't use profanity in your questions.`)
                .then(message => {
                    message.delete({ timeout: 10000 })
                }).catch(console.error);
        }
    }
});

console.log('Loading Bot...')
client.on('ready', () => {
    console.log('Bot Loaded');
})

client.login(discordToken);