import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../services/core/sequelize-loader';
import { UserModel } from './user-model';

export class BudgetModel extends Model {}

BudgetModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: UserModel,
      },
      onDelete: 'cascade',
    },
    active: DataTypes.BOOLEAN,
    budgetType: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    title: DataTypes.STRING,
    openingBalance: DataTypes.INTEGER,
    accountNumber: DataTypes.STRING,
    creditCardNumber: DataTypes.STRING,
    comment: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'budget',
  }
);

BudgetModel.belongsTo(UserModel);
