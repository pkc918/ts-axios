import { isDate, isObject } from './util'

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

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
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
  let serializedParams = parts.join('&') // 1&2
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.includes('?') ? '&' : '?') + serializedParams
  }
  return url
}
