import { Sun, Moon } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg  transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-white" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}
