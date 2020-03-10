import Mock from 'mockjs';
import * as city from './components/city.js';
import * as home from './components/home.js';
import * as detail from './components/detail.js';

let isOpen=true;

fnCreate(city,isOpen);
fnCreate(home,isOpen);
fnCreate(detail,isOpen);

/** 
 * 创建mock模拟数据
 * @param {*} mod 模块
 * @param {*} isOpen  是否开启
*/

function fnCreate(mod , isOpen=true){
  // debugger;
  if(isOpen){
    for(let key in mod){
      // debugger;
      ((res) => {
        Mock.mock(new RegExp(res.url), res.type, (opts) => {
          // opts['data'] = opts.body ? JSON.parse(opts.body) : null
          // debugger;
          opts['data'] = transformForm2Json(opts.body)
          // opts['data']=res.data;
          delete opts.body
          console.log('\n')
          console.log('%cmock拦截, 请求: ', 'color:blue', opts)
          console.log('%cmock拦截, 响应: ', 'color:blue', res.data)
          return res.data
        })
      })(mod[key]() || {})
    }
  }
}
/**
 * 判断data的数据类型,如果是form格式的数据就进一步处理 转换成json格式呢
 */
function transformForm2Json (data) {
  if (!data) {
    return ''
  }
  if (data.includes('=')) {
    var obj = {}
    data.split('&').forEach((item) => {
      let temp = item.split('=')
      obj[temp[0]] = temp[1]
    })
    return obj
  }

  return JSON.parse(data)
}