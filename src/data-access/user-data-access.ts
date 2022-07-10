import { injectable } from 'tsyringe';
import { v4 as uuidGen } from 'uuid';
import { Op } from 'sequelize';
import { User } from '../interfaces/user';
import { UserModel } from './models';
import { hash } from '../services/core/authenticate-service';
import { NotFoundError } from '../errors/notfound-error';

const convertUserModelToUser = (userModel: UserModel): User =>
  userModel as unknown as User;

const convertUserModelsToUser = (userModels: UserModel[]): User[] =>
  userModels.map(convertUserModelToUser);

@injectable()
export class UserDataAccess {
  constructor() {}

  public getAll = async (): Promise<User[]> => {
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

  public getSingle = async (userId: string): Promise<User> => {
    const userModel = await UserModel.findByPk(userId, {
      // include: [
      //   {
      //     model: TrafficModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    if (!userModel) {
      throw new Error('No user found!');
    }

    return convertUserModelToUser(userModel);
  };

  public findByLogin = async (login: string): Promise<User> => {
    const userModel = await UserModel.findOne({
      where: { login },
    });

    if (!userModel) {
      throw new Error('No user found!');
    }

    return convertUserModelToUser(userModel);
  };

  public create = async (data: Partial<User>): Promise<User> => {
    const userModel = await UserModel.create({
      ...data,
      id: uuidGen(),
      password: hash(data.password || ''),
      isDeleted: false,
    });

    return convertUserModelToUser(userModel);
  };

  public update = async (uuid: string, data: Partial<User>): Promise<User> => {
    const user = await UserModel.findByPk(uuid);
    if (!user) {
      throw new NotFoundError('Resource not found!');
    }

    await user.update({
      ...data,
      password: hash(data.password || ''),
    });

    return convertUserModelToUser(user);
  };

  public autoSuggest = async (
    loginSubstring: string,
    limit: number
  ): Promise<User[]> => {
    const userModels = await UserModel.findAll({
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`,
        },
      },
      order: [['login', 'ASC']],
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

// const userDataAccess = new UserDataAccess();
// Object.freeze(userDataAccess);
//
// export { userDataAccess as UserDataAccess };
