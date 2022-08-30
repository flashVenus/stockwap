
const ENV = process.env.NODE_ENV
export default {
  // DOMAIN: 'http://www.wxljcee.vip',
  DOMAIN: 'https://www.htzjzryxgs.vip',
  // DOMAIN: 'http://localhost',
  baseURL: ENV == 'development'?'https://www.htzjzryxgs.vip':'https://www.htzjzryxgs.vip',
  // baseURL: 'http://localhost:8070',
  /* Util API */
  // baseURL: 'http://www.wxljcee.vip',
  baseURL: 'https://www.htzjzryxgs.vip',
  // baseURL: 'http://localhost',
  util: {
    image: '/util/image.html' // 图片上传
  }
}
 