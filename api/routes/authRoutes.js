const express = require('express');
const {registro, login } = require('../controllers/authController');
const {validarRegistro } = require('../middleware/userValidation')

const router = express.Router();

router.post('/registro', validarRegistro, registro);
router.post('/login', login);

module.exports =  router