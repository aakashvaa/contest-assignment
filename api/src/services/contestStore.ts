import { redis } from '../index'
import {
  PLATFORM_NAMES_TYPES,
  redisContestKey,
  STORE_CONTEST_TYPE,
} from '../constants'
import { Contest } from '../models/Contest'

export async function storeContest(contest: STORE_CONTEST_TYPE) {
  const { contestId, title, startTime, endTime, platform, url } = contest
  const payload = {
    contestId,
    title,
    platform,
    startTime, // Unix timestamp
    endTime,
    url,
  }

  try {
    // Check if the contest exists in Redis

    const exists = await redis.hexists(redisContestKey, contestId)

    if (!exists) {
      // Check MongoDB if the contest already exists
      let  existingContest = await Contest.findOne({ contestId })

      if (!existingContest) {
        // Insert into MongoDB
        existingContest = await Contest.create(payload)

        console.log(`Inserted: ${title}`)
      } else {
        console.log(`Skipped (already exists in DB): ${title}`)
      }
      // Store in Redis (set TTL to 24 hours)
      await redis.hset(
        redisContestKey,
        contestId,
        JSON.stringify(existingContest),
        'EX',
        60 * 60 * 24
      )
    } else {
      console.log(`Skipped (already exists in Redis): ${title}`)
    }
  } catch (error) {
    console.error('Error storing contest:', error)
  }
}
