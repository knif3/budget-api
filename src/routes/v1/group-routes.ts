import express from 'express';
import { createValidator } from 'express-joi-validation';
import { container } from 'tsyringe';
import { GroupController } from '../../controllers/group-controller';
import { validateToken } from '../../services/core/validate-token-service';
import { groupSchema } from '../../schemas/group-schema';

const groupController = container.resolve(GroupController);
const validator = createValidator();

export const groupRouter = express
  .Router()
  .get('/getAll', validateToken, (req, res) => groupController.getAll(req, res))
  .get('/:groupId', validateToken, (req, res) =>
    groupController.getSingle(req, res)
  )
  .post('/', validator.body(groupSchema), (req, res) =>
    groupController.create(req, res)
  )
  .patch('/:groupId', validator.body(groupSchema), validateToken, (req, res) =>
    groupController.update(req, res)
  )
  .delete('/:groupId', validateToken, (req, res) =>
    groupController.softDelete(req, res)
  );
