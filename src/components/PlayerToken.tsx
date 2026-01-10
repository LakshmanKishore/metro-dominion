import { PlayerId } from "rune-sdk"
import { useEffect, useState, useRef } from "react"
import { getGridPos } from "../utils/grid"

interface PlayerTokenProps {
  player: {
    id: PlayerId
    color: number
    position: number
    money: number
    isBankrupt: boolean
  }
  color: string
  isTurn: boolean
  index: number
  totalOnTile: number
}

export function PlayerToken({
  player,
  color,
  isTurn,
  index,
  totalOnTile,
}: PlayerTokenProps) {
  const [moneyDiff, setMoneyDiff] = useState<{
    val: number
    id: number
  } | null>(null)
  const [visualPos, setVisualPos] = useState(player.position)
  const [isMoving, setIsMoving] = useState(false)

  const prevMoney = useRef(player.money)
  const prevTargetPos = useRef(player.position)

  useEffect(() => {
    if (player.money !== prevMoney.current) {
      const diff = player.money - prevMoney.current
      setMoneyDiff({ val: diff, id: Date.now() })
      prevMoney.current = player.money
      const timer = setTimeout(() => setMoneyDiff(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [player.money])

  useEffect(() => {
    // Only trigger if real position changed
    if (player.position !== prevTargetPos.current) {
      const startPos = prevTargetPos.current
      const targetPos = player.position
      prevTargetPos.current = player.position

      setIsMoving(true)

      // Wait for Dice Animation (approx 600ms)
      const startDelay = setTimeout(() => {
        // Calculate path
        const path: number[] = []
        let curr = startPos
        // Handle wrapping: 38 -> 4 (rolled 6)
        // Path: 39, 0, 1, 2, 3, 4
        while (curr !== targetPos) {
          curr = (curr + 1) % 40
          path.push(curr)
        }

        // Animate steps
        let step = 0
        const interval = setInterval(() => {
          if (step < path.length) {
            setVisualPos(path[step])
            step++
          } else {
            clearInterval(interval)
            setIsMoving(false)
          }
        }, 200) // 200ms per tile
      }, 600)

      return () => clearTimeout(startDelay)
    } else {
      // Initial render or re-mount sync
      if (!isMoving && visualPos !== player.position) {
        setVisualPos(player.position)
      }
    }
  }, [player.position])

  const { col, row } = getGridPos(visualPos)

  const offsetBase = 6
  const offset = (index - (totalOnTile - 1) / 2) * offsetBase

  // Use Rune.getPlayerInfo safely
  const playerInfo = Rune.getPlayerInfo(player.id)

  return (
    <div
      className={`player-token ${isMoving ? "jumping" : ""}`}
      style={
        {
          borderColor: color, // Border is player color
          gridColumn: col,
          gridRow: row,
          transform: `translate(${offset}px, ${offset}px)`,
          zIndex: 20 + index,
          boxShadow: isTurn
            ? `0 0 15px 3px ${color}`
            : "0 2px 5px rgba(0,0,0,0.5)",
          backgroundImage: `url(${playerInfo.avatarUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#fff", // Fallback
          borderWidth: "2px",
          borderStyle: "solid",
        } as React.CSSProperties
      }
    >
      {/* Money Floating Text */}
      {moneyDiff && (
        <div className={`money-float ${moneyDiff.val > 0 ? "pos" : "neg"}`}>
          {moneyDiff.val > 0 ? "+" : ""}M{moneyDiff.val}
        </div>
      )}
    </div>
  )
}
