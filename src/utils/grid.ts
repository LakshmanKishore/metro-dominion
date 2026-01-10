export function getGridPos(i: number) {
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
