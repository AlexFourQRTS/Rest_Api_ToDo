const express = require('express');
const { getAllConsoles } = require('../config/consoles');
const ErrorMiddleware = require('../middleware/error');
const RequestLogger = require('../middleware/requestLogger');

const router = express.Router();

router.get('/consoles',
  RequestLogger.rateLimiter(100, 15 * 60 * 1000),
  ErrorMiddleware.asyncHandler(async (req, res) => {
    const consoles = getAllConsoles();
    res.json({
      success: true,
      data: consoles,
      meta: { total: consoles.length }
    });
  })
);

module.exports = router;
