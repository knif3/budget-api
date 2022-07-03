import express from 'express';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { BudgetController } from '../../controllers/budget-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { budgetSchema } from '../../schemas/budget-schema';

const validator = createValidator();

export const budgetRouter = express.Router()
  // .post('/login', UserController.login)
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, BudgetController.getAll)
  .get('/:budgetId', validateToken, BudgetController.getSingle)
  .post('/', validator.body(budgetSchema), validateToken, BudgetController.create)
  .patch('/:budgetId', validator.body(budgetSchema), validateToken, BudgetController.update)
  .delete('/:budgetId', validateToken, BudgetController.delete);
