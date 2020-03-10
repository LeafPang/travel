import axios from 'axios';
import qs from 'qs'

const http=axios.create({
  timeout:1000*30,
  withCredentials:true,
  headers:{
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

/**
 * 请求拦截
 */
http.interceptors.request.use(config=>{
  config.headers['X-CSRF-TOKEN'] = sessionStorage.getItem('token') // 请求头带上token
  return config;
},error=>{
  return Promise.reject(error);
});
/**
 * 相应拦截
 */
http.interceptors.response.use(response=>{
  if(response.data && response.data === 401){ //401  token失效

    window.location.href=window.SITE_CONFIG.baseUrl;
  }
  return response;
},error=>{
  if((error.response && error.response.status === 401) || (error.response.data && error.response.data.status === 401)){
    window.location.href = window.SITE_CONFIG.baseUrl
  }
  return Promise.reject(error)
});

/** 
 * 请求地址处理
 * @param {*} actionName action方法
*/
http.adornUrl=(actionName)=>{
  // debugger;
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  // console.log(process.env.OPEN_PROXY);
  // console.log(process.env.NODE_ENV);
  // let condition=process.env.NODE_ENV !=='production' && process.env.OPEN_PROXY
  // if(condition){
  //   return '/api/'+actionName
  // }else {
  //   return window.SITE_CONFIG.baseUrl + actionName
  // }
  return '/api/'+actionName
};
/** 
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
*/
http.adornParams=(params = {}, openDefultParams = true)=>{
  return openDefultParams ? params : params
}
/** 
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
*/
http.adornData=(data = {}, openDefultdata = true, contentType = 'json')=>{
  data = openDefultdata ? data : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http;