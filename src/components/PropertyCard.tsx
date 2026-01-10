import { TileConfig } from "../boardData"

interface PropertyCardProps {
  config: TileConfig
  playerMoney: number
  onBuy: () => void
  onPass: () => void
}

export function PropertyCard({
  config,
  playerMoney,
  onBuy,
  onPass,
}: PropertyCardProps) {
  const groupColors: Record<string, string> = {
    BROWN: "#8d6e63",
    SKY: "#81d4fa",
    PINK: "#f48fb1",
    ORANGE: "#ffcc80",
    RED: "#ef5350",
    YELLOW: "#fff59d",
    GREEN: "#a5d6a7",
    BLUE: "#90caf9",
  }

  const headerColor = config.group
    ? groupColors[config.group] || "#ccc"
    : "#ccc"
  const rent = config.rent || 0
  const price = config.price || 0
  const canAfford = playerMoney >= price

  return (
    <div className="property-card-overlay">
      <div className="property-card">
        <div className="card-header" style={{ backgroundColor: headerColor }}>
          <div className="card-title-small">DEED</div>
          <div className="card-name">{config.name}</div>
        </div>

        <div className="card-body">
          <div className="rent-row">
            <span>Rent</span>
            <span>M{rent}</span>
          </div>
          <div className="rent-row">
            <span>With 1 Upgrade</span>
            <span>M{rent * 5}</span>
          </div>
          <div className="rent-row">
            <span>With 2 Upgrades</span>
            <span>M{rent * 9}</span>
          </div>
          <div className="rent-row">
            <span>With 3 Upgrades</span>
            <span>M{rent * 13}</span>
          </div>
          <div className="rent-row">
            <span>With 4 Upgrades</span>
            <span>M{rent * 17}</span>
          </div>

          <div className="divider"></div>

          <div className="price-row">
            <span>PRICE</span>
            <span>M{price}</span>
          </div>
        </div>

        <div className="card-actions">
          <button className="card-btn pass" onClick={onPass}>
            PASS
          </button>
          <button
            className="card-btn buy"
            onClick={onBuy}
            disabled={!canAfford}
          >
            BUY (M{price})
          </button>
        </div>
        {!canAfford && <div className="error-text">Insufficient Funds</div>}
      </div>
    </div>
  )
}
