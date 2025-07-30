import { words } from './words.js'

export const filterWords = (mensaje) => {
  const palabras = mensaje.split(/\s+/)
  const posiciones = []

  for (let i = 0; i < palabras.length; i++) {
    const palabraLimpia = palabras[i].toLowerCase().replace(/[.,!?]/g, '') // opcional: limpiar puntuación
    if (words.includes(palabraLimpia)) {
      posiciones.push(i)
    }
  }

  posiciones.forEach(pos => {
    const ultimaLetra = palabras[pos].length - 1
    palabras[pos] = palabras[pos][0] + '*'.repeat(palabras[pos].length - 2) + palabras[pos][ultimaLetra]
  })

  return palabras.join(' ')
}
