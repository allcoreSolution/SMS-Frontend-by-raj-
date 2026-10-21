const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');

router.get('/dashboard-analytics', superAdminController.getDashboardAnalytics);

router.get('/team', superAdminController.getTeamMembers);
router.post('/team', superAdminController.addTeamMember);
router.put('/team/:id', superAdminController.updateTeamMember);
router.delete('/team/:id', superAdminController.deleteTeamMember);

router.get('/comms/rate-cards', superAdminController.getRateCards);
router.put('/comms/rate-cards', superAdminController.updateRateCards);

router.get('/website/templates', superAdminController.getWebsiteTemplates);

module.exports = router;
