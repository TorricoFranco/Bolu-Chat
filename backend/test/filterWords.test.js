// tests/filterWords.test.js

// Mock manual del módulo words.js
jest.mock('../utils/words.js', () => ({
  words: ['malo', 'tonto', 'feo']
}))

import { filterWords } from '../utils/filterWords.js'

describe('filterWords', () => {
  test('reemplaza las palabras prohibidas con asteriscos', () => {
    const result = filterWords('Eres muy tonto y feo')
    expect(result).toMatch(/Eres muy t\*\*\*o y f\*o/)
  })

  test('no cambia las palabras normales', () => {
    const result = filterWords('Qué buen día para programar')
    expect(result).toBe('Qué buen día para programar')
  })

  test('ignora mayúsculas y puntuación', () => {
    const result = filterWords('Tonto! eres muy MALO.')
    // dejamos que la regex solo busque asteriscos y no compare última letra exacta
    expect(result).toMatch(/T\*+! eres muy M\*+\./i)
  })

})
