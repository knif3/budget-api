import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../services/core/sequelize-loader';
import { BudgetModel } from './budget-model';
import { CompanyModel } from './company-model';

export class TrafficModel extends Model {}

TrafficModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    budgetId: {
      type: DataTypes.STRING,
      references: {
        model: BudgetModel,
      },
      onDelete: 'cascade',
    },
    companyId: {
      type: DataTypes.STRING,
      references: {
        model: CompanyModel,
      },
      onDelete: 'cascade',
    },
    title: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    payday: DataTypes.DATEONLY,
    comment: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'traffic',
  }
);

TrafficModel.belongsTo(BudgetModel);
TrafficModel.belongsTo(CompanyModel);
