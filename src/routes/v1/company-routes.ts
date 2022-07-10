import express from 'express';
import { createValidator } from 'express-joi-validation';
import { container } from 'tsyringe';
import { CompanyController } from '../../controllers/company-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { companySchema } from '../../schemas/company-schema';

const companyController = container.resolve(CompanyController);
const validator = createValidator();

export const companyRouter = express
  .Router()
  // .post('/login', UserController.login)
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, (req, res) =>
    companyController.getAll(req, res)
  )
  .get('/:companyId', validateToken, (req, res) =>
    companyController.getSingle(req, res)
  )
  .post('/', validator.body(companySchema), (req, res) =>
    companyController.create(req, res)
  )
  .patch(
    '/:companyId',
    validator.body(companySchema),
    validateToken,
    (req, res) => companyController.update(req, res)
  )
  .delete('/:companyId', validateToken, (req, res) =>
    companyController.delete(req, res)
  );
