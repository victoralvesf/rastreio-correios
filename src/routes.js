const { Router } = require('express');

const TrackingController = require('./app/controllers/TrackingController');
const trackingMiddleware = require('./app/middlewares/TrackingMiddleware');

const routes = new Router();

routes.use(trackingMiddleware);
routes.get('/tracking', TrackingController.index);

module.exports = routes;