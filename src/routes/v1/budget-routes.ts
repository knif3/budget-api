import express from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { container } from 'tsyringe';
import { BudgetController } from '../../controllers/budget-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { budgetSchema } from '../../schemas/budget-schema';

const budgetController = container.resolve(BudgetController);
const validator = createValidator();

export const budgetRouter = express
  .Router()
  // .post('/login', UserController.login)
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, (req, res) =>
    budgetController.getAll(req, res)
  )
  .get('/:budgetId', validateToken, (req, res) =>
    budgetController.getSingle(req, res)
  )
  .post('/', validator.body(budgetSchema), validateToken, (req, res) =>
    budgetController.create(req, res)
  )
  .patch(
    '/:budgetId',
    validator.body(budgetSchema),
    validateToken,
    (req, res) => budgetController.update(req, res)
  )
  .delete('/:budgetId', validateToken, (req, res) =>
    budgetController.delete(req, res)
  );
