import { container } from 'tsyringe';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import { UserController } from '../../controllers/user-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { userSchema } from '../../schemas/user-schema';

const userController = container.resolve(UserController);
const validator = createValidator();

export const userRouter = express
  .Router()
  .post('/login', (req, res) => userController.login(req, res))
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, (req, res) => userController.getAll(req, res))
  .get('/:userId', validateToken, (req, res) =>
    userController.getSingle(req, res)
  )
  .post('/', validator.body(userSchema), (req, res) =>
    userController.create(req, res)
  )
  .patch('/:userId', validator.body(userSchema), validateToken, (req, res) =>
    userController.update(req, res)
  )
  .delete('/:userId', validateToken, (req, res) =>
    userController.softDelete(req, res)
  )
  .get('/getAutoSuggestUsers/:keyword/:limit?', validateToken, (req, res) =>
    userController.getAutoSuggestUsers(req, res)
  );
