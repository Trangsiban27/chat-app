const redis = require('../config/redis.config')

const getCache = async (key) => {
    try {
        const data = await redis.get(key).catch(() => null)

        return data ? JSON.parse(data) : null
    } catch (err) {
        console.log('err: ', err)
        return null
    }
}

const setCache = async (key, value, ttl = 300) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value))
    } catch (err) {
        console.log('err: ', err)
    }
}

const delCache = async (key) => {
    try {
        await redis.del(key)
    } catch (err) {
        console.log('err del: ', err)
    }
}

const incCache = async (key, value) => {
    try {
        return await redis.incrby(key, value)
    } catch (err) {
        console.log('err: ', err)
    }
}

const getCount = async (key) => {
    try {
        const value = redis.get(key)
        return value ? parseInt(value) : 0
    } catch (err) {
        console.log('err: ', err)
    }
}

const delCacheByPattern = async (pattern) => {
    try {
        const keys = await redis.keys(pattern)

        if (keys.length > 0) {
            await redis.del(keys)
            console.log(`[Redis] Invalidated ${keys.length} keys with pattern: ${pattern}`);
        }
    } catch (error) {
        console.error(`[Redis Del Pattern Error]:`, error);
    }
}

module.exports = {
    getCache,
    setCache,
    delCache,
    delCacheByPattern,
    incCache,
    getCount
}