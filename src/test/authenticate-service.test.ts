import { expect } from 'chai';
import { describe, it } from 'mocha';
import { authenticate } from '../services/core/authenticate-service';
import { UserModel } from '../data-access/models';
import { User } from '../interfaces/user';

describe('Authenticate Service', () => {
  it('should generate token for user', async () => {
    const user: User = new UserModel({
      login: 'user',
      email: 'user@domain.com',
      password: 'passwd123',
    }) as unknown as User;
    const result = await authenticate(user, 'passwd123');
    expect(result).to.have.length.above(1);
  });
});
