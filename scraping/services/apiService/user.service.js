
const AxiosService = require('./apiService');

class UserService extends AxiosService {

  constructor(baseURL) {
    super(baseURL)
  }

  gets() {
    return super.doRequest('get', `/users`);
  }

  get(id) {
    return super.doRequest('get', `/users/${id}`);
  }

  post(data, auth = true) {
    return super.doRequest('post', `/users`, auth, data);
  }

  put(id, data, auth = true) {
    return super.doRequest('put', `/users/${id}`, auth, data);
  }

  delete(id, auth = true) {
    return super.doRequest('delete', `/users/${id}`, auth);
  }
}

module.exports = UserService;