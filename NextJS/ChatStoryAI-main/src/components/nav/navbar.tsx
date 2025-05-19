"use client"

import * as React from "react"
import clsx from 'clsx'
import { Sun, Moon } from 'lucide-react'
import { Navigation } from "./pc-navigation"
import { MobileMenu } from "./mobile-menu"
import { NavItem } from "./types"

interface NavButton {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  onClick?: () => void
  asChild?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const NavButton: React.FC<NavButton> = ({ 
  className, 
  children, 
  variant = 'default',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'h-10 px-4 py-2',
        variant === 'default' && [
          'bg-black text-white hover:bg-black/90',
          'dark:bg-white dark:text-black dark:hover:bg-white/90'
        ],
        variant === 'outline' && [
          'border border-current',
          'hover:bg-black/10 dark:hover:bg-white/10'
        ],
        className
      )}
    >
      {children}
    </button>
  )
}

interface HeaderProps {
  className?: string
  theme?: 'light' | 'dark'
  isSticky?: boolean
  isStickyOverlay?: boolean
  withBorder?: boolean
  logo?: React.ReactNode
  menuItems?: NavItem[]
  onThemeChange?: () => void
  rightContent?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({
  className,
  theme = 'light',
  isSticky = false,
  isStickyOverlay = false,
  withBorder = false,
  logo,
  menuItems = [],
  onThemeChange,
  rightContent,
}) => {
  const isDarkTheme = theme === 'dark'

  return (
    <header
      className={clsx(
        'relative z-40 w-full',
        isSticky && 'sticky top-0',
        isStickyOverlay && 'bg-background/80 backdrop-blur-lg',
        withBorder && 'border-b',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {logo}
          <Navigation isDarkTheme={isDarkTheme} items={menuItems} />
          
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex items-center gap-x-4">
              {rightContent}
              {onThemeChange && (
                <NavButton
                  variant="ghost"
                  size="icon"
                  onClick={onThemeChange}
                >
                  {isDarkTheme ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </NavButton>
              )}
            </div>
            
            <MobileMenu
              items={menuItems}
              isDarkTheme={isDarkTheme}
              onThemeChange={onThemeChange}
              logo={logo}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export { NavButton }
export default Header
