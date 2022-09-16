const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildVoiceStates,
  MessageContent,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    MessageContent,
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

const nodes = [
  {
    host: "localhost",
    password: "youshallnotpass",
    port: 2333,
  },
];

const clientID = client.config.spotify.id;
const clientSecret = client.config.spotify.secret;
client.manager = new Manager({
  nodes,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
  plugins: [
    new Spotify({
      clientID,
      clientSecret,
    }),

    new AppleMusic(),
  ],
});

module.exports = client;

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.login(client.config.token);
