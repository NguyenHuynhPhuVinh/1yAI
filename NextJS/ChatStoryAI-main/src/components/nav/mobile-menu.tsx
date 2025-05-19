/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import clsx from 'clsx'
import { Sun, Moon, ChevronRight, Search } from 'lucide-react'
import { NavItem } from "./types"
import { useSession } from "next-auth/react"
import { Login } from "../login/login"
import { UserMenu } from "./user-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from 'next/navigation'
import { useLoading } from "@/providers/loading-provider"
import { NotificationBell } from "@/components/notification-bell"
import { SearchDialog } from "@/components/search-dialog"

interface MobileMenuProps {
  items?: NavItem[];
  isDarkTheme?: boolean;
  onThemeChange?: () => void;
  logo?: React.ReactNode;
}

const MobileMenuItem: React.FC<{
  item: NavItem;
  isDarkTheme?: boolean;
  onClose?: () => void;
}> = ({ item, isDarkTheme, onClose }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(item.items && item.items.length > 0)
  const { startLoading } = useLoading()

  const handleNavigation = (to?: string) => {
    if (to) {
      startLoading(to)
      router.push(to)
      onClose?.()
    }
  }

  if (item.to) {
    return (
      <button 
        onClick={() => handleNavigation(item.to)}
        className={clsx(
          "flex items-center w-full px-4 py-4",
          "text-base font-semibold tracking-tight",
          "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
          "active:bg-gray-200 dark:active:bg-[#2C2D31]",
          "transition-colors duration-100",
          isDarkTheme ? 'text-white' : 'text-gray-900'
        )}
      >
        <span className="flex-1 text-left">{item.text}</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>
    )
  }
  
  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex w-full items-center justify-between px-4 py-4",
          "text-base font-semibold tracking-tight",
          "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
          "active:bg-gray-200 dark:active:bg-[#2C2D31]",
          "transition-colors duration-100",
          isDarkTheme ? 'text-white' : 'text-gray-900'
        )}
      >
        <span className="text-left">{item.text}</span>
        <ChevronRight 
          className={clsx(
            "h-5 w-5 transition-transform duration-200",
            !isOpen && "text-gray-400",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="w-full bg-gray-50 dark:bg-[#0B0C0F]">
          {item.items?.map((subItem, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(subItem.to)}
              className={clsx(
                "flex items-center w-full px-6 py-4",
                "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                "active:bg-gray-200 dark:active:bg-[#2C2D31]",
                "transition-colors duration-100",
                isDarkTheme ? 'text-white' : 'text-gray-900'
              )}
            >
              <div className="flex-1">
                <div className="text-base font-semibold tracking-tight text-left">{subItem.text}</div>
                {subItem.description && (
                  <div className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400 text-left">
                    {subItem.description}
                  </div>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  items = [],
  isDarkTheme,
  onThemeChange,
  logo,
}) => {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  const handleCloseMenu = () => {
    setOpen(false)
  }

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className={clsx(
              "lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md",
              isDarkTheme ? 'text-white' : 'text-gray-900'
            )}
          >
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className={clsx(
            "w-full max-w-sm p-0 flex flex-col",
            isDarkTheme ? 'bg-[#0B0C0F]' : 'bg-white'
          )}
        >
          <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="text-xl font-bold tracking-tight">
              {logo}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            {session && (
              <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setSearchOpen(true)
                    handleCloseMenu()
                  }}
                  className={clsx(
                    "flex items-center justify-between px-4 py-3 rounded-lg flex-1",
                    "text-base font-semibold tracking-tight",
                    "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  )}
                >
                  <span>Tìm kiếm</span>
                  <Search className="h-5 w-5" />
                </button>
                <NotificationBell />
              </div>
            )}

            <div className="py-2">
              {items.map((item: NavItem, index: number) => (
                <MobileMenuItem 
                  key={index} 
                  item={item} 
                  isDarkTheme={isDarkTheme}
                  onClose={handleCloseMenu}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
            {session ? (
              <UserMenu 
                isDarkTheme={isDarkTheme} 
                isMobile={true} 
                onMobileMenuClose={handleCloseMenu} 
              />
            ) : (
              <Login />
            )}
            {onThemeChange && (
              <button
                className={clsx(
                  "flex w-full items-center justify-between px-4 py-3 rounded-lg",
                  "text-base font-semibold tracking-tight",
                  "hover:bg-gray-100 dark:hover:bg-[#1C1D21]",
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                )}
                onClick={onThemeChange}
              >
                <span>
                  {isDarkTheme ? 'Chế độ sáng' : 'Chế độ tối'}
                </span>
                <div className="relative w-5 h-5">
                  <Sun className={clsx(
                    "h-5 w-5 absolute transition-transform duration-100",
                    isDarkTheme ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                  )} />
                  <Moon className={clsx(
                    "h-5 w-5 absolute transition-transform duration-100",
                    isDarkTheme ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                  )} />
                </div>
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
} 