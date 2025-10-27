// Test unitario de processImage(): valida que sharp se llame correctamente
// y se devuelva un nombre de archivo .jpeg usando mocks de sharp.

import { processImage } from '../../middleware/uploadImageMiddleware.js'
import sharp from 'sharp'
import fs from 'fs'

jest.mock('sharp', () => {
  const resizeMock = jest.fn().mockReturnThis()
  const jpegMock = jest.fn().mockReturnThis()
  const toFileMock = jest.fn().mockResolvedValue(true)
  return jest.fn(() => ({ resize: resizeMock, jpeg: jpegMock, toFile: toFileMock }))
})

describe('processImage', () => {
  test('Devuelve un nombre de archivo y llama a sharp correctamente', async () => {
    const buffer = Buffer.from('fake image')
    const filename = await processImage(buffer)

    expect(filename).toMatch(/\.jpeg$/)
    expect(sharp).toHaveBeenCalledWith(buffer)
  })
})
