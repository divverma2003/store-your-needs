import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// in memory data storage
// stores values temporarily using key-value pairs
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
