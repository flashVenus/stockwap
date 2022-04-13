
const ENV = process.env.NODE_ENV
export default {
  DOMAIN: 'http://www.wxljcee.vip',
  // DOMAIN: 'http://localhost',
  // baseURL: ENV == 'development'?'http://sr.nqsoft.net':'http://sr.nqsoft.net',
  // baseURL: 'http://localhost:8070',
  /* Util API */
  baseURL: 'http://www.wxljcee.vip',
  // baseURL: 'http://localhost',
  util: {
    image: '/util/image.html' // 图片上传
  }
}
