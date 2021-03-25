const axios = require("axios");

class ApiService {

  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async login(data, auth = false) {
    const login = await this.doRequest('post', `/login`, auth, data);
    if (login?.data?.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${login.data.token}`;
    return login.data.token
  }

  async doRequest(method, url, auth = false, data = null) {
    return await axios(this.requestOptions(method, url, auth, data))
  }

  requestOptions(method, url, auth = false, data = null) {
    const options = {};
    options.baseURL = this.baseURL;
    options.responseType = 'json';
    options.url = url;

    switch (true) {
      case /post/i.test(method): options.method = 'POST'; break;
      case /get/i.test(method): options.method = 'GET'; break;
      case /update|put/i.test(method): options.method = 'PUT'; break;
      case /delete/i.test(method): options.method = 'DELETE'; break;
      default: break;
    }


    // options.headers = {};
    // options.headers = auth
    //   ? this.authHeader(this.#baseHeader)
    //   : this.#baseHeader;

    if (data) options.data = data;
    return options;
  }
}

module.exports = ApiService;