import * as React from "react"
import clsx from 'clsx'
import { NavItem } from "./types"
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"

const ChevronIcon = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-2.5 opacity-60 [&_path]:stroke-2 transition-transform duration-200 group-hover:rotate-180"
  >
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Navigation: React.FC<{ isDarkTheme?: boolean; items: NavItem[] }> = ({ isDarkTheme, items }) => {
  const router = useRouter()
  const { startLoading } = useLoading()

  const handleNavigation = (to?: string) => {
    if (to) {
      startLoading(to)
      router.push(to)
    }
  }

  return (
    <nav>
      <ul className="flex gap-x-1 xl:gap-x-2 hidden lg:flex">
        {items.map(({ to, text, items }, index) => {
          const Tag = to ? 'button' : 'button'
          return (
            <li
              className={clsx(
                'relative [perspective:2000px]',
                items && items.length > 0 && 'group'
              )}
              key={index}
            >
              <Tag
                onClick={() => handleNavigation(to)}
                className={clsx(
                  'flex items-center gap-x-1.5 px-3 py-2 rounded-xl w-full',
                  'text-base font-semibold tracking-tight',
                  'hover:bg-gray-100 dark:hover:bg-[#1C1D21] transition-colors duration-200',
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                )}
              >
                {text}
                {items && items.length > 0 && <ChevronIcon />}
              </Tag>
              {items && items.length > 0 && (
                <div
                  className={clsx(
                    'absolute left-0 top-full w-[300px] pt-3',
                    'pointer-events-none opacity-0',
                    'origin-top transition-all duration-200',
                    'group-hover:pointer-events-auto group-hover:opacity-100'
                  )}
                >
                  <div
                    className={clsx(
                      'relative rounded-2xl p-2 w-full',
                      'bg-white dark:bg-[#0B0C0F]',
                      'shadow-lg shadow-gray-200/50 dark:shadow-black/20',
                      'border border-gray-200/50 dark:border-gray-700/50'
                    )}
                  >
                    {items.map(({ icon, text, description, to }, index) => (
                      <button
                        key={index}
                        onClick={() => handleNavigation(to)}
                        className={clsx(
                          'flex items-center gap-3 rounded-xl p-2.5 w-full',
                          'hover:bg-gray-100 dark:hover:bg-[#1C1D21]',
                          'transition-colors duration-200',
                          isDarkTheme ? 'text-white' : 'text-gray-900'
                        )}
                      >
                        {icon && (
                          <div className={clsx(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                            'bg-gray-50 dark:bg-[#1C1D21]',
                            'border border-gray-200/50 dark:border-gray-700/50'
                          )}>
                            <img
                              className="h-5 w-5"
                              src={isDarkTheme ? icon.dark : icon.light}
                              alt=""
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <div className="font-semibold tracking-tight">{text}</div>
                          {description && (
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
} 