import { useEffect, useState } from "react"
import { PlayerId } from "rune-sdk"
import { GameState } from "./logic"
import { Board } from "./components/Board"
import { HUD } from "./components/HUD"
import { TopBar } from "./components/TopBar"
import "./styles.css"

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)
      },
    })
  }, [])

  if (!game) {
    return <div style={{ color: "white" }}>Loading Game...</div>
  }

  return (
    <>
      <TopBar turnPlayerId={game.turnPlayerId} gamePlayerIds={game.playerIds} />
      <Board game={game} yourPlayerId={yourPlayerId} />
      <HUD game={game} yourPlayerId={yourPlayerId} />
    </>
  )
}

export default App
