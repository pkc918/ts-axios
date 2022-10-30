import Axios from './core/Axios'
import mergeConfig from './core/mergeConfig'
import defaults from './defaults'
import { extend } from './helpers/url'
import { AxiosRequestConfig, AxiosStatic } from './types'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 让它本身就是一个函数
  const instance = Axios.prototype.request.bind(context)
  // 让它继承其他属性
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
// create 函数也是调用 createInstance
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
