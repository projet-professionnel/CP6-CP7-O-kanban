const express = require('express');
const router = express.Router();
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const labelController = require('./controllers/labelController');

router.get('/lists', listController.getAll);
router.get('/lists/:id', listController.getOneById);
router.post('/lists', listController.create);
router.patch('/lists/:id', listController.update);
router.put('/lists/:id', listController.updatePut);
router.delete('/lists/:id', listController.delete);

router.get('/lists/:id/cards', cardController.getAllForList);
router.get('/cards/:id', cardController.getOneById);
router.post('/cards', cardController.create);
router.patch('/cards/:id', cardController.update);
router.put('/cards/:id', cardController.update);
router.delete('/cards/:id', cardController.delete);

router.get('/labels', labelController.getAll);
router.get('/labels/:id', labelController.getOneById);
router.post('/labels', labelController.create);
router.patch('/labels/:id', labelController.update);
router.put('/labels/:id', labelController.updatePut);
router.delete('/labels/:id', labelController.delete);

router.post('/cards/:cardId/label/:labelId', cardController.associateLabel);
router.delete('/cards/:cardId/label/:labelId', cardController.dissociateLabel);


module.exports = router;