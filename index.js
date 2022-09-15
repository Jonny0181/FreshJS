const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();

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
  ],
});

module.exports = client;

client.on("raw", (d) => client.manager.updateVoiceState(d));

client.login(client.config.token);
