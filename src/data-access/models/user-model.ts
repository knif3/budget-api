import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../services/core/sequelize-loader';
import { GroupModel } from './group-model';

export class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.STRING,
      references: {
        model: GroupModel,
      },
      onDelete: 'cascade',
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

GroupModel.belongsTo(UserModel);
