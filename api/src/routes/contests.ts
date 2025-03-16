import express from 'express'

import { Contest } from '../models/Contest'
import { getAllContest } from '../services/contestFetcher'
import { redis } from '../index'
import fetchAllContest from '../services/fetchAllContest'
import { SECRET_KEY } from '../constants'

const router = express.Router()

// get the contest for users
router.get('/getAll', fetchAllContest)

// test cfor devs
router.get('/test', async (req, res) => {
  try {
    getAllContest()
    return res.status(200).json({ message: 'contest fetched successfully' })
  } catch (error: any) {
    throw new Error(error)
  }
})
// reset redis
async function resetRedis() {
  try {
    await redis.flushall()
    console.log('Redis database has been completely reset on write operation')
  } catch (error) {
    console.error('Error resetting Redis:', error)
  }
}

// Update solution URL
router.patch('/:id', async (req, res) => {
  try {
    const {id} = req.params
    const { url, key } = req.body
    console.log(id, url, key)
    let result = {}
    if (SECRET_KEY === key) {
      const existingContest = await Contest.findOne({
        contestId: id,
      })
      if (existingContest) {
        await resetRedis()
        const filter = { contestId: id }
        const update = { solutionUrl: url }
        console.log('Before update attempt')
        result = await Contest.updateOne(filter, update, { new: true })
        return res.status(200).json(result)
      } else {
        return res.status(404).json({ message: 'contest  not found' })
      }
    } else {
      return res.status(401).json({ message: 'authorization key is invalid' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to update solution URL' })
  }
})

export default router
