import { container } from 'tsyringe';
import { UserService } from './user-service';
import { User } from '../interfaces/user';

const userService = container.resolve(UserService);

export const UserAutoSuggestsService = (
  loginSubstring: string,
  limit: number
): Promise<User[]> => userService.autoSuggest(loginSubstring, limit);
