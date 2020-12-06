import { userToken } from './validate-token-service';

export const userId = () => userToken.id;
export const login = () => userToken.login;
