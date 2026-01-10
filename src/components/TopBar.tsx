import { PlayerId } from "rune-sdk"

interface TopBarProps {
  turnPlayerId: PlayerId
  gamePlayerIds: PlayerId[]
}

export function TopBar({ turnPlayerId }: TopBarProps) {
  const player = Rune.getPlayerInfo(turnPlayerId)

  return (
    <div className="top-bar">
      <div className="turn-indicator">
        <img src={player.avatarUrl} className="turn-avatar" />
        <span className="turn-text">{player.displayName}&apos;s Turn</span>
      </div>
    </div>
  )
}
