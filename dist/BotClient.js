"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var path_1 = __importDefault(require("path"));
var node_fs_1 = __importDefault(require("node:fs"));
var whatsapp_cloud_api_responder_1 = __importDefault(require("@shoopi/whatsapp-cloud-api-responder"));
var whatsapp_cloud_api_cache_1 = require("@shoopi/whatsapp-cloud-api-cache");
var deploy_commands_1 = require("./deploy-commands");
var DiscorBot = /** @class */ (function () {
    function DiscorBot() {
        this.isLogin = false;
        this.client = new discord_js_1.Client({
            shards: "auto",
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            ],
        });
        (0, deploy_commands_1.DeployCommands)();
        this.client.commands = new discord_js_1.Collection();
        var commandsPath = path_1.default.join(__dirname, "commands");
        var commandFiles = node_fs_1.default.readdirSync(commandsPath).filter(function (file) { return file.endsWith(".js"); });
        for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
            var file = commandFiles_1[_i];
            var filePath = path_1.default.join(commandsPath, file);
            var command = require(filePath);
            this.client.commands.set(command.data.name, command);
        }
    }
    DiscorBot.prototype.init = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var token, error_1;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isLogin) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        token = (config === null || config === void 0 ? void 0 : config.token) || process.env.DISCORD_TOKEN;
                        if (!token) {
                            throw new Error();
                        }
                        return [4 /*yield*/, this.client.login(token)];
                    case 2:
                        _a.sent();
                        this.isLogin = true;
                        this.client.on("interactionCreate", function (interaction) { return __awaiter(_this_1, void 0, void 0, function () {
                            var command, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!interaction.isCommand())
                                            return [2 /*return*/];
                                        command = this.client.commands.get(interaction.commandName);
                                        if (!command)
                                            return [2 /*return*/];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 5]);
                                        return [4 /*yield*/, command.run(interaction)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        error_2 = _a.sent();
                                        console.error(error_2);
                                        return [4 /*yield*/, interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })];
                                    case 4:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.client.on("messageCreate", function (message) { return __awaiter(_this_1, void 0, void 0, function () {
                            var id, channel, featureConversation, whatsappMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!message.author.bot) return [3 /*break*/, 2];
                                        id = message.channel.id;
                                        channel = message.guild.channels.cache.get(id);
                                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.getFeatureConversation)(channel.name)];
                                    case 1:
                                        featureConversation = _a.sent();
                                        if (featureConversation) {
                                            whatsappMessage = new whatsapp_cloud_api_responder_1.default(featureConversation.sender.phone_number_id);
                                            whatsappMessage.sendMessage(featureConversation.contact.wa_id, {
                                                type: "text",
                                                text: { body: message.content },
                                            });
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.client.destroy();
                        process.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DiscorBot.prototype.SendMessage = function (message) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var conversation_1, channel, guild, channel, webhooks, webhook, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.getConversation)(message.from)];
                    case 1:
                        conversation_1 = _b.sent();
                        if (!(conversation_1 && conversation_1.context.type === "waiting_to_talk_with_human")) return [3 /*break*/, 4];
                        channel = this.client.channels.cache.get(process.env.DISCORD_QUEUE_CHANNEL);
                        if (!(channel.type === "GUILD_TEXT")) return [3 /*break*/, 3];
                        channel.send("New user in queue **".concat(conversation_1.id, "**\nTopic: ").concat(message.text.body));
                        return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.setFeatureConversation)(conversation_1.id, {
                                id: conversation_1.id,
                                topic: message.text.body,
                                contact: conversation_1.contact,
                                sender: conversation_1.sender,
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [3 /*break*/, 7];
                    case 4:
                        if (!(conversation_1 && conversation_1.context.type === "talking_with_human")) return [3 /*break*/, 7];
                        guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
                        channel = guild.channels.cache.find(function (channel) { return channel.name === conversation_1.id; });
                        if (!((channel === null || channel === void 0 ? void 0 : channel.type) == "GUILD_TEXT")) return [3 /*break*/, 7];
                        return [4 /*yield*/, channel.fetchWebhooks()];
                    case 5:
                        webhooks = _b.sent();
                        webhook = webhooks.find(function (wh) { return (wh.token ? true : false); });
                        if (!webhook) {
                            return [2 /*return*/, console.log("No webhook was found that I can use!")];
                        }
                        if (!(message.type === "text")) return [3 /*break*/, 7];
                        return [4 /*yield*/, webhook.send({ content: (_a = message.text) === null || _a === void 0 ? void 0 : _a.body })];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_3 = _b.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    DiscorBot.getInstance = function () {
        if (!DiscorBot.instance) {
            DiscorBot.instance = new DiscorBot();
        }
        return DiscorBot.instance;
    };
    DiscorBot.prototype.getMiddleware = function () {
        var _this = this;
        return function DiscordBotMiddleware(sender, message, next) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var conversation;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, (0, whatsapp_cloud_api_cache_1.getConversation)(message.from)];
                        case 1:
                            conversation = _c.sent();
                            if (!(((_a = conversation === null || conversation === void 0 ? void 0 : conversation.context) === null || _a === void 0 ? void 0 : _a.type) === "waiting_to_talk_with_human" ||
                                ((_b = conversation === null || conversation === void 0 ? void 0 : conversation.context) === null || _b === void 0 ? void 0 : _b.type) === "talking_with_human")) return [3 /*break*/, 3];
                            return [4 /*yield*/, _this.SendMessage(message)];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            next();
                            _c.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
    };
    return DiscorBot;
}());
exports.default = DiscorBot;
//# sourceMappingURL=BotClient.js.map