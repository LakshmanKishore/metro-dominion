export type TileType =
  | "START"
  | "ZONE"
  | "TRANSIT"
  | "UTILITY"
  | "EVENT"
  | "PENALTY"
  | "DETENTION"
  | "GO_TO_DETENTION"

export interface TileConfig {
  id: number
  type: TileType
  name: string
  price?: number
  rent?: number // Base rent
  group?: string // Color group or 'TRANSIT'/'UTILITY'
}

export const BOARD_CONFIG: TileConfig[] = [
  { id: 0, type: "START", name: "Central Station" },
  {
    id: 1,
    type: "ZONE",
    name: "Sector 1-A",
    price: 60,
    rent: 2,
    group: "BROWN",
  },
  { id: 2, type: "EVENT", name: "Data Link" },
  {
    id: 3,
    type: "ZONE",
    name: "Sector 1-B",
    price: 60,
    rent: 4,
    group: "BROWN",
  },
  { id: 4, type: "PENALTY", name: "Cyber Tax", rent: 200 },
  { id: 5, type: "TRANSIT", name: "North Hub", price: 200, rent: 25 },
  {
    id: 6,
    type: "ZONE",
    name: "Sector 2-A",
    price: 100,
    rent: 6,
    group: "SKY",
  },
  { id: 7, type: "EVENT", name: "Pulse" },
  {
    id: 8,
    type: "ZONE",
    name: "Sector 2-B",
    price: 100,
    rent: 6,
    group: "SKY",
  },
  {
    id: 9,
    type: "ZONE",
    name: "Sector 2-C",
    price: 120,
    rent: 8,
    group: "SKY",
  },
  { id: 10, type: "DETENTION", name: "Isolation" },
  {
    id: 11,
    type: "ZONE",
    name: "Sector 3-A",
    price: 140,
    rent: 10,
    group: "PINK",
  },
  { id: 12, type: "UTILITY", name: "Power Grid", price: 150 },
  {
    id: 13,
    type: "ZONE",
    name: "Sector 3-B",
    price: 140,
    rent: 10,
    group: "PINK",
  },
  {
    id: 14,
    type: "ZONE",
    name: "Sector 3-C",
    price: 160,
    rent: 12,
    group: "PINK",
  },
  { id: 15, type: "TRANSIT", name: "East Hub", price: 200, rent: 25 },
  {
    id: 16,
    type: "ZONE",
    name: "Sector 4-A",
    price: 180,
    rent: 14,
    group: "ORANGE",
  },
  { id: 17, type: "EVENT", name: "Data Link" },
  {
    id: 18,
    type: "ZONE",
    name: "Sector 4-B",
    price: 180,
    rent: 14,
    group: "ORANGE",
  },
  {
    id: 19,
    type: "ZONE",
    name: "Sector 4-C",
    price: 200,
    rent: 16,
    group: "ORANGE",
  },
  { id: 20, type: "EVENT", name: "System Reboot" }, // Free parking equivalent
  {
    id: 21,
    type: "ZONE",
    name: "Sector 5-A",
    price: 220,
    rent: 18,
    group: "RED",
  },
  { id: 22, type: "EVENT", name: "Pulse" },
  {
    id: 23,
    type: "ZONE",
    name: "Sector 5-B",
    price: 220,
    rent: 18,
    group: "RED",
  },
  {
    id: 24,
    type: "ZONE",
    name: "Sector 5-C",
    price: 240,
    rent: 20,
    group: "RED",
  },
  { id: 25, type: "TRANSIT", name: "South Hub", price: 200, rent: 25 },
  {
    id: 26,
    type: "ZONE",
    name: "Sector 6-A",
    price: 260,
    rent: 22,
    group: "YELLOW",
  },
  {
    id: 27,
    type: "ZONE",
    name: "Sector 6-B",
    price: 260,
    rent: 22,
    group: "YELLOW",
  },
  { id: 28, type: "UTILITY", name: "Water Works", price: 150 },
  {
    id: 29,
    type: "ZONE",
    name: "Sector 6-C",
    price: 280,
    rent: 24,
    group: "YELLOW",
  },
  { id: 30, type: "GO_TO_DETENTION", name: "Lockdown" },
  {
    id: 31,
    type: "ZONE",
    name: "Sector 7-A",
    price: 300,
    rent: 26,
    group: "GREEN",
  },
  {
    id: 32,
    type: "ZONE",
    name: "Sector 7-B",
    price: 300,
    rent: 26,
    group: "GREEN",
  },
  { id: 33, type: "EVENT", name: "Data Link" },
  {
    id: 34,
    type: "ZONE",
    name: "Sector 7-C",
    price: 320,
    rent: 28,
    group: "GREEN",
  },
  { id: 35, type: "TRANSIT", name: "West Hub", price: 200, rent: 25 },
  { id: 36, type: "EVENT", name: "Pulse" },
  {
    id: 37,
    type: "ZONE",
    name: "Sector 8-A",
    price: 350,
    rent: 35,
    group: "BLUE",
  },
  { id: 38, type: "PENALTY", name: "Luxury Tax", rent: 100 },
  {
    id: 39,
    type: "ZONE",
    name: "Sector 8-B",
    price: 400,
    rent: 50,
    group: "BLUE",
  },
]
