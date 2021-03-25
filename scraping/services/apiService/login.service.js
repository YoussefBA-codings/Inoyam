
const AxiosService = require('./apiService');

class LoginService extends AxiosService {

  constructor() {
    super()
  }

  login(data, auth = false) {
    return super.doRequest('post', `/login`, auth, data);
  }
}

module.exports = LoginService;