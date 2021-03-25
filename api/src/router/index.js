const express = require('express');

const ImmobilierRoutes = require('./routes/Immobilier.routes')
const LoginRoutes = require('./routes/Login.routes')
const UserRoutes = require('./routes/User.routes')


const router = express.Router();

ImmobilierRoutes(router)
LoginRoutes(router)
UserRoutes(router)

module.exports = router