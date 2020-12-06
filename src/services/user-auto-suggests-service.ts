import { UserService } from './user-service';
import { User } from '../interfaces/user';

export const UserAutoSuggestsService = (loginSubstring: string, limit: number): Promise<User[]> => {
    return UserService.autoSuggest(loginSubstring, limit);
};
