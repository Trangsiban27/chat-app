const Redis = require('ioredis')

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 15000,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
    }
})

redis.on('connect', () => {
    console.log('Redis connected!')
})

redis.on('error', (err) => {
    console.log('Redis connection error: ', err)
})

module.exports = redis