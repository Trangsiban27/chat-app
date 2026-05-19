'use strict'
const cron = require('node-cron');
const redis = require('../config/redis.config');
const postsModel = require('../models/posts.model');
const { delCacheByPattern } = require('../utils/redis.utils');

const syncReactionCountFromRedis = async () => {
    console.log('--- Start Syncing Comment Count ---');
    try {
        const keys = await redis.keys('post:reaction_count:*')

        if (keys.length === 0) return

        const bulkOps = []

        for (let key of keys) {
            const postId = key.split(':')[2]
            const count = await redis.get(key)

            if (!isNaN(count) && count !== 0) {
                bulkOps.push({
                    updateOne: {
                        filter: {
                            _id: postId,
                            ...(count < 0 ? { reactionCount: { $gt: 0 } } : {})
                        },
                        update: {
                            $inc: { reactionCount: parseInt(count) }
                        }
                    }
                })
            }
        }

        if (bulkOps?.length > 0) {
            await postsModel.bulkWrite(bulkOps)

            await redis.del(keys)

            console.log(`Synced ${bulkOps.length} posts successfully.`);
        }



    } catch (err) {
        console.error('Cronjob Sync Error:', err);
    }
}

cron.schedule('0 * * * * *', syncReactionCountFromRedis)

module.exports = {
    syncReactionCountFromRedis
}