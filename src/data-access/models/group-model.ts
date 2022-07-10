import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../services/core/sequelize-loader';

export class GroupModel extends Model {}

GroupModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'group',
  }
);
