import {
  DataTypes,
  Model
} from 'sequelize';
import { sequelize } from '../../../services/sequelize-loader';

export class UserModel extends Model {
}

UserModel.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  login: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isDeleted: DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'user'
});
