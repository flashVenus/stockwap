
const ENV = process.env.NODE_ENV
export default {
  // DOMAIN: 'http://www.wxljcee.vip',
  DOMAIN: 'https://www.mxkjdmx.vip',
  // DOMAIN: 'http://localhost',
  baseURL: ENV == 'development'?'https://www.mxkjdmx.vip':'https://www.mxkjdmx.vip',
  // baseURL: 'http://localhost:8070',
  /* Util API */
  // baseURL: 'http://www.wxljcee.vip',
  baseURL: 'https://www.mxkjdmx.vip',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  // baseURL: 'http://localhost',
  util: {
    image: '/util/image.html' // 图片上传
  }
}
