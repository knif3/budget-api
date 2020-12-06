import {
  DataTypes,
  Model
} from 'sequelize';
import { sequelize } from '../../../services/core/sequelize-loader';
import { UserModel } from './user-model';

export class CompanyModel extends Model {
}

CompanyModel.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: UserModel
    }
  },
  active: DataTypes.BOOLEAN,
  isPublic: DataTypes.BOOLEAN,
  title: DataTypes.STRING,
  addrZip: DataTypes.STRING,
  addrCity: DataTypes.STRING,
  addrStreet: DataTypes.STRING,
  isMeter: DataTypes.BOOLEAN,
  transactionType: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'company'
});
