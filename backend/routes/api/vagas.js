const express = require('express');
const Joi = require('joi');

const VagasService = require('../../services/VagasService');

const vagasService = new VagasService();

const router = express.Router();

// GET /api/vagas
router.get('/', async (req, res, next) => {
  try {
    const vagas = await vagasService.getAll();
    res.json(vagas);
  } catch (err) {
    next(err);
  }
});

// PUT /api/vagas/:idTurma
router.put(
  '/:idTurma',
  async (req, res, next) => {
    const paramsSchema = Joi.object({
      idTurma: Joi.number().integer().required(),
    });
    const bodySchema = Joi.object({
      vagas: Joi.number().integer().min(0).max(25).required(),
    });

    const { error: paramsError, value: paramsValue } = paramsSchema.validate(req.params);
    if (paramsError) {
      return res.status(400).json({ erro: paramsError.details[0].message });
    }
    const { error: bodyError, value: bodyValue } = bodySchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({ erro: bodyError.details[0].message });
    }

    try {
      const resultado = await vagasService.setVagas(paramsValue.idTurma, bodyValue.vagas);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
