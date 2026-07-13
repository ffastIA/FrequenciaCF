const express = require('express');
const Joi = require('joi');

const pool = require('../../config/database');
const ProjetoModel = require('../../models/Projeto');
const ProjetoAditivoModel = require('../../models/ProjetoAditivo');
const MetaTurmaModel = require('../../models/MetaTurma');
const TurmaModel = require('../../models/Turma');
const InstrutorModel = require('../../models/Instrutor');
const AlunoModel = require('../../models/Aluno');
const FiltroService = require('../../services/FiltroService');

const projetoModel = new ProjetoModel(pool);
const aditivoModel = new ProjetoAditivoModel(pool);
const metaModel = new MetaTurmaModel(pool);
const turmaModel = new TurmaModel(pool);
const instrutorModel = new InstrutorModel(pool);
const alunoModel = new AlunoModel(pool);

const filtroService = new FiltroService(
  projetoModel,
  aditivoModel,
  metaModel,
  turmaModel,
  instrutorModel
);

const router = express.Router();

// Express 5 expõe req.query como getter sem setter — não dá para reatribuir
// req.query = value depois de validar/converter com Joi. O valor validado
// (com números já convertidos) fica em req.validatedQuery.
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

// GET /api/filtros/projetos
router.get('/projetos', async (req, res, next) => {
  try {
    const projetos = await filtroService.getProjetos();
    res.json(projetos);
  } catch (err) {
    next(err);
  }
});

// GET /api/filtros/aditivos?idProjeto=X
router.get(
  '/aditivos',
  validateQuery(
    Joi.object({
      idProjeto: Joi.number().integer().required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idProjeto } = req.validatedQuery;
      const aditivos = await filtroService.getAditivosPorProjeto(idProjeto);
      res.json(aditivos);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/filtros/metas?idProjetoAditivo=X
router.get(
  '/metas',
  validateQuery(
    Joi.object({
      idProjetoAditivo: Joi.number().integer().required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idProjetoAditivo } = req.validatedQuery;
      const metas = await filtroService.getMetasPorAditivo(idProjetoAditivo);
      res.json(metas);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S
router.get(
  '/turmas',
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
      const turmas = await filtroService.getTurmasPorProjetoAditivo(
        idProjeto,
        idProjetoAditivo,
        idMeta,
        idInstrutor,
        status
      );
      res.json(turmas);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/filtros/instrutores?idTurmas=1,2,3
router.get(
  '/instrutores',
  validateQuery(
    Joi.object({
      idTurmas: Joi.string()
        .pattern(/^\d+(,\d+)*$/)
        .required(),
    })
  ),
  async (req, res, next) => {
    try {
      const idTurmas = req.validatedQuery.idTurmas.split(',').map(Number);
      const instrutores = await filtroService.getInstrutoresPorTurmas(idTurmas);
      res.json(instrutores);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/filtros/alunos?idTurma=X&situacao=S
router.get(
  '/alunos',
  validateQuery(
    Joi.object({
      idTurma: Joi.number().integer().required(),
      // situação da matrícula: 0 não especificado / 1 matriculado / 2 concluiu /
      // 3 desistiu / 4 evadido / 5 não aprovado / 6 não iniciou / 7 ativo / 8 transferido
      situacao: Joi.number().integer().min(0).max(8).optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const { idTurma, situacao } = req.validatedQuery;
      const alunos = await alunoModel.getAlunosPorTurma(idTurma, situacao);
      res.json(alunos);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
