import { useStore } from './store/useStore'
import ContestCard from './components/ContestCard'
import FilterDropdown from './components/FilterDropdown'
import PlatformFilter from './components/PlatformFilter'
import ThemeToggle from './components/ThemeToggle'
import { BookmarkCheck } from 'lucide-react'
import { useEffect } from 'react'
import axios from 'axios'
import { url } from './constant'
import { PLATFORM_NAMES } from './types/Contest'
function App() {
  const {
    contests,
    isDarkMode,
    selectedPlatform,
    timeFilter,
    bookmarkedContests,
    showBookmarked,
    toggleShowBookmarked,
    setContest,
  } = useStore()

  const now = Math.floor(Date.now() / 1000) // Convert current time to Unix timestamp (seconds)

  const filteredContests = contests
    ? contests
        .filter((contest) => {
          return !showBookmarked || bookmarkedContests.has(contest.contestId)
        })
        .filter((contest) => {
          return !selectedPlatform || selectedPlatform?.length === 0
            ? true
            : selectedPlatform.includes(contest.platform as PLATFORM_NAMES)
        })
        .filter((contest) => {
          const startTime = contest.startTime // Already in seconds
          const endTime = contest.endTime // Already in seconds

          switch (timeFilter) {
            case 'ongoing':
              return startTime <= now && endTime >= now
            case 'past':
              return endTime < now
            case 'upcoming':
              return startTime > now
            default:
              return true
          }
        })
    : []

  // console.log('Filtered Contests:', filteredContests)

  async function fetchContest() {
    try {
      const { data } = await axios.get(`${url}/contests/getAll`)
      if (data) setContest(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchContest()
  }, [])
  // console.log(filteredContests)

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen overflow-hidden bg-light dark:bg-dark text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex  backdrop-blur-lg rounded-md px-5 py-2 justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Coding Contests</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShowBookmarked}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    showBookmarked
                      ? 'bg-blue-500 text-white shadow-lg dark:bg-[#3e3e3e]'
                      : 'bg-white/80 dark:bg-white/5 '
                  }`}
              >
                <BookmarkCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Bookmarked</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col justify-between sm:flex-row gap-4 mb-8">
            <PlatformFilter />
            <FilterDropdown />
          </div>
          <div className="h-[70dvh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 overflow-y-auto auto-rows-fr">
              {filteredContests.map((contest) => (
                <ContestCard key={contest.contestId} contest={contest} />
              ))}
              {filteredContests.length === 0 && (
                <div className="col-span-full text-lg text-center py-14 text-[#858585] ">
                  {showBookmarked
                    ? 'No bookmarked contests found'
                    : timeFilter === 'ongoing'
                    ? 'No  Ongoing contests found'
                    : timeFilter === 'upcoming'
                    ? 'No upcoming contests found'
                    : 'No past contests found'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
