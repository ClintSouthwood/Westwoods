let Discord = require('discord.js');
let WebSocket = require('ws')
let moment = require('moment')
require('dotenv').config();

let c = new Discord.Client();

let ip = process.env.IP;
let port = process.env.PORT;
let pass = process.env.PASS;

function pres() {
    c.user.setActivity(`Server is loading ...`, {
        type: "STREAMING",
        url: "https://twitch.tv/apinkpanther"
    })
}

function connect() {
    let url = 'ws://' + ip + ':' + port + '/' + pass;
    let client = new WebSocket(url)

    function send(channel, embed) {
        if (channel) {
            c.channels.fetch(channel)
                .then(channel => channel.send(embed));
        } else {
            console.log('There is no channel.');
        }
    }

    client.onopen = function(event) {
        console.log(`Connected to ${url}`)
        setTimeout(() => {
            send(process.env.CONNECT_CHAN, process.env.CONNECT_MSG)
        }, 2000);

        setInterval(() => {
            client.send(JSON.stringify({
                Identifier: 300,
                Message: 'serverinfo',
                Username: 'Clint Westwood'
            }))
        }, process.env.RELOAD);
        pres();
    };
    // Now this shit is long as fuck
    client.onmessage = function(event) {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data.Identifier != 300) {
            if (data.Type === 'Generic') {
                if (['giv', 'kill', 'teleport', 'slay'].some(substring => data.Message.toLowerCase().includes(substring))) {
                    let abuse = new Discord.MessageEmbed()
                        .setColor(`${process.env.ABUSE_COLOR}`)
                        .setDescription(data.Message)
                        .setTimestamp()
                        .setFooter('ID: Server')
                    send(process.env.ABUSE_CHAN, abuse)
                } else if (['mute', 'kick', 'ban'].some(substring => data.Message.toLowerCase().includes(substring))) {
                    let punishment = new Discord.MessageEmbed()
                        .setColor(`${process.env.PUNISH_COLOR}`)
                        .setDescription(data.Message)
                        .setTimestamp()
                        .setFooter('ID: Server');
                    send(process.env.PUNISH_CHAN, punishment)
                } else if (data.Message.startsWith('[Priv')) {
                    let pm = new Discord.MessageEmbed()
                        .setColor(`${process.env.PRIVATE_COLOR}`)
                        .setDescription(data.Message)
                        .setTimestamp()
                        .setFooter('ID: Private Message does not support ID\'s! :(');
                    send(process.env.CHAT_CHAN, pm)
                } else if (data.Message.startsWith('[Better')) {
                    return null;
                } else {
                    let server = new Discord.MessageEmbed()
                        .setColor(`${process.env.SERVER_COLOR}`)
                        .setDescription(data.Message)
                        .setTimestamp()
                        .setFooter('ID: Server');
                    send(process.env.SERVER_CHAN, server)
                }
            } else if (data.Type === 'Chat') {
                let better = JSON.parse(data.Message);
                if (better.Channel === 0) {
                    let global = new Discord.MessageEmbed()
                        .setColor(`${process.env.CHAT_COLOR}`)
                        .setDescription(better.Message)
                        .setTimestamp()
                        .setFooter('ID: ' + better.UserId);
                    send(process.env.CHAT_CHAN, global)
                } else if (better.Channel === 1) {
                    let team = new Discord.MessageEmbed()
                        .setColor(`${process.env.TEAM_COLOR}`)
                        .setDescription(better.Message)
                        .setTimestamp()
                        .setFooter('ID: ' + better.UserId);
                    send(process.env.CHAT_CHAN, team)
                } else if (better.Channel === 2) {
                    let schat = new Discord.MessageEmbed()
                        .setColor(`${process.env.SCHAT_COLOR}`)
                        .setDescription(better.Message)
                        .setTimestamp()
                        .setFooter('ID: Server');
                    send(process.env.CHAT_CHAN, schat)
                }
            } else if (data.Type === 'Warning') {
                let warning = new Discord.MessageEmbed()
                    .setColor(`${process.env.WARNING_COLOR}`)
                    .setDescription(data.Message)
                    .setTimestamp()
                    .setFooter('ID: Server');
                send(process.env.WARNING_CHAN, warning)
            } else {
                return null;
            }
        } else {
            let date = new moment().format('L');
            let hostinfo = JSON.parse(data.Message);
            let wipedate = hostinfo.SaveCreatedTime.substring(0, 10);
            let dateFrom = moment(wipedate).fromNow();
            let players = hostinfo.Players;
            let max = hostinfo.MaxPlayers;
            let queue = hostinfo.Queued;

            function set(ply, max, q, date) {
                if (q === 0 && date) {
                    c.user.setActivity(`${ply}/${max} wiped ${date}`, {
                        type: "WATCHING"
                    })
                } else if (date) {
                    c.user.setActivity(`${ply}/${max} wiped ${date}`, {
                        type: "WATCHING"
                    })
                } else if (!date && q === 0) {
                    c.user.setActivity(`${ply}/${max}`, {
                        type: "WATCHING"
                    })
                } else {
                    c.user.setActivity(`${ply}/${max} (${q})`, {
                        type: "WATCHING"
                    })
                }
                send(process.env.PLAYER_CHAN, ply)
            };

            if (process.env.INCLUDE_WIPED_FROM) {
                set(players, max, queue, dateFrom)
            } else {
                set(players, max, queue)
            }
        }
    };

    client.onclose = function(event) {
        console.log(`Connect to ${url} has been closed., with close event code: ${event.code}!`);

        setTimeout(function() {
            connect();
        }, 1000);
        pres();
    };
    client.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };
}

c.on('ready', () => {
    console.log(`${c.user.tag} has logged on!`);
    pres();
    connect();
});

c.login(process.env.TOKEN);