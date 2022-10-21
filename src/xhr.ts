import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get', headers } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, true)

  Object.keys(headers).forEach(key => {
    // 当 data 为 null 时， content-type 无意义
    if (data === null && key.toLowerCase() === 'content-type') {
      delete headers[key]
    } else {
      request.setRequestHeader(key, headers[key])
    }
  })
  request.send(data)
}
