import Axios from "axios"
const axios = Axios.create({
  baseURL:"http://211.159.186.47:8088",
  // target:"http://211.159.186.47:8088",
  timeout: 10000,
  headers:{"Content-Type":"application/x-www-form-urlencoded"},
  // withCredentials:true,
  changeOrigin:true,
  // headers: {'X-Custom-Header': 'foobar'}
})
//请求拦截  加入token
axios.interceptors.request.use(
  config=>{
    config.headers.Token=document.cookie
    return config
  }
)
//响应拦截 便于错误处理
axios.interceptors.response.use(
  response => {
    // console.log("response", response)
    return response
  },
  err => {
    console.log(err);
    if (!err.response) {
      alert("网络错误")
      return Promise.reject("网络错误")
    }
    return Promise.resolve(err.response)
  }
)
export default {axios}