import { Request, Response } from 'express'
import { redis } from '../index'
import { Contest } from '../models/Contest'

export default async function fetchAllContest(req: Request, res: Response) {
  try {
    const { platform, status } = req.query

    // Try to get contests from Redis first
    const cachedContests = await redis.hgetall('allContests')

    if (cachedContests && Object.keys(cachedContests).length > 0) {
      console.log('Serving contests from Redis cache')

      // Parse the cached contests
      let contests = Object.values(cachedContests).map((data) =>
        JSON.parse(data)
      )

      // Apply filters if provided
      if (platform) {
        const platforms = Array.isArray(platform) ? platform : [platform]
        contests = contests.filter((contest) =>
          platforms.includes(contest.platform)
        )
      }

      if (status) {
        contests = contests.filter((contest) => contest.status === status)
      }

      return res.status(200).json(contests)
    }

    // If not in Redis, get from database
    console.log('Fetching contests from database')
    const filter: any = {}

    // Add filters if provided
    if (platform) {
      if (Array.isArray(platform)) {
        filter.platform = { $in: platform }
      } else {
        filter.platform = platform
      }
    }

    if (status) {
      filter.status = status
    }

    const contests = await Contest.find(filter).sort({ startTime: 1 })

    // Update Redis with the contests
    const updatePromises = contests.map((contest) => {
      return redis.hset(
        'allContests',
        contest.contestId,
        JSON.stringify(contest.toObject())
      )
    })

    await Promise.all(updatePromises)
    console.log('Updated Redis cache with contests from database')

    // Set expiration for the entire hash (24 hours)
    await redis.expire('allContests', 60 * 60 * 24)

    res.status(200).json(contests)
  } catch (error) {
    console.error('Error fetching contests:', error)
    res.status(500).json({ message: 'Failed to fetch contests' })
  }
}
