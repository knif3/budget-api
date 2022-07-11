import { v4 as uuid_gen } from 'uuid';
import { singleton } from 'tsyringe';
import { Group } from '../interfaces/group';
import { NotFoundError } from '../errors/notfound-error';
import { GroupModel } from './models/group-model';

const GroupModelToGroup = (groupModel: GroupModel): Group =>
  groupModel as unknown as Group;

const convertGroupModelsToGroup = (groupModels: GroupModel[]): Group[] =>
  groupModels.map(GroupModelToGroup);

@singleton()
export class GroupDataAccess {
  constructor() {}

  public getAll = async (): Promise<Group[]> => {
    const groupModels = await GroupModel.findAll<GroupModel>({
      // include: [
      //   {
      //     model: TrafficModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertGroupModelsToGroup(groupModels);
  };

  public getSingle = async (groupId: string): Promise<Group> => {
    const groupModel = await GroupModel.findByPk(groupId, {
      // include: [
      //   {
      //     model: TrafficModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    if (!groupModel) {
      throw new Error('No user found!');
    }

    return GroupModelToGroup(groupModel);
  };

  public findByLogin = async (name: string): Promise<Group> => {
    const groupModel = await GroupModel.findOne({
      where: { name },
    });

    if (!groupModel) {
      throw new Error('No user found!');
    }

    return GroupModelToGroup(groupModel);
  };

  public create = async (data: Partial<Group>): Promise<Group> => {
    const groupModel = await GroupModel.create({
      ...data,
      id: uuid_gen(),
      isDeleted: false,
    });

    return GroupModelToGroup(groupModel);
  };

  public update = async (
    uuid: string,
    data: Partial<Group>
  ): Promise<Group> => {
    const group = await GroupModel.findByPk(uuid);
    if (!group) {
      throw new NotFoundError('Resource not found!');
    }

    await group.update(data);

    return GroupModelToGroup(group);
  };
}
