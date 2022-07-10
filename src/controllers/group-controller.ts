import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { logger } from '../services/core/winston-logger-service';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/notfound-error';
import { GroupService } from '../services/group-service';

@injectable()
export class GroupController {
  constructor(private groupService: GroupService) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json(await this.groupService.getAll());
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
      const group = await this.groupService.getSingle(params.groupId);
      if (!group) {
        res.status(404).json({
          error: 'Group not found!',
        });
        return;
      }

      res.json(group);
    } catch ({ message }) {
      logger.error(`${message} ${params.groupId}`);
      res.status(500).json({
        error: message,
      });
    }
  };

  public create = async ({ body }: Request, res: Response): Promise<void> => {
    try {
      const group = await this.groupService.createNew(body);
      res.json(group);
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
      const group = await this.groupService.update(params.groupId, body);
      logger.info('Group updated');
      res.json(group);
    } catch (err: any) {
      res.status(err instanceof NotFoundError ? 404 : 500);

      logger.error(`Failed to update group: ${err.message}`);
      res.status(500).json({
        message: `Failed to update group! Error: ${err.message}`,
      });
    }
  };

  public softDelete = async (
    { params }: Request,
    res: Response
  ): Promise<void> => {
    try {
      const group = await this.groupService.softDeleteGroup(params.groupId);

      logger.info(`Group has been soft-deleted: ${group}`);
      res.status(200).json(group);
    } catch (err: any) {
      res.status(err instanceof NotFoundError ? 404 : 500);

      logger.error(`Failed to soft-delete group: ${err.message}`);
      res.json({
        error: err.message,
      });
    }
  };
}
