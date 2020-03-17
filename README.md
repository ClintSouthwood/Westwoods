# Westwoods RCON Bot

Buenoes, noches. This is a Discord.JS bot, which if setup correctly can relay messages from your server's RCON to a specified discord. This bot also tracks users and the amount of time since the server's wipe, displaying it (if enabled) as the bot's status.


# How does it work?

This bot uses ``ws`` to create a WebSocket, which connects to the server. From there whenever a message is recieved, those messages are sorted and based on the conditions provided gives them a unique embed and color. To track players, when the bot connects it sends a command to the RCON with a unique identifier. The RCON then responds to the command with a message, that has the same unique identifier. This message is sorted based on it's  unique identifier, and every time it is received redefines the amount of players online, maximum, queued, and time since wipe.

## Configuration

Item | Definition
--- | ---
TOKEN=COOLASSTOKENHERE |
IP=SERVERIP | Your server IP address.
PORT=SERVERPORT | Your **RCON** Port!
PASS=RCONPASSWORD | RCON Password, defined in your server startup parameters.
CONNECT_CHAN=689205495386734661 | Channel ID for where the connection and close messages are sent.
CONNECT_MSG=``The RCON connection has been opened.`` | Message that is sent when the connection is opened.
CLOSE_MSG=``The RCON connection has been closed.`` | Message that is sent when the connection is closed (If you shutdown the bot it will not display this, only when the server is shutdown or restarted).
RELOAD=15000 | Time in milliseconds between server info updates (getting player count), default is 15 seconds.
PLAYER_CHAN=689283942767263752 |
SERVER_COLOR=#fdfdfd | Embed color for all server messages.
SERVER_CHAN=689205495386734661 | Channel ID for server messages (It's a lot of spam), delete or create some random number to disable.
ABUSE_COLOR=#EFD298 | Embed color for possibly abusive commands such as, give, teleport (not working at the moment, or killplayer).
ABUSE_CHAN=689205495386734661 | Channel ID for possible abusive commands, delete or create some random number to disable.
PUNISH_COLOR=#C94646 | Embed color for punishments
PUNISH_CHAN=689205495386734661 | Channel ID for punishments (mute,kick,ban,unmute,unban), delete or create some random number to disable.
WARNING_COLOR=#fff891 | Embed color for warnings, typically server or Oxide warnings.
WARNING_CHAN=689205495386734661 | Channel ID for warning, delete or create some random number to disable.
CHAT_COLOR=#98DCEF | Global chat embed color
TEAM_COLOR=#A4EF98 | Team chat embed color
PRIVATE_COLOR=#EB98EF | Private message embed color
SCHAT_COLOR=#B298EF | Server chat embed color
CHAT_CHAN=689205495386734661 | Channel ID of where all chat messages go to.
INCLUDE_WIPED_FROM=LeaveBlankToDisable |Whether or not you want the wipe time to be shown in the status. Delete **LeaveBlankToDisable** for it to be disabled.

## Screenshots

![alt text](https://cdn.discordapp.com/attachments/680167964133031964/689351412815233031/logging_bb.PNG "Embedded text and sorted colors")
![alt text](https://cdn.discordapp.com/attachments/680167964133031964/689351436928417839/server_info.PNG "Player log channel!")
![alt text](https://cdn.discordapp.com/attachments/680167964133031964/689351435288051726/date_from.PNG "Example of the bot's status!")

##