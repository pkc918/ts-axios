import axios, { AxiosPromise } from '../../src/index'

axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hi'
  }
})

axios('/extend/post', {
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'hello'
  }
})

axios.get('/extend/get')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.head('/extend/head')

axios.post('/extend/post', { msg: 'post' })

axios.put('/extend/put', { msg: 'put' })

axios.patch('/extend/patch', { msg: 'patch' })

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string
  age: number
}

async function getUser<T>() {
  const { data } = await axios<ResponseData<T>>('/extend/user')
  return data
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user.result.name)
  }
}
test()
