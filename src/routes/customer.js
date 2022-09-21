const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customerController');

//--
router.get('/', customerController.list);


//----------------------------Colegio Luis Horacio Gomez------------------------------

router.get('/nocheartistica', customerController.homeLuis);

router.post('/addCole', customerController.saveCol);

//register email
router.get('/sendmail83258284-12', customerController.sendMail);

//saving in database
router.post('/addClientes', customerController.saveClient);

router.get('/response', customerController.responseCol);
router.get('/confirmation', customerController.confirmationCol);

//comprobacion
router.get('/authorization', customerController.authorization);

//ruta direccionamiento a stream
router.post('/access', customerController.accessEvent);

//mostrar usuarios registrados al evento
router.get('/dbuser-event-asofamilia-lhg', customerController.mostrarDBAsofamilia);

//reenvio de info mail
router.get('/repeatMaildfg654sfdg456sfg465sdfg45s6fg5ffg456sf54gs', customerController.repeatMail);
router.post('/reenviOk', customerController.reenvioSend);

module.exports = router;