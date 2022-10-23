import Axios from './core/Axios'
import { extend } from './helpers/url'
import { AxiosInstance } from './types'

function createInstance(): AxiosInstance {
  const context = new Axios()
  // 让它本身就是一个函数
  const instance = Axios.prototype.request.bind(context)
  // 让它继承其他属性
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()
export default axios
