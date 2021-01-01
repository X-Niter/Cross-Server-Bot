'use strict';

const { onMessageCreate } = require('./events/onMessageCreate');
const { onMessageUpdate } = require('./events/onMessageUpdate');
const { onMessageDelete } = require('./events/onMessageDelete');

exports.setup = function (bot, config) {
    const network = {};
    const channelsCache = {};

    bot.prefix = config.prefix;

    bot.once('ready', () => {
        console.log('I am ready!');

        for (const val of config.guilds) {
            const botGuild = bot.guilds.get(val.guildID);
            if (!botGuild) {
                console.log(`Bot not in the guild: ${val.name}(${val.guildID})`);
            } else {
                network[val.channelID] = val;
                channelsCache[val.channelID] = new Map();
                
                var date = new Date();
                bot.executeWebhook(val.whID, val.whToken, {
                    username: bot.user.username,
                    avatarURL: bot.user.avatarURL,
                    content: 'Bot started. It is: ' + date.toISOString(),
                } );
            }
        }
    } );

    bot.on('messageCreate', (msg) => onMessageCreate(bot, network, channelsCache, msg) );
    bot.on('messageUpdate', (msg, oldMsg) => onMessageUpdate(bot, network, channelsCache, msg, oldMsg)); 
    bot.on('messageDelete', (msg) => onMessageDelete(bot, network, channelsCache, msg));
};
