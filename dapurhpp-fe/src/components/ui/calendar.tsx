"use client";

import * as React from "react";
import { DayPicker, UI, DayFlag, SelectionState } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={true}
      className={cn("p-3", className)}
      classNames={{
        [UI.Months]: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        [UI.Month]: "space-y-4",
        [UI.MonthCaption]: "flex justify-center pt-1 relative items-center",
        [UI.CaptionLabel]: "text-sm font-semibold text-[#2A1711]",
        [UI.Nav]: "space-x-1 flex items-center",
        [UI.PreviousMonthButton]: cn(
          "h-7 w-7 bg-transparent p-0 rounded-full inline-flex items-center justify-center text-[#8A7362] hover:bg-[#FFF8F6] hover:text-[#FF8A00] transition-colors absolute left-1"
        ),
        [UI.NextMonthButton]: cn(
          "h-7 w-7 bg-transparent p-0 rounded-full inline-flex items-center justify-center text-[#8A7362] hover:bg-[#FFF8F6] hover:text-[#FF8A00] transition-colors absolute right-1"
        ),
        [UI.Weekdays]: "flex",
        [UI.Weekday]: "text-[#8A7362] rounded-full w-9 font-medium text-[11px] uppercase",
        [UI.Weeks]: "flex flex-col",
        [UI.Week]: "flex w-full mt-1",
        [UI.Day]: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full",
          "[&:has([aria-selected])]:bg-[#FFF3E5]"
        ),
        [UI.DayButton]: cn(
          "h-9 w-9 p-0 rounded-full font-normal text-[#564334] hover:bg-[#FFF8F6] transition-colors"
        ),
        [SelectionState.selected]:
          "bg-[#FF8A00] text-white hover:bg-[#E67E00] hover:text-white font-semibold",
        [DayFlag.today]: "bg-[#FFF8F6] text-[#FF8A00] font-semibold",
        [DayFlag.outside]: "text-[#DDC1AE] opacity-50 aria-selected:text-[#DDC1AE]",
        [DayFlag.disabled]: "text-[#DDC1AE] opacity-50",
        [SelectionState.range_middle]:
          "bg-[#FFF3E5] text-[#FF8A00]",
        [UI.Chevron]: "h-4 w-4",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
