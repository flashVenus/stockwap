
const ENV = process.env.NODE_ENV
export default {
  DOMAIN: 'http://sr.nqsoft.net',
  baseURL: ENV == 'development'?'http://sr.nqsoft.net':'http://sr.nqsoft.net',
  // baseURL: 'http://localhost:8070',
  /* Util API */
  baseURL: 'http://sr.nqsoft.net',
  util: {
    image: '/util/image.html' // 图片上传
  }
}
