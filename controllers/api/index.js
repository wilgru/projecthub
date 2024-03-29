//Import Express Routes
const router = require('express').Router();
const clientRoutes = require('./clientRoutes');
const managerRoutes = require('./managerRoutes');
const projectRoutes = require('./projectRoutes');

//Use Express Routes
router.use('/client', clientRoutes);
router.use('/manager', managerRoutes);
router.use('/project', projectRoutes);

module.exports = router;
