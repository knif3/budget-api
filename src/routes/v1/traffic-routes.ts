import express from 'express';
import { createValidator } from 'express-joi-validation';
import { container } from 'tsyringe';
import { TrafficController } from '../../controllers/traffic-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { trafficSchema } from '../../schemas/traffic-schema';

const trafficController = container.resolve(TrafficController);
const validator = createValidator();

export const trafficRouter = express
  .Router()
  // .post('/login', UserController.login)
  // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
  .get('/getAll', validateToken, (req, res) =>
    trafficController.getAll(req, res)
  )
  .get('/:trafficId', validateToken, (req, res) =>
    trafficController.getSingle(req, res)
  )
  .post('/', validator.body(trafficSchema), (req, res) =>
    trafficController.create(req, res)
  )
  .patch(
    '/:trafficId',
    validator.body(trafficSchema),
    validateToken,
    (req, res) => trafficController.update(req, res)
  )
  .delete('/:trafficId', validateToken, (req, res) =>
    trafficController.delete(req, res)
  );
// .get('/getAutoSuggestUsers/:keyword/:limit?', validateToken, (req, res) => trafficController.getAutoSuggestUsers(req, res));
