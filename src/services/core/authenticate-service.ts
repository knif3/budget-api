import crypto, { BinaryLike } from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '../../interfaces/user';

const userHashSecretKey = process.env.USER_HASH_SECRET_KEY || '';

export const hash = (msg: BinaryLike) =>
  crypto.createHmac('sha256', userHashSecretKey).update(msg).digest('hex');

export const authenticate = async (
  userModel: User,
  password: string
): Promise<string> => {
  if (!userModel) {
    throw new Error('User not found!');
  }

  if (userModel.password !== hash(password)) {
    throw new Error('Invalid password!');
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
  const jwtExpiration = process.env.JWT_EXPIRATION || '';

  return jwt.sign(
    {
      id: userModel.id,
      login: userModel.login,
      email: userModel.email,
    },
    jwtSecretKey,
    { expiresIn: `${jwtExpiration}` }
  );
};
