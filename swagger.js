const swaggerUI = require('swagger-ui-express');
const router = require('express').Router();
const swaggerDocument = require('./interfaces/swagger.json');

router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
module.exports = router;
