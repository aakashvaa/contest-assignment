import mongoose from 'mongoose'
import { PLATFORM_NAMES } from '../constants'

const contestSchema = new mongoose.Schema(
  {
    contestId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    platform: {
      type: String,
      required: true,
      enum: [
        PLATFORM_NAMES.CODEFORCES,
        PLATFORM_NAMES.CODECHEF,
        PLATFORM_NAMES.LEETCODE,
      ],
    },
    startTime: { type: Number, required: true }, // unix timestamp
    endTime: { type: Number, required: true },
    url: { type: String, required: true },
    solutionUrl: { type: String },
  },
  {
    timestamps: true,
  }
)

export const Contest = mongoose.model('Contest', contestSchema)
