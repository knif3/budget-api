import { UserDataAccess } from '../data-access';
import { User } from '../interfaces/user';
import { ConflictError } from '../errors/conflict-error';
import { logger } from './winston-logger-service';

class UserService {
    getAll = async (): Promise<User[]> => {
        return UserDataAccess.getAll();
    }

    getSingle = async (userId: string): Promise<User | null> => {
        return UserDataAccess.getSingle(userId);
    }

    getSingleByLogin = async (login: string): Promise<User | null> => {
        return UserDataAccess.findByLogin(login);
    }

    createNew = async (data: Omit<User, 'id'>): Promise<User> => {
        const user = await UserDataAccess.findByLogin(data.login);
        if (user) {
            throw new ConflictError('User already exists!');
        }

        return UserDataAccess.create(data);
    }

    update = async (uuid: string, data: Partial<User>): Promise<User> => {
        return UserDataAccess.update(uuid, data);
    }

    softDeleteUser = async (uuid: string): Promise<User> => {
        return UserDataAccess.update(uuid, {
            isDeleted: true
        });
    }

    autoSuggest = async (uuid: string, limit: number): Promise<User[]> => {
        return UserDataAccess.autoSuggest(uuid, limit);
    }
}

const userService = new UserService();
Object.freeze(userService);

export { userService as UserService };
