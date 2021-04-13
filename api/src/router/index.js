const express = require('express');

const ImmobilierRoutes = require('./routes/Immobilier.routes');
const LoginRoutes = require('./routes/Login.routes');
const UserRoutes = require('./routes/User.routes');
const AppUserRoutes = require('./routes/AppUser.route');
const SimulationRoutes = require('./routes/Simulation.route');

const router = express.Router();

ImmobilierRoutes(router);
LoginRoutes(router);
UserRoutes(router);
AppUserRoutes(router);
SimulationRoutes(router);

module.exports = router;
