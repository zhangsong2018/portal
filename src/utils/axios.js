import axios from "src/utils/axios";
import qs from "qs";

// axios 配置
axios.defaults.timeout = 10000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8008';
//axios.defaults.baseURL = getBaseUrl(window.location.href);

//axios.defaults.baseURL = 'http://localhost:8008';
axios.defaults.baseURL = 'http://omscon.test.com';
//axios.defaults.headers.common[ 'authUid' ] = auth.getUid();
//axios.defaults.headers.common[ 'authSid' ] = auth.getSid();
//设置公用的头部token
//console.log('获取本地token:',auth.bearerToken())
//axios.defaults.headers.common[ 'Authorization' ] = "Bearer "+auth.bearerToken();

//POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    //debugger
    config.data = qs.stringify(config.data);
  }

  return config;
}, (error) => {
  console.log('get错误类型：',error);
  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(
  response => {
    if (response.data && response.data.code) {
      if (response.data.code === '401') {
        auth.logout()
      }
    }
    return response;
  },
  error => {
      if (error && error.response) {
        var message = null;
        switch (error.response.status) {
          case 400:
            message = '错误请求'
            break;
          case 401:
            message = '未授权，请重新登录'
            break;
          case 403:
            message = '拒绝访问'
            break;
          case 404:
            message = '请求错误,未找到该资源'
            break;
          case 405:
            message = '请求方法未允许'
            break;
          case 408:
            message = '请求超时'
            break;
          case 500:
            message = '服务器端出错'
            break;
          case 501:
            message = '网络未实现'
            break;
          case 502:
            message = '网络错误'
            break;
          case 503:
            message = '服务不可用'
            break;
          case 504:
            message = '网络超时'
            break;
          case 505:
            message = 'http版本不支持该请求'
            break;
          default:
            message = `连接错误${error.response.status}`
        }
      } else {
        message = "连接到服务器失败"
      }
      Vue.prototype.showToast(message, '20em')
      // 处理响应失败
      return Promise.resolve(error.response)

  });


export function fetch (url, config = { method: 'get' }) {
  return axios.request({ ...config, url })
  // return new Promise((resolve, reject) => {
  //   axios.request({ ...config, url })
  //     .then(response => {
  //       resolve(response.data);
  //     }, err => {
  //       reject(err);
  //     })
  //     .catch((error) => {
  //       reject(error)
  //     })
  // })
}

export default axios
