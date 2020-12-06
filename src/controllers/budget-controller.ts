import {
  Request,
  Response
} from 'express';
import { BudgetService } from '../services/budget-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';

export class BudgetController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await BudgetService.getAll());
    } catch ({message}) {
      res.status(500).json({
        error: message
      });
    }
  };

  static getSingle = async ({params}: Request, res: Response): Promise<void> => {
    try {
      const budget = await BudgetService.getSingle(params.budgetId);
      if (!budget) {
        res.status(404).json({
          error: 'Resource not found!'
        });
        return;
      }

      res.json(budget);
    } catch ({message}) {
      logger.error(`${message} ${params.budgetId}`);
      res.status(500).json({
        error: message
      });
    }
  };

  static create = async ({body}: Request, res: Response): Promise<void> => {
    try {
      const budget = await BudgetService.create(body);
      res.json(budget);
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
      const budget = await BudgetService.update(params.budgetId, body);
      logger.info('Resource updated');
      res.json(budget);
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
      await BudgetService.delete(params.budgetId);

      logger.info(`Resource has been deleted: ${params.budgetId}`);
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
