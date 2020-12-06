import {
  Request,
  Response
} from 'express';
import { TrafficService } from '../services/traffic-service';
// import { UserAutoSuggestsService } from '../services/user-auto-suggests-service';
// import { UserGenerateFakeDataService } from '../services/user-generate-fake-data-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';
import { loginSchema } from '../schemas/login-schema';
import { authenticate } from '../services/core/authenticate-service';

export class TrafficController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await TrafficService.getAll());
    } catch ({message}) {
      res.status(500).json({
        error: message
      });
    }
  };

  static getSingle = async ({params}: Request, res: Response): Promise<void> => {
    try {
      const user = await TrafficService.getSingle(params.trafficId);
      if (!user) {
        res.status(404).json({
          error: 'Resource not found!'
        });
        return;
      }

      res.json(user);
    } catch ({message}) {
      logger.error(`${message} ${params.trafficId}`);
      res.status(500).json({
        error: message
      });
    }
  };

  static create = async ({body}: Request, res: Response): Promise<void> => {
    try {
      const user = await TrafficService.createNew(body);
      res.json(user);
    } catch (err) {
      if (err instanceof ConflictError) {
        res.status(409);
      } else {
        res.status(500);
      }

      res.json({
        error: err.message
      });
    }
  };

  static update = async ({params, body}: Request, res: Response): Promise<void> => {
    try {
      const user = await TrafficService.update(params.trafficId, body);
      logger.info('Resource updated');
      res.json(user);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404);
      } else {
        res.status(500);
      }

      logger.error(`Failed to update resource: ${err.message}`);
      res.status(500).json({
        message: `Failed to update resource! Error: ${err.message}`
      });
    }
  };

  // static softDelete = async ({ params }: Request, res: Response): Promise<void> => {
  //     try {
  //         const user = await TrafficService.softDeleteUser(params.trafficId);
  //
  //         logger.info(`Item has been soft-deleted: ${user}`);
  //         res.status(200).json(user);
  //     } catch (err) {
  //         if (err instanceof NotFoundError) {
  //             res.status(404);
  //         } else {
  //             res.status(500);
  //         }
  //
  //         logger.error(`Failed to soft-delete item: ${err.message}`);
  //         res.json({
  //             error: err.message
  //         });
  //     }
  // };
}
