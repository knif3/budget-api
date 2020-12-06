import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserToken } from '../../interfaces/user-token';

export let userToken: UserToken;

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
  let token = <string>req.headers['x-access-token'] || <string>req.headers['authorization'];

  if (!token) {
    res.status(401).json({
      error: 'Auth token is not supplied. You should send it in the header, with the Bearer prefix.'
    });
    return;
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
  jwt.verify(token, jwtSecretKey, (error, decoded) => {
    if (!error) {
      userToken = <UserToken>decoded;
      next();
      return;
    }

    res.status(403).json({
      error: 'Invalid token!',
    });
  });
};
