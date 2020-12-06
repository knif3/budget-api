import { v4 as uuid_v4 } from 'uuid';
import faker from 'faker';
import { User } from '../interfaces/user';
import { UserService } from './user-service';
import { logger } from './core/winston-logger-service';

export const UserGenerateFakeDataService = async (length: number): Promise<void> => {
    let createdUsers = 0;

    for (let i = 0; i < length; i++) {
        const user: User = {
            id: uuid_v4(),
            login: `${faker.name.firstName()}_${faker.name.lastName()}`,
            password: Math.random().toString(36).slice(-8),
            age: Math.floor(Math.random() * 130) + 4,
            isDeleted: false
        };

        await UserService.createNew(user);
        createdUsers++;
    }

    logger.info(`Users created: ${createdUsers}`);
};
