"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployCommands = void 0;
var path_1 = __importDefault(require("path"));
var node_fs_1 = __importDefault(require("node:fs"));
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var DeployCommands = function () {
    var commands = [];
    var commandsPath = path_1.default.join(__dirname, "commands");
    var commandFiles = node_fs_1.default.readdirSync(commandsPath).filter(function (file) { return file.endsWith(".js"); });
    for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
        var file = commandFiles_1[_i];
        var filePath = path_1.default.join(commandsPath, file);
        var command = require(filePath);
        commands.push(command.data.toJSON());
    }
    var rest = new rest_1.REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    rest
        .put(v9_1.Routes.applicationCommands(process.env.DISCORD_CLIENT), { body: commands })
        .then(function () { return console.log("Successfully registered application commands."); })
        .catch(console.error);
};
exports.DeployCommands = DeployCommands;
//# sourceMappingURL=deploy-commands.js.map