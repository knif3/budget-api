import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { BudgetService } from '../services/budget-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';

@injectable()
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await this.budgetService.getAll());
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
      const budget = await this.budgetService.getSingle(params.budgetId);
      if (!budget) {
        res.status(404).json({
          error: 'Resource not found!',
        });
        return;
      }

      res.json(budget);
    } catch ({ message }) {
      logger.error(`${message} ${params.budgetId}`);
      res.status(500).json({
        error: message,
      });
    }
  };

  public create = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      const budget = await this.budgetService.create(body);
      res.json(budget);
    } catch (err: any) {
      res.status(err instanceof ConflictError ? 409 : 500);

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
      const budget = await this.budgetService.update(params.budgetId, body);
      logger.info('Resource updated');
      res.json(budget);
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
      await this.budgetService.delete(params.budgetId);

      logger.info(`Resource has been deleted: ${params.budgetId}`);
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
