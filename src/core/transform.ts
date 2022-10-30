import { AxiosTransformer } from '../types'

// 管道执行 函数
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  // 让 data 每次都变成新的data
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}
