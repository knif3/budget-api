import { Request, Response } from 'express';
import { singleton } from 'tsyringe';
import { CompanyService } from '../services/company-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';

@singleton()
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await this.companyService.getAll());
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
      const user = await this.companyService.getSingle(params.companyId);
      if (!user) {
        res.status(404).json({
          error: 'Resource not found!',
        });
        return;
      }

      res.json(user);
    } catch ({ message }) {
      logger.error(`${message} ${params.companyId}`);
      res.status(500).json({
        error: message,
      });
    }
  };

  public create = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      const user = await this.companyService.create(body);
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
      const user = await this.companyService.update(params.companyId, body);
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
      await this.companyService.delete(params.companyId);

      logger.info(`Resource has been deleted: ${params.companyId}`);
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
