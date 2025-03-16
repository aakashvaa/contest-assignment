import axios from 'axios'

import {
  CODECHEF_URL,
  CODEFORCES_URL,
  getCodeChefContestURL,
  getCodeforcesContestURL,
  getLeetCodeContestURL,
  getUnixTimestamp,
  LEETCODE_URL,
  PLATFORM_NAMES,
  STORE_CONTEST_TYPE,
} from '../constants'
import { title } from 'process'
import { storeContest } from './contestStore'

interface CodeforcesContest {
  id: number //  unique contest ID
  name: string // name of the contest
  type: string // type of the contest: CF, IOI, ICPC
  phase: string // phase of the contest: BEFORE, CODING, FINISHED
  frozen: boolean // whether rating is updated after the contest
  startTimeSeconds: number // contest start time in seconds
  durationSeconds: number // contest duration in seconds
  relativeTimeSeconds: number // remaining time in seconds
}

interface CodechefContest {
  contest_code: string
  contest_name: string
  contest_start_date: string
  contest_end_date: string
  contest_start_date_iso: string
  contest_end_date_iso: string
  contest_duration: string
  distinct_users: number
}

interface LeetcodeContest {
  title: string
  titleSlug: string
  startTime: number
  duration: number
}

async function fetchCodeforcesContests() {
  try {
    const response = await axios.get(CODEFORCES_URL)

    const contests = response.data.result
    // Separate contests based on phase
    const ongoingContests = contests.filter(
      (contest: CodeforcesContest) => contest.phase === 'CODING'
    )
    const upcomingContests = contests.filter(
      (contest: CodeforcesContest) => contest.phase === 'BEFORE'
    )

    // Get last 10 past contests (sorted by startTimeSeconds descending)
    const pastContests = contests
      .filter((contest: CodeforcesContest) => contest.phase === 'FINISHED')
      .slice(0, 5) // Take latest 10

    const allContests = [
      ...ongoingContests,
      ...upcomingContests,
      ...pastContests,
    ]
    // console.log('Codeforces Contests:', allContests.length, allContests)

    for (const contest of allContests) {
      const { id, name, durationSeconds, startTimeSeconds } = contest
      const payload: STORE_CONTEST_TYPE = {
        contestId: id,
        title: name,
        platform: PLATFORM_NAMES.CODEFORCES,
        startTime: Number(startTimeSeconds), // unix timestamp
        endTime: Number(durationSeconds) + Number(startTimeSeconds),
        url: getCodeforcesContestURL(id),
      }

      await storeContest(payload)
    }
  } catch (error: any) {
    console.error('Error fetching Codeforces contests:', error)
    throw new Error(
      `Error fetching CodeForces contests:${error?.message || error}`
    )
  }
}

async function fetchCodechefContests() {
  try {
    const { data } = await axios.get(CODECHEF_URL)

    const allContests = [
      ...data.present_contests,
      ...data.future_contests,
      ...data.past_contests.slice(0, 5),
    ]

    // console.log('Codechef Contests:', allContests.length, allContests)

    for (const contest of allContests) {
      const {
        contest_code,
        contest_name,
        contest_start_date_iso,
        contest_end_date_iso,
      } = contest
      const payload: STORE_CONTEST_TYPE = {
        contestId: contest_code,
        title: contest_name,
        platform: PLATFORM_NAMES.CODECHEF,
        startTime: getUnixTimestamp(contest_start_date_iso), // unix timestamp
        endTime: getUnixTimestamp(contest_end_date_iso),
        url: getCodeChefContestURL(contest_code),
      }

      await storeContest(payload)
    }
  } catch (error: any) {
    console.error(
      `Error fetching CodeChef contests: ${error?.message || error}`
    )
    throw new Error(
      `Error fetching CodeChef contests:${error?.message || error}`
    )
  }
}

async function fetchLeetcodeContests() {
  try {
    const { data } = await axios.post(LEETCODE_URL, {
      query: `
        query getContestList {
         allContests {
               title
               titleSlug
               startTime
               duration
            }
        }
      `,
    })
    const contests = data.data.allContests

    // Convert current time to Unix timestamp
    const now = Math.floor(Date.now() / 1000)

    // Categorize contests
    const ongoingContests = contests.filter(
      (contest: { startTime: number; duration: number }) =>
        now >= contest.startTime && now <= contest.startTime + contest.duration
    )

    const upcomingContests = contests.filter(
      (contest: { startTime: number }) => contest.startTime > now
    )

    const pastContests = contests
      .filter(
        (contest: { startTime: number; duration: number }) =>
          now > contest.startTime + contest.duration
      )
      .slice(-5) // Get last 5 contests

    // Merge contests
    const allContests: LeetcodeContest[] = [
      ...ongoingContests,
      ...upcomingContests,
      ...pastContests,
    ]

    // console.log('LeetCode Contests:', allContests.length, allContests)

    for (const contest of allContests) {
      const { titleSlug, title, startTime, duration } = contest
      const payload: STORE_CONTEST_TYPE = {
        contestId: titleSlug,
        title,
        platform: PLATFORM_NAMES.LEETCODE,
        startTime: Number(startTime), // unix timestamp
        endTime: Number(startTime) + Number(duration),
        url: getLeetCodeContestURL(titleSlug),
      }

      await storeContest(payload)
    }
  } catch (error: any) {
    console.error('Error fetching LeetCode contests:', error)
    throw new Error(
      `Error fetching leetcode contests:${error?.message || error}`
    )
  }
}

function getContestStatus(
  startTime: Date,
  endTime: Date
): 'upcoming' | 'ongoing' | 'completed' {
  const now = new Date()
  if (now < startTime) return 'upcoming'
  if (now > endTime) return 'completed'
  return 'ongoing'
}

export async function getAllContest() {
  try {
    await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchLeetcodeContests(),
    ])

    console.log({ message: 'Contests fetched successfully' })
  } catch (error: any) {
    throw new Error(error)
  }
}
