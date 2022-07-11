import { Request, Response } from 'express';
import { singleton } from 'tsyringe';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';
import TrafficService from '../services/traffic-service';

@singleton()
export default class TrafficController {
  constructor(private trafficService: TrafficService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await this.trafficService.getAll());
    } catch ({ message }) {
      res.status(500).json({
        error: message,
      });
    }
  };

  public getSingle = async (
    { params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = await this.trafficService.getSingle(params.trafficId);
      if (!user) {
        res.status(404).json({
          error: 'Resource not found!',
        });
        return;
      }

      res.json(user);
    } catch ({ message }) {
      logger.error(`${message} ${params.trafficId}`);
      res.status(500).json({
        error: message,
      });
    }
  };

  public create = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      const user = await this.trafficService.createNew(body);
      res.json(user);
    } catch (err: any) {
      if (err instanceof ConflictError) {
        res.status(409);
      } else {
        res.status(500);
      }

      res.json({
        error: err.message,
      });
    }
  };

  public update = async (
    { params, body }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = await this.trafficService.update(params.trafficId, body);
      logger.info('Resource updated');
      res.json(user);
    } catch (err: any) {
      res.status(err instanceof NotFoundError ? 404 : 500);

      logger.error(`Failed to update resource: ${err.message}`);
      res.status(500).json({
        message: `Failed to update resource! Error: ${err.message}`,
      });
    }
  };

  public delete = async ({ params }: Request, res: Response): Promise<void> => {
    try {
      await this.trafficService.delete(params.trafficId);

      logger.info(`Resource has been deleted: ${params.trafficId}`);
      res.status(204).send();
    } catch (err: any) {
      res.status(err instanceof NotFoundError ? 404 : 500);

      logger.error(`Failed to delete resource: ${err.message}`);
      res.json({
        error: err.message,
      });
    }
  };
}
