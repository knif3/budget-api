import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../services/core/sequelize-loader';
import { BudgetModel } from './budget-model';

export class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: 'user',
  }
);
