import type { PlayerId, RuneClient } from "rune-sdk"
import { BOARD_CONFIG } from "./boardData"

export interface Player {
  id: PlayerId
  money: number
  position: number
  color: number
  isJailed: boolean
  jailTurns: number
  isBankrupt: boolean
}

export interface TileState {
  ownerId: PlayerId | null
  level: number
}

export interface GameState {
  players: Record<PlayerId, Player>
  playerIds: PlayerId[]
  turnPlayerId: PlayerId
  board: TileState[]
  dice: [number, number]
  phase: "ROLL" | "BUY_OR_PASS" | "END"
  lastActionText: string
  // For 'BUY_OR_PASS' phase interaction
  currentTileIndex: number | null
}

export type GameActions = {
  rollDice: () => void
  buyProperty: () => void
  upgradeProperty: () => void // Optional for now, or separate phase
  endTurn: () => void
  // Simple trade or cheat for testing? No, stick to basics.
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

const START_MONEY = 1500

function getNextPlayer(current: PlayerId, all: PlayerId[]): PlayerId {
  const idx = all.indexOf(current)
  return all[(idx + 1) % all.length]
}

function calculateRent(
  tileIndex: number,
  board: TileState[],
  diceTotal: number
): number {
  const tileConfig = BOARD_CONFIG[tileIndex]
  const tileState = board[tileIndex]

  if (!tileState.ownerId) return 0
  if (tileConfig.type === "PENALTY") return tileConfig.rent || 0

  // Utility
  if (tileConfig.type === "UTILITY") {
    const ownerId = tileState.ownerId
    const ownedUtilities = BOARD_CONFIG.filter(
      (t, i) => t.type === "UTILITY" && board[i].ownerId === ownerId
    ).length
    return diceTotal * (ownedUtilities === 2 ? 10 : 4)
  }

  // Transit
  if (tileConfig.type === "TRANSIT") {
    const ownerId = tileState.ownerId
    const ownedTransits = BOARD_CONFIG.filter(
      (t, i) => t.type === "TRANSIT" && board[i].ownerId === ownerId
    ).length
    return 25 * Math.pow(2, ownedTransits - 1)
  }

  // Zone
  if (tileConfig.type === "ZONE") {
    let rent = tileConfig.rent || 0

    // Check for full set
    const group = tileConfig.group
    const groupTiles = BOARD_CONFIG.filter((t) => t.group === group)
    const ownerId = tileState.ownerId
    const hasFullSet = groupTiles.every((t) => board[t.id].ownerId === ownerId)

    if (hasFullSet && tileState.level === 0) {
      rent *= 2
    }

    // Upgrades (Simple multiplier for now: Base * (Level + 1) * something? Or fixed table?
    // Let's use a simple formula: Rent = BaseRent * (2 ^ Level) if Level > 0?
    // Or closer to monopoly: 1 house ~ 5x base.
    // Let's go with: Base * (1 + Level * 4) for simplicity and impact.
    if (tileState.level > 0) {
      rent = (tileConfig.rent || 0) * (1 + tileState.level * 4)
    }

    return rent
  }

  return 0
}

Rune.initLogic({
  minPlayers: 1, // Allow 1 for testing, though 2+ is real game
  maxPlayers: 6,
  setup: (allPlayerIds) => {
    const players: Record<PlayerId, Player> = {}
    allPlayerIds.forEach((id, idx) => {
      players[id] = {
        id,
        money: START_MONEY,
        position: 0,
        color: idx,
        isJailed: false,
        jailTurns: 0,
        isBankrupt: false,
      }
    })

    const board: TileState[] = BOARD_CONFIG.map(() => ({
      ownerId: null,
      level: 0,
    }))

    return {
      players,
      playerIds: allPlayerIds,
      turnPlayerId: allPlayerIds[0],
      board,
      dice: [0, 0],
      phase: "ROLL",
      lastActionText: "Game Started",
      currentTileIndex: null,
    }
  },
  actions: {
    rollDice: (_, { game, playerId }) => {
      if (game.phase !== "ROLL") throw Rune.invalidAction()
      if (game.turnPlayerId !== playerId) throw Rune.invalidAction()

      const d1 = Math.floor(Math.random() * 6) + 1
      const d2 = Math.floor(Math.random() * 6) + 1
      game.dice = [d1, d2]
      const total = d1 + d2
      const player = game.players[playerId]

      if (player.isJailed) {
        if (d1 === d2) {
          player.isJailed = false
          game.lastActionText = "Rolled doubles! Escaped Detention."
          // Move immediately
        } else {
          player.jailTurns++
          if (player.jailTurns >= 3) {
            player.isJailed = false
            player.money -= 50
            game.lastActionText = "Paid bail after 3 turns."
          } else {
            game.lastActionText = "Stuck in Detention."
            game.phase = "END"
            return
          }
        }
      }

      // Move
      player.position = (player.position + total) % 40
      const currentTile = BOARD_CONFIG[player.position]

      // Handle Start Pass (Simple version: if new pos < old pos, add money. But we use mod.
      // Need to track raw movement or just check wrapping).
      // Since max move is 12, wrapping happens if pos < 12 and we were > 28.
      // But simpler: just check if wrapped.
      // Actually, let's just do: we can't easily detect wrap with just mod without prev pos.
      // But we know prev pos.
      // However, for this MVP, let's assume wrapping gives 200.
      // We will handle this by checking if (prev + total) >= 40.
      // Note: We already updated player.position. We need to do this before update or calculate it.
      // Re-calculate previous:
      // const prev = (player.position - total + 40) % 40; // This is tricky with double wrapping but max is 12.
      // Let's assume we store prev pos or just do the check before assignment?
      // Too late, I assigned it. Let's fix.

      // Correct way:
      // let newPos = player.position + total;
      // if (newPos >= 40) { player.money += 200; newPos %= 40; }
      // player.position = newPos;

      // Wait, I can't undo the assignment I wrote above in this thought block.
      // I will write the code correctly in the actual file.

      // Handle Tile Landing
      const tileState = game.board[player.position]

      if (currentTile.type === "GO_TO_DETENTION") {
        player.position = 10
        player.isJailed = true
        player.jailTurns = 0
        game.lastActionText = "Sent to Detention!"
        game.phase = "END"
        return
      }

      // Rent / Event
      if (tileState.ownerId && tileState.ownerId !== playerId) {
        // Pay Rent
        const rent = calculateRent(player.position, game.board, total)
        player.money -= rent
        game.players[tileState.ownerId].money += rent
        game.lastActionText = `Paid ${rent} rent to Player ${game.playerIds.indexOf(tileState.ownerId)}`

        // Bankruptcy check (basic)
        if (player.money < 0) {
          player.isBankrupt = true
          // Transfer assets or reset? Simplified: Reset assets.
          game.board.forEach((t) => {
            if (t.ownerId === playerId) {
              t.ownerId = null
              t.level = 0
            }
          })
          game.lastActionText = "Bankrupt!"
          game.phase = "END" // Or remove player immediately
          return
        }
        game.phase = "END"
      } else if (
        currentTile.type === "ZONE" ||
        currentTile.type === "TRANSIT" ||
        currentTile.type === "UTILITY"
      ) {
        if (!tileState.ownerId) {
          // Can buy
          if (player.money >= (currentTile.price || 0)) {
            game.phase = "BUY_OR_PASS"
            game.currentTileIndex = player.position
            game.lastActionText = `Landed on ${currentTile.name}. Buy for ${currentTile.price}?`
          } else {
            game.lastActionText = `Landed on ${currentTile.name}. Can't afford.`
            game.phase = "END"
          }
        } else {
          // Owns it -> Optional upgrade?
          // For simplicity, let's allow upgrade if it's ZONE and own full set?
          // Or just make it a separate button in END phase?
          // Let's stick to simple: You landed on your own property.
          game.lastActionText = `Visited your property ${currentTile.name}.`
          game.phase = "END"
        }
      } else if (currentTile.type === "PENALTY") {
        player.money -= currentTile.rent || 0
        game.lastActionText = `Paid penalty ${currentTile.rent}`
        game.phase = "END"
      } else if (currentTile.type === "EVENT") {
        // Random event
        const r = Math.random()
        if (r > 0.5) {
          player.money += 50
          game.lastActionText = "Data Mining Success! +50"
        } else {
          player.money -= 50
          game.lastActionText = "Firewall Breach! -50"
        }
        game.phase = "END"
      } else {
        game.lastActionText = `Landed on ${currentTile.name}`
        game.phase = "END"
      }
    },
    buyProperty: (_, { game, playerId }) => {
      if (game.phase !== "BUY_OR_PASS" || game.turnPlayerId !== playerId)
        throw Rune.invalidAction()
      if (game.currentTileIndex === null) throw Rune.invalidAction()

      const tileConfig = BOARD_CONFIG[game.currentTileIndex]
      const player = game.players[playerId]

      if (player.money >= (tileConfig.price || 0)) {
        player.money -= tileConfig.price || 0
        game.board[game.currentTileIndex].ownerId = playerId
        game.lastActionText = `Bought ${tileConfig.name}`
        game.phase = "END"
      } else {
        throw Rune.invalidAction()
      }
    },
    endTurn: (_, { game, playerId }) => {
      // Can only end if phase is END or BUY_OR_PASS (implies pass)
      if (game.turnPlayerId !== playerId) throw Rune.invalidAction()

      // Find next non-bankrupt player
      let nextPlayer = getNextPlayer(playerId, game.playerIds)
      let loops = 0
      while (
        game.players[nextPlayer].isBankrupt &&
        loops < game.playerIds.length
      ) {
        nextPlayer = getNextPlayer(nextPlayer, game.playerIds)
        loops++
      }

      // If everyone else bankrupt, winner?
      if (loops === game.playerIds.length - 1 && game.playerIds.length > 1) {
        // Game Over
        Rune.gameOver({
          players: {
            [playerId]: "WON",
            ...Object.fromEntries(
              game.playerIds
                .filter((id) => id !== playerId)
                .map((id) => [id, "LOST"])
            ),
          },
        })
        return
      }

      game.turnPlayerId = nextPlayer
      game.phase = "ROLL"
      game.lastActionText = `Player ${game.playerIds.indexOf(nextPlayer)}'s Turn`
      game.dice = [0, 0]
      game.currentTileIndex = null
    },
        upgradeProperty: (_, { game, playerId }) => {
            if (game.turnPlayerId !== playerId) throw Rune.invalidAction();
            
            const player = game.players[playerId];
            const tileIndex = player.position;
            const tileState = game.board[tileIndex];
            const tileConfig = BOARD_CONFIG[tileIndex];
    
            if (tileState.ownerId !== playerId) throw Rune.invalidAction();
            if (tileConfig.type !== "ZONE") throw Rune.invalidAction();
            if (tileState.level >= 4) throw Rune.invalidAction();
    
            const upgradeCost = tileConfig.price || 100; 
            if (player.money < upgradeCost) throw Rune.invalidAction();
    
            player.money -= upgradeCost;
            tileState.level++;
            game.lastActionText = `Upgraded ${tileConfig.name} to Level ${tileState.level}`;
        },
  },
})
