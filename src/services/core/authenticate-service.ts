import { User } from '../../interfaces/user';
import { UserService } from '../user-service';
import crypto, { BinaryLike } from 'crypto';
import jwt from 'jsonwebtoken';

const userHashSecretKey = process.env.USER_HASH_SECRET_KEY || '';

// eslint-disable-next-line no-undef
export const authenticate = async ({ login, password }: Pick<User, 'login' | 'password'>): Promise<{userModel: User, token: string}> => {
    const userModel = await UserService.getSingleByLogin(login);
    if (!userModel) {
        throw new Error('User not found!');
    }

    if (userModel.password === hash(password)) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
        const jwtExpiration = process.env.JWT_EXPIRATION || '';

        const token = jwt.sign({
            id: userModel.id,
            login: userModel.login
        }, jwtSecretKey, { expiresIn: `${jwtExpiration}` });

        return {
            userModel,
            token
        };
    }

    throw new Error('Invalid password!');
};

export const hash = (msg: BinaryLike) => {
    return crypto.createHmac('sha256', userHashSecretKey).update(msg).digest('hex');
};
