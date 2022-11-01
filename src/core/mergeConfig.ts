import { deepMerge, isPlainObject } from '../helpers/util'
import { AxiosRequestConfig } from '../types'

// 存放当前需要的合并规则
const starts = Object.create(null)

// 共有的属性，第二个覆盖第一个
function defaultStart(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 两个 config，第一个没定义的属性，第二个定义属性
function fromVal2Start(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 合并 headers 对象
function deepMergeStart(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

const startKeysDeepMerge = ['headers', 'auth']
startKeysDeepMerge.forEach(key => {
  starts[key] = deepMergeStart
})

const startKeysFromTargetVal = ['url', 'params', 'data']
startKeysFromTargetVal.forEach(key => {
  starts[key] = fromVal2Start
})

// 合并 config
export default function mergeConfig(
  defaultConfig: AxiosRequestConfig,
  config?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config) {
    config = {}
  }
  const targetConfig = Object.create(null)

  for (let key in config) {
    mergeField(key)
  }

  for (let key in defaultConfig) {
    if (!config[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = starts[key] || defaultStart
    targetConfig[key] = strat(defaultConfig[key], config![key])
  }

  return targetConfig
}
