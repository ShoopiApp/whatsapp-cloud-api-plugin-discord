import { Client } from "discord.js";
import { Sender } from "@shoopi/whatsapp-cloud-api-responder/dist/outcome";
import { IncomeMessage } from "@shoopi/whatsapp-cloud-api-responder/dist/income";
export default class DiscorBot {
    private static instance;
    client: Client;
    private isLogin;
    private constructor();
    init(config?: {
        token: string;
        server: string;
        queue_channel: string;
    }): Promise<void>;
    SendMessage(message: IncomeMessage): Promise<void>;
    static getInstance(): DiscorBot;
    getMiddleware(): (sender: Sender, message: IncomeMessage, next: Function) => Promise<void>;
}
