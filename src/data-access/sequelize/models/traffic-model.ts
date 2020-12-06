import {
  DataTypes,
  Model
} from 'sequelize';
import { sequelize } from '../../../services/sequelize-loader';

export class TrafficModel extends Model {
}

TrafficModel.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: DataTypes.STRING,
  amount: DataTypes.INTEGER,
}, {
  sequelize,
  modelName: 'traffic'
});
