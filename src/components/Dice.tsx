import { useEffect, useState, useRef } from "react"

interface DiceProps {
  values: [number, number]
}

export function Dice({ values }: DiceProps) {
  const [displayValues, setDisplayValues] = useState(values)
  const [rolling, setRolling] = useState(false)
  const prevValues = useRef(values)

  useEffect(() => {
    // If real values changed and are not [0,0] (initial), trigger roll
    if (
      values[0] !== prevValues.current[0] ||
      values[1] !== prevValues.current[1]
    ) {
      if (values[0] === 0 && values[1] === 0) return // Reset, don't roll

      setRolling(true)
      prevValues.current = values

      // Rapid shuffle
      const interval = setInterval(() => {
        setDisplayValues([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ])
      }, 50)

      // Stop after 500ms
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setDisplayValues(values)
        setRolling(false)
      }, 600)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else {
      // Just update if it wasn't a roll (e.g. init)
      if (!rolling) setDisplayValues(values)
    }
  }, [values])

  // Dice faces (Unicode or dots?)
  // Let's use simple blocks with numbers for clarity + style

  return (
    <div className={`dice-container ${rolling ? "rolling" : ""}`}>
      <div className="die">{displayValues[0] || "?"}</div>
      <div className="die">{displayValues[1] || "?"}</div>
    </div>
  )
}
