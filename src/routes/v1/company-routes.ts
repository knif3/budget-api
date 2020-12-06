import express from 'express';
import { CompanyController } from '../../controllers/company-controller';
import { createValidator } from 'express-joi-validation';
import { validateToken } from '../../services/core/validate-token-service';
import { companySchema } from '../../schemas/company-schema';

const validator = createValidator();

export const companyRouter = express.Router()
  // .post('/login', UserController.login)
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, CompanyController.getAll)
  .get('/:companyId', validateToken, CompanyController.getSingle)
  .post('/', validator.body(companySchema), CompanyController.create)
  .patch('/:companyId', validator.body(companySchema), validateToken, CompanyController.update)
  .delete('/:companyId', validateToken, CompanyController.delete);
