"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    //   password: process.env.REDIS_PASSWORD,
    //   socket: {
    //     host: "localhost",
    //     port: 6379,
    //   },
    url: process.env.REDIS_URL,
});
exports.redisClient = redisClient;
//# sourceMappingURL=redis.js.map