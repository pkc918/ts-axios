import { createError } from '../helpers/error'
import { parseHeaders } from '../helpers/headers'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types'

// 处理请求
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url!, true)

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

      // 网络错误，超时错误时候 status 为0
      if (request.status === 0) {
        return
      }
      // 使用 getAllResponseHeaders 方法获取 headers
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    // 网络错误
    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request))
    }

    // 超时错误
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach(key => {
      // 当 data 为 null 时， content-type 无意义
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        request.setRequestHeader(key, headers[key])
      }
    })
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      // [200, 300) 代表成功
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
