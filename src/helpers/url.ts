// 处理 get 请求 url 拼接
import { isDate, isObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  // 将特殊字符转义回原字符
  /*  encodeURIComponent
      作用：转移除了  A-Z a-z 0-9 - _ . ! ~ * ' ( ) 之外的所有字符
  */
  return (
    /*
    /i 忽略大小写
    /g 全文查找所有匹配字符
    /m 多行查找
    /gi 全文查找，忽略大小写
    /ig 全文查找，忽略大小写
  */
    encodeURIComponent(val)
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%20/g, '+')
      .replace(/%5B/gi, '[')
      .replace(/%5D/gi, ']')
  )
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    return url
  }
  let serializedParams
  // 自定义的参数序列化规则
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    // 判断每个key值得类型
    Object.keys(params).forEach(key => {
      let val = params[key]
      if (val === null || typeof val === 'undefined') {
        return
      }
      let targetArray = []
      // 将每个值都封装成 数组 进行变化
      if (Array.isArray(val)) {
        targetArray = val
        key += '[]'
      } else {
        targetArray = [val]
      }
      // 将 targetArray 里的值，都变为对应的字符串格式
      targetArray.forEach(val => {
        if (isDate(val)) {
          // 转成 2022-10-21T03:33:10.062Z
          val = val.toISOString()
        } else if (isObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    // serialize v. 连播，连载
    serializedParams = parts.join('&') // 1&2
  }

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}

// 把 from 上的属性都扩展到 to 中，包括原型上的属性
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

// 判断url地址是不是绝对地址
export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

// 拼接 baseURL
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

// 同时满足条件，才是同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  const { protocol: parsedProtocol, host: parsedHost } = parsedOrigin
  const { protocol: currentProtocol, host: currentHost } = currentOrigin
  return parsedProtocol === currentProtocol && parsedHost === currentHost
}

const urlParsingNode = document.createElement('a')
// 当前页面的 url
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)

  // protocol 是协议，host 是端口
  const { protocol, host } = urlParsingNode
  return {
    protocol,
    host
  }
}

export function isFormData(val: any): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}
