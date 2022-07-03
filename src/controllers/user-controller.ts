import {
  Request,
  Response,
} from 'express';
import { UserService } from '../services/user-service';
import { UserAutoSuggestsService } from '../services/user-auto-suggests-service';
// import { UserGenerateFakeDataService } from '../services/user-generate-fake-data-service';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';
import { loginSchema } from '../schemas/login-schema';
import { authenticate } from '../services/core/authenticate-service';

export class UserController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await UserService.getAll());
    } catch ({ message }) {
      res.status(500).json({
        error: message,
      });
    }
  };

  static getSingle = async ({ params }: Request, res: Response): Promise<void> => {
    try {
      const user = await UserService.getSingle(params.userId);
      if (!user) {
        res.status(404).json({
          error: 'User not found!',
        });
        return;
      }

      res.json(user);
    } catch ({ message }) {
      logger.error(`${message} ${params.userId}`);
      res.status(500).json({
        error: message,
      });
    }
  };

  static create = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      const user = await UserService.createNew(body);
      res.json(user);
    } catch (err) {
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

  static update = async ({ params, body }: Request, res: Response): Promise<void> => {
    try {
      const user = await UserService.update(params.userId, body);
      logger.info('User updated');
      res.json(user);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404);
      } else {
        res.status(500);
      }

      logger.error(`Failed to update user: ${err.message}`);
      res.status(500).json({
        message: `Failed to update user! Error: ${err.message}`,
      });
    }
  };

  static softDelete = async ({ params }: Request, res: Response): Promise<void> => {
    try {
      const user = await UserService.softDeleteUser(params.userId);

      logger.info(`User has been soft-deleted: ${user}`);
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404);
      } else {
        res.status(500);
      }

      logger.error(`Failed to soft-delete user: ${err.message}`);
      res.json({
        error: err.message,
      });
    }
  };

  // static generateFakeUsers = async (req: Request, res: Response): Promise<void> => {
  //     await UserGenerateFakeDataService(100);
  //     logger.info('Generated fake users.');
  //     res.status(204).send();
  // };

  static getAutoSuggestUsers = async (req: Request, res: Response): Promise<void> => {
    const { keyword, limit = '10' } = req.params;
    const results = await UserAutoSuggestsService(keyword, parseInt(limit, 10));
    res.json(results);
  };

  static login = async ({ body }: Request, res: Response): Promise<void> => {
    const loginData = {
      login: body.login,
      password: body.password,
    };

    const { error } = await loginSchema.validate(loginData);
    if (error) {
      logger.error(`Error while validation the login data: ${error}`);
      res.status(400).json({
        error,
      });
      return;
    }

    try {
      const { userModel, token } = await authenticate({
        login: loginData.login,
        password: loginData.password,
      });

      logger.info(`Token generated for user: ${userModel.login}; ${token}`);

      res.status(200).json({
        token,
      });
    } catch ({ message }) {
      res.status(500).json({
        error: message,
      });
    }
  };
}
