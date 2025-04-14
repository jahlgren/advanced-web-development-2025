import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type DateTimePickerProps = {
  value: Date | null
  disabled?: boolean,
  preventClear?: boolean,
  onChange: (date: Date | null) => void
}

function getHourMinutes(date?: Date|null) {
  const time = date ? date : new Date();
  return time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0');
}

export function DateTimePicker({ value, disabled, preventClear, onChange }: DateTimePickerProps) {

  const [date, setDate] = useState<Date | undefined>(value ?? undefined)
  const [time, setTime] = useState(getHourMinutes(value))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (value) {
      const hours = value.getHours().toString().padStart(2, "0")
      const minutes = value.getMinutes().toString().padStart(2, "0")
      setDate(value)
      setTime(`${hours}:${minutes}`)
    } else {
      setDate(undefined)
      setTime(getHourMinutes())
    }
  }, [value])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (date) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const updated = new Date(date)
      updated.setHours(hours)
      updated.setMinutes(minutes)
      onChange(updated)
    }
  }

  const handleDateChange = (selected: Date | undefined) => {
    setDate(selected)
    if (selected) {
      const [hours, minutes] = time.split(":").map(Number)
      const combined = new Date(selected)
      combined.setHours(hours)
      combined.setMinutes(minutes)
      onChange(combined)
    } else {
      onChange(null)
    }
  }

  const handleClear = () => {
    setDate(undefined)
    setTime("12:00")
    onChange(null)
    setOpen(false)
  }

  const displayValue = date
    ? (() => {
        const [hours, minutes] = time.split(":").map(Number)
        const displayDate = new Date(date)
        displayDate.setHours(hours)
        displayDate.setMinutes(minutes)
        return format(displayDate, "PPP HH:mm")
      })()
    : "Pick a date and time"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          className="w-full font-normal flex items-center justify-between gap-2"
          disabled={disabled}
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {displayValue}
          </span>
          {value && !preventClear && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                if(disabled)
                  return;
                handleClear()
              }}
              className="p-1 hover:text-destructive cursor-pointer text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          required={preventClear}
          disabled={disabled}
        />
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpen(false)
            }
          }}
          className="w-full"
          step="60"
          disabled={!date||disabled}
        />
      </PopoverContent>
    </Popover>
  )
}