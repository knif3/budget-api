import express from 'express';
import { createValidator } from 'express-joi-validation';
import { UserController } from '../../controllers/user-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { userSchema } from '../../schemas/user-schema';

const validator = createValidator();

export const userRouter = express.Router()
  .post('/login', UserController.login)
// .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, UserController.getAll)
  .get('/:userId', validateToken, UserController.getSingle)
  .post('/', validator.body(userSchema), UserController.create)
  .patch('/:userId', validator.body(userSchema), validateToken, UserController.update)
  .delete('/:userId', validateToken, UserController.softDelete)
  .get('/getAutoSuggestUsers/:keyword/:limit?', validateToken, UserController.getAutoSuggestUsers);
