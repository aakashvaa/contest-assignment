export enum PLATFORM_NAMES {
  CODEFORCES = 'codeforces',
  CODECHEF = 'codechef',
  LEETCODE = 'leetcode',
}

export type Contest = {
  contestId: string
  createdAt: Date
  endTime: number
  platform: string
  startTime: number
  title: string
  updatedAt: Date
  url: string
  solutionUrl?: string
  __v: number
  _id: string
}
