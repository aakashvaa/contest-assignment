import {
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Edit2,
  Youtube,
  Trophy,
  Clock,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'
import { Contest, PLATFORM_NAMES } from '../types/Contest'
import { useStore } from '../store/useStore'
import EditPopup from './EditPopup'

interface ContestCardProps {
  contest: Contest
}

export default function ContestCard({ contest }: ContestCardProps) {
  const { bookmarkedContests, toggleBookmark } = useStore()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const isBookmarked = bookmarkedContests.has(contest.contestId)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return (
      <div className="flex flex-col">
        <div className="font-mono text-blue-600 dark:text-blue-400">
          {`${hours}:${minutes}`}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-sm  text-gray-800 dark:text-gray-200">
            {`${day}/${month}`}
          </span>
          <span className="text-[12px] text-gray-500 dark:text-gray-400">
            {year}
          </span>
        </div>
      </div>
    )
  }

  const getDuration = (start: number, end: number) => {
    const totalMinutes = Math.floor((end - start) / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return (
      <div className="font-mono">
        <span className="text-lg  text-gray-800 dark:text-gray-200">
          {hours.toString().padStart(2, '0')}
        </span>
        <span className="text-gray-400 dark:text-gray-500">:</span>
        <span className="text-lg  text-gray-800 dark:text-gray-200">
          {minutes.toString().padStart(2, '0')}
        </span>
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
          hrs
        </span>
      </div>
    )
  }
  return (
    <>
      <div className="flex flex-col justify-between w-full bg-white dark:bg-white/5   rounded-lg p-6 shadow-sm border border-gray-200 dark:border-white/10  ">
        <div className="">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`inline-flex items-center px-3 py-1 text-[10px] rounded-full border ${
                contest.platform === PLATFORM_NAMES.CODEFORCES
                  ? 'bg-emerald-100 dark:bg-emerald-100 border-emerald-50 dark:border-emerald-100'
                  : contest.platform === PLATFORM_NAMES.CODECHEF
                  ? 'bg-orange-100 dark:bg-orange-100 border-orange-50 dark:border-orange-100'
                  : contest.platform === PLATFORM_NAMES.LEETCODE
                  ? 'bg-cyan-100 dark:bg-cyan-100 border-cyan-50 dark:border-cyan-100'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <Trophy
                className={`w-3 h-3 mr-2 ${
                  contest.platform === PLATFORM_NAMES.CODEFORCES
                    ? 'text-emerald-400 dark:text-emerald-500'
                    : contest.platform === PLATFORM_NAMES.CODECHEF
                    ? 'text-orange-400 dark:text-orange-500'
                    : contest.platform === PLATFORM_NAMES.LEETCODE
                    ? 'text-cyan-400 dark:text-cyan-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span className="text-black">{contest.platform}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Edit contest"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleBookmark(contest.contestId)}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <h4 className="text-xl relative font-semibold">{contest.title}</h4>
          <div className=" flex flex-col gap-y-2 my-3 gap-2">
            <div className="bg-gray-100 dark:bg-[#333] rounded-xl p-2 backdrop-blur-sm border border-gray-100 dark:border-white/10 flex w-full justify-between items-center">
              <div className="flex items-center gap-3 ">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-light  inline md:hidden xl:inline text-gray-700 dark:text-gray-300">
                  Start Time
                </span>
              </div>
              <div className="">
                <div className="">{formatDate(contest.startTime)}</div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-[#333] rounded-xl p-2 backdrop-blur-sm border border-gray-100 dark:border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3 ">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Clock className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm  xl:inline inline md:hidden font-light text-gray-700 dark:text-gray-300">
                  Duration
                </span>
              </div>
              <div className="">
                {getDuration(contest.startTime, contest.endTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Visit Contest <ExternalLink className="w-4 h-4" />
          </a>
          {contest?.solutionUrl && (
            <a
              href={contest.solutionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Youtube />
            </a>
          )}
        </div>
      </div>

      <EditPopup
        contest={contest}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  )
}
