import { Menu } from '@headlessui/react'
import { Clock } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function FilterDropdown() {
  const { timeFilter, setTimeFilter } = useStore()

  const filters = [
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
  ] as const

  return (
    <Menu as="div" className="relative w-fit">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-[#3e3e3e]  text-white rounded-lg shadow ">
        <Clock className="w-5 h-5" />
        <span>{timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}</span>
      </Menu.Button>

      <Menu.Items className="absolute z-10 mt-2 w-full origin-top-right bg-white dark:bg-dark rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-1">
          {filters.map((filter) => (
            <Menu.Item key={filter.id}>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 dark:bg-[#333]' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => setTimeFilter(filter.id)}
                >
                  {filter.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  )
}
