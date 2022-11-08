// 处理 headers
import { METHOD } from '../types'
import { deepMerge, isPlainObject } from './util'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(key => {
    if (key !== normalizeName && key.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  // 默认添加 Content-Type
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  // "connection: keep-alive\r\ncontent-length: 13"
  headers.split('\r\n').forEach(line => {
    let [key, ...values] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    parsed[key] = values.join(':').trim()
  })
  return parsed
}

export function flattenHeaders(headers: any, method: METHOD): any {
  if (!headers) {
    return headers
  }
  // deepMerge 返回一级对象
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
