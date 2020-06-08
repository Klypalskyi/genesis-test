const app = require('express')();
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

if (process.env.NODE_ENV.toString() !== "production") {
	const options = {
		swaggerDefinition: {
			info: {
				title: 'Genesis test task API',
				version: '0.0.1',
				description: 'Food Delivery BE'
			},
			basePath: '/v1',
			security: [],
			tags: [
				{
					name: "Restaurants",
					description: "Operations with restaurants"
				},
				{
					name: "Clients",
					description: "Operations with clients"
				},
				{
					name: "Orders",
					description: "Operations with orders"
				},
				{
					name: "Scouts",
					description: "Operations with scouts"
				},
			]
		},
		// List of files to be processes. You can also set globs './routes/*.js'
		apis: ['./app/definitions/*.js', './app/router/*.js']
	};

	const specs = swaggerJsdoc(options);

	app.use('/v1/swagger', swaggerUi.serve, swaggerUi.setup(specs));
}

const router = require('./router');

const httpServer = http.createServer(app);

const startServer = port => {
  app
    .use(morgan(':date[clf] -- :method -- :url -- :status -- :response-time ms'))
		.use(bodyParser.json({
			limit: '50mb'
    }))
		.use('/v1/restaurants', router.restRouter)
		.use('/v1/scouts', router.scoutsRouter)
		.use('/v1/clients', router.clientRouter)
		.use('/v1/orders', router.orderRouter)
		.use((err, req, res, next) => {
			if (err instanceof multer.MulterError || err.name === 'ValidationError') {
				err.status = 400;
			}

			res.status(err.status || 500);
			res.json({
				status: err.status,
				message: err.message
			});
		})

  httpServer.listen(port, () => {
		console.log('Server is on ' + port);
	});
}

module.exports = startServer;