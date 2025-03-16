import { create } from 'zustand'
import { Contest, PLATFORM_NAMES } from '../types/Contest'

interface StoreState {
  contests: Contest[] | null
  bookmarkedContests: Set<string>
  isDarkMode: boolean
  selectedPlatform: PLATFORM_NAMES[] | null
  timeFilter: 'ongoing' | 'past' | 'upcoming'
  showBookmarked: boolean
  toggleBookmark: (contestId: string) => void
  toggleTheme: () => void
  setSelectedPlatform: (platform: PLATFORM_NAMES[] | null) => void
  setTimeFilter: (filter: 'ongoing' | 'past' | 'upcoming') => void
  toggleShowBookmarked: () => void
  updateContest: (contestId: string, updates: Partial<Contest>) => void
  setContest: (contests: Contest[]) => void
}

export const useStore = create<StoreState>((set) => ({
  contests: null,
  bookmarkedContests: new Set(),
  isDarkMode: true,
  selectedPlatform: null,
  timeFilter: 'upcoming',
  showBookmarked: false,
  toggleBookmark: (contestId) =>
    set((state) => {
      const newBookmarks = new Set(state.bookmarkedContests)
      if (newBookmarks.has(contestId)) {
        newBookmarks.delete(contestId)
      } else {
        newBookmarks.add(contestId)
      }
      return { bookmarkedContests: newBookmarks }
    }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setSelectedPlatform: (platform: PLATFORM_NAMES[] | null) =>
    set({ selectedPlatform: platform ? [...platform] : null }),
  setTimeFilter: (filter) => set({ timeFilter: filter }),
  toggleShowBookmarked: () =>
    set((state) => ({ showBookmarked: !state.showBookmarked })),
  updateContest: (contestId, updates) =>
    set((state) => ({
      contests: state.contests?.map((contest) =>
        contest.contestId === contestId ? { ...contest, ...updates } : contest
      ),
    })),
  setContest: (contests: Contest[]) => {
    console.log(contests)
    set(() => ({
      contests,
    }))
  },
}))
