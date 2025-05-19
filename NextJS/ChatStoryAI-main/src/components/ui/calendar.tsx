"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full p-3", className)}
      locale={vi}
      classNames={{
        root: "w-full",
        months: "w-full",
        month: "w-full space-y-2",
        caption: "relative flex w-full items-center justify-between px-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "w-[14.28%] text-center text-muted-foreground text-sm font-medium",
        row: "flex w-full",
        cell: "w-[14.28%] text-center text-sm relative p-0",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 