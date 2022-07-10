import { injectable } from 'tsyringe';
import { GroupDataAccess } from '../data-access';
import { Group } from '../interfaces/group';
import { ConflictError } from '../errors/conflict-error';

@injectable()
export class GroupService {
  constructor(private groupDataAccess: GroupDataAccess) {}

  getAll = async (): Promise<Group[]> => this.groupDataAccess.getAll();

  getSingle = async (groupId: string): Promise<Group | null> =>
    this.groupDataAccess.getSingle(groupId);

  getSingleByLogin = async (name: string): Promise<Group | null> =>
    this.groupDataAccess.findByLogin(name);

  createNew = async (data: Omit<Group, 'id'>): Promise<Group> => {
    const group = await this.groupDataAccess.findByLogin(data.name);
    if (group) {
      throw new ConflictError('Resource already exists!');
    }

    return this.groupDataAccess.create(data);
  };

  update = async (uuid: string, data: Partial<Group>): Promise<Group> =>
    this.groupDataAccess.update(uuid, data);

  softDeleteGroup = async (uuid: string): Promise<Group> =>
    this.groupDataAccess.update(uuid, {
      isDeleted: true,
    });
}
