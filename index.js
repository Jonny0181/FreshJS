const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const { AppleMusic } = require("better-erela.js-apple");

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();

loadEvents(client);

client.manager = new Manager({
  nodes: client.config.lavalinkNodes,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
  plugins: [
    new AppleMusic(),
    new Spotify({
      clientID: client.config.spotify.id,
      clientSecret: client.config.spotify.secret,
    }),
  ],
});

module.exports = client;

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.login(client.config.token);
