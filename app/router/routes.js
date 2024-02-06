'use strict'

const routes = require('express').Router();
const {createGuide} = require('../controllers/create')
const {getGuides} = require('../controllers/getGuides')


routes

    .get('/generar-guia', createGuide)

    .get('/guides', getGuides)


module.exports = routes