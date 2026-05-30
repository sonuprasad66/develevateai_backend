"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const start = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.app.listen(env_1.env.port, () => {
            console.log(`[server] listening on port ${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error("[server] failed to start", error);
        process.exit(1);
    }
};
start();
