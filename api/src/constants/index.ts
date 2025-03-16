const MONGODB_URL: string = process.env.MONGODB_URI || ''
const CODEFORCES_URL: string = process.env.CODEFORCES_URI || ''
const CODECHEF_URL: string = process.env.CODECHEF_URI || ''
const LEETCODE_URL: string = process.env.LEETCODE_URI || ''
const YOUTUBE_API_KEY: string = process.env.YOUTUBE_API_KEY || ''
const PORT: string = process.env.PORT || '5000'
const SECRET_KEY: string = process.env.SECRET_KEY || ''

const PLATFORM_NAMES = {
  CODEFORCES: 'codeforces',
  CODECHEF: 'codechef',
  LEETCODE: 'leetcode',
} as const

type PLATFORM_NAMES_TYPES = (typeof PLATFORM_NAMES)[keyof typeof PLATFORM_NAMES]

type STORE_CONTEST_TYPE = {
  contestId: string
  title: string
  platform: PLATFORM_NAMES_TYPES
  startTime: number
  endTime: number
  url: string
}

const getCodeforcesContestURL = (contestId: string | number): string => {
  return `https://codeforces.com/contest/${contestId}`
}

const getCodeChefContestURL = (contestCode: string): string => {
  return `https://www.codechef.com/${contestCode}`
}

const getLeetCodeContestURL = (titleSlug: string): string => {
  return `https://leetcode.com/contest/${titleSlug}`
}

//Converts ISO date string to Unix timestamp (seconds)
const getUnixTimestamp = (isoDate: Date) =>
  Math.floor(new Date(isoDate).getTime() / 1000)
const redisContestKey: string = 'allContests'
export {
  PORT,
  SECRET_KEY,
  MONGODB_URL,
  PLATFORM_NAMES,
  PLATFORM_NAMES_TYPES,
  CODEFORCES_URL,
  CODECHEF_URL,
  LEETCODE_URL,
  YOUTUBE_API_KEY,
  getCodeforcesContestURL,
  getCodeChefContestURL,
  getLeetCodeContestURL,
  STORE_CONTEST_TYPE,
  getUnixTimestamp,
  redisContestKey,
}
