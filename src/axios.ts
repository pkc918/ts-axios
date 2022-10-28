import Axios from './core/Axios'
import defaults from './defaults'
import { extend } from './helpers/url'
import { AxiosInstance, AxiosRequestConfig } from './types'

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config)
  // 让它本身就是一个函数
  const instance = Axios.prototype.request.bind(context)
  // 让它继承其他属性
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance(defaults)
export default axios
