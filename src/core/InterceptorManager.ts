import { RejectedFn, ResolvedFn } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> {
  // 私有变量，存放拦截器
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  // 定义拦截器，添加进私有变量
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  // 删除拦截器，置为 null
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }

  // 内部使用
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
}
