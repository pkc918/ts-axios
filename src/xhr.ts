import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise(resolve => {
    const { data = null, url, method = 'get', headers, responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.onreadystatechange = function handleLoad() {
      /*
        0: 代理创建，但尚未调用 open
        1: open方法已经被调用
        2: send方法已经被调用，并且头部和状态已经可获得
        3: 下载中
        4: 下载操作已完成
      */
      if (request.readyState !== 4) {
        return
      }
      // 使用 getAllResponseHeaders 方法获取 headers
      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }

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
  })
}
