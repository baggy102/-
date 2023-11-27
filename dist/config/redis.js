"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: "redis://errandsredis.wighet.clustercfg.apn2.cache.amazonaws.com:6379",
});
exports.redisClient = redisClient;
//# sourceMappingURL=redis.js.map