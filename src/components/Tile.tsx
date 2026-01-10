import { TileConfig } from "../boardData"
import { TileState, Player } from "../logic"
import { PlayerId } from "rune-sdk"

interface TileProps {
  config: TileConfig
  state: TileState
  players: Player[]
  index: number
  playerColors: Record<PlayerId, string>
}

export function Tile({
  config,
  state,
  players,
  index,
  playerColors,
}: TileProps) {
  const getGridPos = (i: number) => {
    if (i === 0) return { col: 11, row: 11 }
    if (i < 10) return { col: 11 - i, row: 11 }
    if (i === 10) return { col: 1, row: 11 }
    if (i < 20) return { col: 1, row: 11 - (i - 10) }
    if (i === 20) return { col: 1, row: 1 }
    if (i < 30) return { col: 1 + (i - 20), row: 1 }
    if (i === 30) return { col: 11, row: 1 }
    if (i < 40) return { col: 11, row: 1 + (i - 30) }
    return { col: 1, row: 1 }
  }

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
  const borderStyle = ownerColor ? { border: `2px solid ${ownerColor}` } : {}

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

      {/* Players on this tile */}
      <div
        style={{
          position: "absolute",
          bottom: "2px",
          display: "flex",
          gap: "2px",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {players.map((p) => (
          <div
            key={p.id}
            className="player-token"
            style={{
              backgroundColor: playerColors[p.id],
              position: "static",
              width: "10px",
              height: "10px",
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
