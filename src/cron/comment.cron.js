const cron = require('node-cron');
const postsModel = require('../models/posts.model');
const redis = require('../config/redis.config');

const syncCommentCountFromRedis = async () => {
    console.log('--- Start Syncing Comment Count ---');
    try {
        const keys = await redis.keys('post:comment_count:*')

        if (keys.length === 0) return

        const bulkOps = []

        for (let key of keys) {
            const postId = key.split(':')[2]
            const count = await redis.get(key)

            if (count && count !== '0') {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: postId },
                        update: { $inc: { commentCount: parseInt(count) } }
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

cron.schedule('0 * * * * *', syncCommentCountFromRedis)

module.exports = {
    syncCommentCountFromRedis
}