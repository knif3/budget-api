import express from 'express';
import { TrafficController } from '../controllers/traffic-controller';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { validateToken } from '../services/core/validate-token-service';
import { trafficSchema } from '../schemas/traffic-schema';

const validator = createValidator();

export const trafficRouter = express.Router()
    // .post('/login', UserController.login)
    // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
    .get('/getAll', validateToken, TrafficController.getAll)
    .get('/:trafficId', validateToken, TrafficController.getSingle)
    .post('/', validator.body(trafficSchema), TrafficController.create)
    .patch('/:trafficId', validator.body(trafficSchema), validateToken, TrafficController.update);
    // .delete('/:userId', validateToken, TrafficController.softDelete);
    // .get('/getAutoSuggestUsers/:keyword/:limit?', validateToken, TrafficController.getAutoSuggestUsers);
