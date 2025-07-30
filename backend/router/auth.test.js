import { routerIndex } from './index.router.js'
import { testServer } from '../test/testServer.js'

const request = testServer(routerIndex)

describe('[routes / auth]', () => {
  it('should return a response with status 200', async () => {
    // Arrange
    const expected = 302
    // Act
    const result = await request.get('/').send()

    // Assert
    expect(result.status).toEqual(expected)
    expect(result.headers.location).toBe('/auth')
  }, 10000)
})
