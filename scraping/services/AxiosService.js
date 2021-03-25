const axios = require("axios");
const querystring = require('querystring');


class AxiosService {

  constructor(baseURL) {
    this.baseURL = baseURL
  }

  doRequest(method, url, paramsQs = {}) {
    return axios(this.requestOptions(method, url, paramsQs))
  }

  requestOptions(method, url, paramsQs) {
    const options = {};
    options.baseURL = this.baseURL;
    options.responseType = 'json';

    if (paramsQs) {
      const qs = querystring.stringify(paramsQs)
      options.url = `${url}?${qs}`
    } else option.url = url

    switch (true) {
      case /post/i.test(method): options.method = 'POST'; break;
      case /get/i.test(method): options.method = 'GET'; break;
      case /update|put/i.test(method): options.method = 'PUT'; break;
      case /delete/i.test(method): options.method = 'DELETE'; break;
      default: break;
    }

    return options;
  }
}

module.exports = AxiosService;