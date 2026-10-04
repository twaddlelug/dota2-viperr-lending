import { describe, expect, it } from 'vitest'
import { positionLabel, positionWithNumber, toPosition } from './team'

describe('toPosition', () => {
  it('keeps positions 1–5', () => {
    expect(toPosition(1)).toBe(1)
    expect(toPosition(5)).toBe(5)
  })

  it('reads anything else as the substitute', () => {
    expect(toPosition(null)).toBeNull()
    expect(toPosition(0)).toBeNull()
    expect(toPosition(6)).toBeNull()
    expect(toPosition('1')).toBeNull()
  })
})

describe('position labels', () => {
  it('names positions in English and the substitute in Russian', () => {
    expect(positionLabel(1)).toBe('Carry')
    expect(positionWithNumber(4)).toBe('4 · Soft Support')
    expect(positionLabel(null)).toBe('Запасной')
    expect(positionWithNumber(null)).toBe('Запасной')
  })
})
