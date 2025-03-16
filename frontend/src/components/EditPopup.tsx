import { useState } from 'react'
import { X } from 'lucide-react'
import { Contest } from '../types/Contest'
import axios from 'axios'
import { url } from '../constant'
import { useStore } from '../store/useStore'

interface EditPopupProps {
  contest: Contest
  isOpen: boolean
  onClose: () => void
}

export default function EditPopup({
  contest,
  isOpen,
  onClose,
}: EditPopupProps) {
  const { updateContest } = useStore()
  const [solutionUrl, setSolutionUrl] = useState(contest.solutionUrl)
  const [secretKey, setSecretKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      axios.patch(`${url}/contests/${contest.contestId}`, {
        url: solutionUrl,
        key: secretKey,
      })
      console.log('Updating contest:', {
        contestId: contest.contestId,
        solutionUrl,
      })
      updateContest(contest.contestId, { solutionUrl })
      onClose()
      setSecretKey('')
      setSolutionUrl('')
    } catch (error) {
      alert('failed check logs')
      console.log(error)
    }
  }

  if (!isOpen) return null // Prevents rendering when closed

  return (
    <div className="fixed z-50 inset-0 flex  items-center justify-center bg-white/20 dark:bg-black/40 backdrop-blur-sm">
      <div className="relative backdrop-blur-xl w-full max-w-md bg-black/10 dark:bg-white/10  text-gray-900 dark:text-white p-6 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit Youtube Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Secret Key Field */}
          <div>
            <label className="block pb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                        dark:text-white  bg-white/20 dark:bg-black/10 backdrop-blur-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter secret key"
            />
          </div>

          {/* URL Field */}
          <div>
            <label className="block  pb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Contest URL
            </label>
            <input
              type="solutionUrl"
              value={solutionUrl}
              onChange={(e) => setSolutionUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       dark:text-white  bg-white/20 dark:bg-black/10 backdrop-blur-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/solution"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 
                       bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white bg-blue-500 
                       hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
