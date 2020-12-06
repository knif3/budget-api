import express from 'express';
import { TrafficController } from '../controllers/traffic-controller';
import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';
import { validateToken } from '../services/validate-token-service';

const validator = createValidator();

const trafficSchema = Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().required(),
});

export const trafficRouter = express.Router()
    // .post('/login', UserController.login)
    // .get('/generateFakeUsers', validateToken, UserController.generateFakeUsers)
    .get('/getAll', validateToken, TrafficController.getAll)
    .get('/:userId', validateToken, TrafficController.getSingle)
    .post('/', validator.body(trafficSchema), TrafficController.create)
    .patch('/:userId', validator.body(trafficSchema), validateToken, TrafficController.update);
    // .delete('/:userId', validateToken, TrafficController.softDelete);
    // .get('/getAutoSuggestUsers/:keyword/:limit?', validateToken, TrafficController.getAutoSuggestUsers);
