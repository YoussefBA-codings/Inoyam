
const AxiosService = require('./apiService');

class ImmobilierService extends AxiosService {

  constructor(baseURL) {
    super(baseURL)
  }

  gets() {
    return super.doRequest('get', `/immobiliers`);
  }

  get(id) {
    return super.doRequest('get', `/immobiliers/${id}`);
  }

  post(data, auth = true) {
    return super.doRequest('post', `/immobiliers`, auth, data);
  }

  put(id, data, auth = true) {
    return super.doRequest('put', `/immobiliers/${id}`, auth, data);
  }

  delete(id, auth = true) {
    return super.doRequest('delete', `/immobiliers/${id}`, auth);
  }
}

module.exports = ImmobilierService;