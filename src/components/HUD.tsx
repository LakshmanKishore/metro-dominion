import { GameState } from "../logic"
import { PlayerId } from "rune-sdk"

interface HUDProps {
  game: GameState
  yourPlayerId: PlayerId | undefined
}

export function HUD({ game, yourPlayerId }: HUDProps) {
  const colors = [
    "#e94560",
    "#4cd137",
    "#00a8ff",
    "#fbc531",
    "#9c88ff",
    "#e84118",
  ]

  return (
    <div className="hud-panel">
      {game.playerIds.map((pid, idx) => {
        const player = game.players[pid]
        const isTurn = game.turnPlayerId === pid
        const isMe = yourPlayerId === pid

        if (player.isBankrupt) return null // Hide bankrupt? Or show greyed out.

        return (
          <div
            key={pid}
            className="player-info"
            style={{
              opacity: player.isBankrupt ? 0.3 : 1,
              borderBottom: isTurn
                ? `3px solid ${colors[idx % colors.length]}`
                : "3px solid transparent",
              paddingBottom: "5px",
              color: isTurn ? "white" : "#aaa",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: colors[idx % colors.length],
                display: "inline-block",
                marginRight: "5px",
              }}
            ></div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                {isMe ? "YOU" : `P${idx + 1}`}
              </div>
              <div style={{ color: "#4cd137" }}>M{player.money}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
