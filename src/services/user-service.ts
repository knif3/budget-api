import { injectable } from 'tsyringe';
import { UserDataAccess } from '../data-access';
import { User } from '../interfaces/user';
import { ConflictError } from '../errors/conflict-error';

@injectable()
export class UserService {
  constructor(private userDataAccess: UserDataAccess) {}

  public getAll = async (): Promise<User[]> => this.userDataAccess.getAll();

  public getSingle = async (userId: string): Promise<User> =>
    this.userDataAccess.getSingle(userId);

  public getSingleByLogin = async (login: string): Promise<User> =>
    this.userDataAccess.findByLogin(login);

  public createNew = async (data: Omit<User, 'id'>): Promise<User> => {
    const user = await this.userDataAccess.findByLogin(data.login);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return this.userDataAccess.create(data);
  };

  public update = async (uuid: string, data: Partial<User>): Promise<User> =>
    this.userDataAccess.update(uuid, data);

  public softDeleteUser = async (uuid: string): Promise<User> =>
    this.userDataAccess.update(uuid, {
      isDeleted: true,
    });

  public autoSuggest = async (uuid: string, limit: number): Promise<User[]> =>
    this.userDataAccess.autoSuggest(uuid, limit);
}

// const userService = new UserService();
// Object.freeze(userService);
//
// export { userService as UserService };
