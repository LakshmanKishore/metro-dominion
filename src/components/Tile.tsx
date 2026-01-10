import { TileConfig } from "../boardData"
import { TileState } from "../logic"
import { PlayerId } from "rune-sdk"
import { getGridPos } from "../utils/grid"

interface TileProps {
  config: TileConfig
  state: TileState
  index: number
  playerColors: Record<PlayerId, string>
}

export function Tile({ config, state, index, playerColors }: TileProps) {
  const { col, row } = getGridPos(index)

  const style: React.CSSProperties = {
    gridColumn: col,
    gridRow: row,
  }

  const groupColor = config.group
    ? `var(--group-${config.group.toLowerCase()})`
    : undefined

  // Determine border for ownership
  const ownerColor = state.ownerId ? playerColors[state.ownerId] : null
  const borderStyle = ownerColor ? { border: `3px solid ${ownerColor}` } : {}

  return (
    <div
      className={`tile ${index % 10 === 0 ? "corner" : ""}`}
      style={{ ...style, ...borderStyle }}
    >
      {config.type === "ZONE" && (
        <div
          className="tile-header"
          style={{ backgroundColor: groupColor }}
        ></div>
      )}
      <div className="tile-name">{config.name}</div>
      {config.price && <div className="tile-price">M{config.price}</div>}

      {state.ownerId && (
        <div
          className="owner-marker"
          style={{ backgroundColor: ownerColor || "#000" }}
        ></div>
      )}

      {/* Upgrades */}
      {state.level > 0 && (
        <div
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            fontSize: "0.6rem",
            fontWeight: "bold",
            color: "var(--color-accent)",
          }}
        >
          {"★".repeat(state.level)}
        </div>
      )}
    </div>
  )
}
