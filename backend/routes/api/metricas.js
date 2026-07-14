const express = require('express');
const Joi = require('joi');

const pool = require('../../config/database');
const FrequenciaModel = require('../../models/Frequencia');
const TurmaModel = require('../../models/Turma');
const MetricasFrequenciaService = require('../../services/MetricasFrequenciaService');

const frequenciaModel = new FrequenciaModel(pool);
const turmaModel = new TurmaModel(pool);

const metricasService = new MetricasFrequenciaService(frequenciaModel, turmaModel);

const router = express.Router();

// Express 5 expõe req.query como getter sem setter — não dá para reatribuir
// req.query = value depois de validar/converter com Joi. O valor validado
// (com datas já convertidas para Date) fica em req.validatedQuery.
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ erro: error.details[0].message });
    }
    req.validatedQuery = value;
    next();
  };
}

// GET /api/metricas/faltas?idTurma=X&idAluno=Y&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
router.get(
  '/faltas',
  validateQuery(
    Joi.object({
      idTurma: Joi.number().integer().required(),
      idAluno: Joi.number().integer().required(),
      dataInicio: Joi.date().iso().optional(),
      dataFim: Joi.date().iso().optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idTurma, idAluno, dataInicio, dataFim } = req.validatedQuery;
      const metrica = await metricasService.getFaltasPorAluno(
        idTurma,
        idAluno,
        dataInicio ? dataInicio.toISOString().slice(0, 10) : undefined,
        dataFim ? dataFim.toISOString().slice(0, 10) : undefined
      );
      res.json(metrica);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/metricas/atraso-lancamento/turma?idTurma=X
router.get(
  '/atraso-lancamento/turma',
  validateQuery(
    Joi.object({
      idTurma: Joi.number().integer().required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idTurma } = req.validatedQuery;
      const metrica = await metricasService.getAtrasoLancamentoPorTurma(idTurma);
      res.json(metrica);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/metricas/atraso-lancamento/turmas-atrasadas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S
router.get(
  '/atraso-lancamento/turmas-atrasadas',
  validateQuery(
    Joi.object({
      idProjeto: Joi.number().integer().required(),
      idProjetoAditivo: Joi.number().integer().required(),
      idMeta: Joi.number().integer().optional(),
      idInstrutor: Joi.number().integer().optional(),
      // situação da turma: 0 não especificado / 1 não iniciada / 2 iniciada / 3 concluída / 4 cancelada
      status: Joi.number().integer().min(0).max(4).optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idProjeto, idProjetoAditivo, idMeta, idInstrutor, status } = req.validatedQuery;
      const metrica = await metricasService.getTurmasAtrasadas(idProjeto, idProjetoAditivo, {
        idMeta,
        idInstrutor,
        status,
      });
      res.json(metrica);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X
router.get(
  '/atraso-lancamento/instrutor',
  validateQuery(
    Joi.object({
      idInstrutor: Joi.number().integer().required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idInstrutor } = req.validatedQuery;
      const metrica = await metricasService.getAtrasoLancamentoPorInstrutor(idInstrutor);
      res.json(metrica);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/metricas/faltas-recentes?idTurma=X
router.get(
  '/faltas-recentes',
  validateQuery(
    Joi.object({
      idTurma: Joi.number().integer().required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idTurma } = req.validatedQuery;
      const metrica = await metricasService.getFaltasRecentesPorTurma(idTurma);
      res.json(metrica);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
