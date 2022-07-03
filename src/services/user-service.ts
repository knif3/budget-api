import { UserDataAccess } from '../data-access';
import { User } from '../interfaces/user';
import { ConflictError } from '../errors/conflict-error';
import { logger } from './core/winston-logger-service';

class UserService {
    getAll = async (): Promise<User[]> => UserDataAccess.getAll()

    getSingle = async (userId: string): Promise<User | null> => UserDataAccess.getSingle(userId)

    getSingleByLogin = async (login: string): Promise<User | null> => UserDataAccess.findByLogin(login)

    createNew = async (data: Omit<User, 'id'>): Promise<User> => {
      const user = await UserDataAccess.findByLogin(data.login);
      if (user) {
        throw new ConflictError('Resource already exists!');
      }

      return UserDataAccess.create(data);
    }

    update = async (uuid: string, data: Partial<User>): Promise<User> => UserDataAccess.update(uuid, data)

    softDeleteUser = async (uuid: string): Promise<User> => UserDataAccess.update(uuid, {
      isDeleted: true,
    })

    autoSuggest = async (uuid: string, limit: number): Promise<User[]> => UserDataAccess.autoSuggest(uuid, limit)
}

const userService = new UserService();
Object.freeze(userService);

export { userService as UserService };
