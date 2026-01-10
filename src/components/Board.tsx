import { GameState } from "../logic"
import { BOARD_CONFIG } from "../boardData"
import { Tile } from "./Tile"
import { PlayerId } from "rune-sdk"

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

  return (
    <div className="board-container">
      {BOARD_CONFIG.map((config, index) => (
        <Tile
          key={config.id}
          config={config}
          state={game.board[index]}
          players={Object.values(game.players).filter(
            (p) => p.position === index && !p.isBankrupt
          )}
          index={index}
          playerColors={playerColors}
        />
      ))}

      <div className="center-area">
        <h2 style={{ margin: "0 0 10px 0", color: "var(--color-text-light)" }}>
          METRO DOMINION
        </h2>
        <div className="dice-display" style={{ margin: "10px 0" }}>
          {game.dice[0] === 0 ? "🎲" : `${game.dice[0]} + ${game.dice[1]}`}
        </div>
        <div
          style={{ margin: "10px 0", fontStyle: "italic", minHeight: "1.5em" }}
        >
          {game.lastActionText}
        </div>

        {game.phase === "ROLL" && game.turnPlayerId === yourPlayerId && (
          <button
            className="action-btn"
            onClick={() => Rune.actions.rollDice()}
          >
            ROLL DICE
          </button>
        )}

        {game.phase === "BUY_OR_PASS" && game.turnPlayerId === yourPlayerId && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="action-btn"
              onClick={() => Rune.actions.buyProperty()}
            >
              BUY
            </button>
            <button
              className="action-btn"
              onClick={() => Rune.actions.endTurn()}
              style={{ backgroundColor: "#555" }}
            >
              PASS
            </button>
          </div>
        )}

        {game.phase === "END" && game.turnPlayerId === yourPlayerId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
             {(() => {
                 const player = game.players[yourPlayerId];
                 const tileIndex = player.position;
                 const tileState = game.board[tileIndex];
                 const tileConfig = BOARD_CONFIG[tileIndex];
                 const canUpgrade = tileState.ownerId === yourPlayerId && 
                                  tileConfig.type === 'ZONE' && 
                                  tileState.level < 4 && 
                                  player.money >= (tileConfig.price || 0);
                 
                 if (canUpgrade) {
                     return (
                         <button className="action-btn" onClick={() => Rune.actions.upgradeProperty()} style={{marginBottom: '5px', backgroundColor: '#fbc531', color: '#333'}}>
                             UPGRADE (-M{tileConfig.price})
                         </button>
                     );
                 }
                 return null;
             })()}

             <button className="action-btn" onClick={() => Rune.actions.endTurn()}>
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
    </div>
  )
}
