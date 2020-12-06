import {
  Request,
  Response
} from 'express';
import { TrafficService } from '../services/traffic-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';

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

  static delete = async ({params}: Request, res: Response): Promise<void> => {
    try {
      await TrafficService.delete(params.trafficId);

      logger.info(`Resource has been deleted: ${params.trafficId}`);
      res.status(204).send();
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404);
      } else {
        res.status(500);
      }

      logger.error(`Failed to delete resource: ${err.message}`);
      res.json({
        error: err.message
      });
    }
  };
}
