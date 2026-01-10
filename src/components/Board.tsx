import { GameState } from "../logic"
import { BOARD_CONFIG } from "../boardData"
import { Tile } from "./Tile"
import { PlayerId } from "rune-sdk"
import { PlayerToken } from "./PlayerToken"
import { Dice } from "./Dice"
import { PropertyCard } from "./PropertyCard"
import React, { useState } from "react"

interface BoardProps {
  game: GameState
  yourPlayerId: PlayerId | undefined
}

export function Board({ game, yourPlayerId }: BoardProps) {
  const colors = [
    "#e94560",
    "#4cd137",
    "#00a8ff",
    "#fbc531",
    "#9c88ff",
    "#e84118",
  ]
  const playerColors: Record<PlayerId, string> = {}
  game.playerIds.forEach((pid, idx) => {
    playerColors[pid] = colors[idx % colors.length]
  })

  // Calculate tokens
  const activePlayers = Object.values(game.players).filter(
    (p) => !p.isBankrupt && game.playerIds.includes(p.id)
  )

  // Animation Delay Logic
  const [isAnimating, setIsAnimating] = useState(false)
  const prevDiceSum = React.useRef(0)

  React.useEffect(() => {
    const currentSum = game.dice[0] + game.dice[1]
    // If dice changed from 0 or to a new value (roll happened)
    // We check against ref to avoid re-triggering on other state changes
    if (currentSum > 0 && currentSum !== prevDiceSum.current) {
      setIsAnimating(true)
      // Duration: Dice Roll (600) + Movement (200 * steps) + Buffer (500)
      const duration = 600 + currentSum * 200 + 500
      const timer = setTimeout(() => setIsAnimating(false), duration)
      prevDiceSum.current = currentSum
      return () => clearTimeout(timer)
    } else if (currentSum === 0) {
      setIsAnimating(false)
      prevDiceSum.current = 0
    }
  }, [game.dice])

  const showActions = !isAnimating && game.turnPlayerId === yourPlayerId

  return (
    <div className="board-container">
      {BOARD_CONFIG.map((config, index) => (
        <Tile
          key={config.id}
          config={config}
          state={game.board[index]}
          index={index}
          playerColors={playerColors}
        />
      ))}

      {/* Player Tokens Layer */}
      {activePlayers.map((player) => {
        // Count players on this same tile for offset
        const playersOnTile = activePlayers.filter(
          (p) => p.position === player.position
        )
        const indexOnTile = playersOnTile.indexOf(player)

        return (
          <PlayerToken
            key={player.id}
            player={player}
            color={playerColors[player.id]}
            isTurn={game.turnPlayerId === player.id}
            index={indexOnTile}
            totalOnTile={playersOnTile.length}
          />
        )
      })}

      <div className="center-area">
        <h2
          style={{
            margin: "0 0 10px 0",
            color: "var(--color-text-light)",
            fontSize: "1.5rem",
            letterSpacing: "2px",
          }}
        >
          METRO
          <br />
          DOMINION
        </h2>

        <Dice values={game.dice} />

        <div
          style={{
            margin: "10px 0",
            fontStyle: "italic",
            minHeight: "1.5em",
            transition: "all 0.3s",
            fontSize: "0.9rem",
          }}
        >
          {game.lastActionText}
        </div>

        {game.phase === "ROLL" && showActions && (
          <button
            className="action-btn"
            onClick={() => Rune.actions.rollDice()}
          >
            ROLL DICE
          </button>
        )}

        {game.phase === "END" && showActions && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {(() => {
              const player = game.players[yourPlayerId]
              const tileIndex = player.position
              const tileState = game.board[tileIndex]
              const tileConfig = BOARD_CONFIG[tileIndex]
              const canUpgrade =
                tileState.ownerId === yourPlayerId &&
                tileConfig.type === "ZONE" &&
                tileState.level < 4 &&
                player.money >= (tileConfig.price || 0)

              if (canUpgrade) {
                return (
                  <button
                    className="action-btn"
                    onClick={() => Rune.actions.upgradeProperty()}
                    style={{
                      marginBottom: "5px",
                      backgroundColor: "#fbc531",
                      color: "#333",
                    }}
                  >
                    UPGRADE (-M{tileConfig.price})
                  </button>
                )
              }
              return null
            })()}

            <button
              className="action-btn"
              onClick={() => Rune.actions.endTurn()}
            >
              END TURN
            </button>
          </div>
        )}

        {game.turnPlayerId !== yourPlayerId && (
          <div style={{ color: "#aaa" }}>
            Waiting for Player {game.playerIds.indexOf(game.turnPlayerId)}...
          </div>
        )}
      </div>

      {/* PropertyCard Modal */}
      {game.phase === "BUY_OR_PASS" &&
        showActions &&
        game.currentTileIndex !== null && (
          <PropertyCard
            config={BOARD_CONFIG[game.currentTileIndex]}
            playerMoney={game.players[yourPlayerId].money}
            onBuy={() => Rune.actions.buyProperty()}
            onPass={() => Rune.actions.endTurn()}
          />
        )}
    </div>
  )
}
