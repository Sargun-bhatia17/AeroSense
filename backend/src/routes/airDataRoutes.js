const { Router } = require('express');
const { getAirData } = require('../controllers/airDataController');

const router = Router();

// GET /api/air-data?lat={lat}&lon={lon}&userType={optional}
router.get('/air-data', getAirData);

module.exports = router;
