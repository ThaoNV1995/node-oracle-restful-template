const express = require('express');
const router = express.Router();
const security = require('./security.js');
const logins = require('../controllers/login.js');
const employees = require('../controllers/employees.js');
const users = require('../controllers/users.js');
const sessions = require('../controllers/sessions.js');


router.route('/employees/get')
    .get(security.authenticate('ADMIN'), employees.get);
router.route('/employees')
    .post(employees.post);
router.route('/employees')
    .put(employees.put);
router.route('/employees')
    .delete(employees.delete);

router.route('/logins')
    .post(logins.post);

router.route('/users')
    .post(users.post);

module.exports = router;