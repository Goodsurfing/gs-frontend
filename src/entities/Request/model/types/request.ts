import { Application } from "@/entities/Host";

export interface Request {
    application: Application;
    showStatus?: boolean;
    showButtons?: boolean;
}
