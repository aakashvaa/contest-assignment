import { PLATFORM_NAMES } from '../types/Contest'
import { Code2, Coffee, Binary } from 'lucide-react'
import { useStore } from '../store/useStore'

const platformIcons = {
  [PLATFORM_NAMES.CODEFORCES]: Code2,
  [PLATFORM_NAMES.CODECHEF]: Coffee,
  [PLATFORM_NAMES.LEETCODE]: Binary,
}

export default function PlatformFilter() {
  const { setSelectedPlatform, selectedPlatform } = useStore()

  const handleSelect = (platform: PLATFORM_NAMES) => {
    let newItem = null
    if (selectedPlatform?.includes(platform)) {
      newItem = selectedPlatform.filter((p) => p !== platform)

      // Remove if already selected
    } else {
      // Add if not selected
      newItem = selectedPlatform ? [...selectedPlatform, platform] : [platform]
    }
    setSelectedPlatform(newItem)
  }

  return (
    <div className="flex gap-3   rounded-md">
      <button
        onClick={() => setSelectedPlatform(null)}
        className={`px-4 py-2 rounded-lg transition-all backdrop-blur-md  duration-200
          ${
            !selectedPlatform || selectedPlatform.length === 0
              ? 'bg-blue-500 text-white shadow-lg dark:bg-[#3e3e3e]'
              : 'bg-white dark:bg-white/5  dark:hover:bg-white/10'
          }`}
      >
        All
      </button>
      {Object.values(PLATFORM_NAMES).map((platform) => {
        const Icon = platformIcons[platform]
        return (
          <button
            key={platform}
            onClick={() => handleSelect(platform)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${
                selectedPlatform?.includes(platform)
                  ? 'bg-blue-500 text-white shadow-lg dark:bg-[#3e3e3e]'
                  : 'bg-white dark:bg-white/5  dark:hover:bg-white/10'
              }`}
          >
            <Icon className="w-5 h-5" />
            <p className="hidden sm:inline">{platform}</p>
          </button>
        )
      })}
    </div>
  )
}
