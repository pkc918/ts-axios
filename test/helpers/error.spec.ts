import { AxiosRequestConfig, AxiosResponse } from '../../src'
import { createError } from '../../src/helpers/error'

describe('helpers/error', () => {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: AxiosRequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createError('Error', config, 'Test', request, response)
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Error')
    expect(error.config).toBe(config)
    expect(error.code).toBe('Test')
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
  })
})
