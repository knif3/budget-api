import { User } from '../../interfaces/user';
import { v4 as uuid_v4 } from 'uuid';
import { Op } from 'sequelize';
import { TrafficModel, UserModel } from './models';
import { hash } from '../../services/core/authenticate-service';
import { NotFoundError } from '../../errors/notfound-error';

class UserDataAccess {
  getAll = async (): Promise<User[]> => {
    const userModels = await UserModel.findAll({
      // include: [
      //   {
      //     model: TrafficModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertUserModelsToUser(userModels);
  };

  getSingle = async (userId: string): Promise<User | null> => {
    const userModel = await UserModel.findByPk(userId, {
      // include: [
      //   {
      //     model: TrafficModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return userModel ? convertUserModelToUser(userModel) : null;
  };

  findByLogin = async (login: string): Promise<User | null> => {
    const userModel = await UserModel.findOne({
      where: {login}
    });

    return userModel ? convertUserModelToUser(userModel) : null;
  };

  create = async (data: Partial<User>): Promise<User> => {
    const userModel = await UserModel.create({
      ...data,
      id: uuid_v4(),
      password: hash(data.password || ''),
      isDeleted: false,
    });

    return convertUserModelToUser(userModel);
  };

  update = async (uuid: string, data: Partial<User>): Promise<User> => {
    const user = await UserModel.findByPk(uuid);
    if (!user) {
      throw new NotFoundError('Resource not found!');
    }

    await user.update({
      ...data,
      password: hash(data.password || '')
    });

    return convertUserModelToUser(user);
  };

  autoSuggest = async (loginSubstring: string, limit: number): Promise<User[]> => {
    const userModels = await UserModel.findAll({
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`
        }
      },
      order: [
        ['login', 'ASC']
      ],
      limit,
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertUserModelsToUser(userModels);
  };
}

const convertUserModelToUser = (userModel: UserModel): User => {
  return (userModel as unknown) as User;
}

const convertUserModelsToUser = (userModels: UserModel[]): User[] => {
  return userModels.map(convertUserModelToUser);
}

const userDataAccess = new UserDataAccess();
Object.freeze(userDataAccess);

export { userDataAccess as UserDataAccess };
