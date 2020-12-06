import { Traffic } from '../../interfaces/traffic';
import { v4 as uuid_v4 } from 'uuid';
import { Op } from 'sequelize';
import { TrafficModel } from './models';
import { NotFoundError } from '../../errors/notfound-error';

class TrafficDataAccess {
  getAll = async (): Promise<Traffic[]> => {
    const trafficModels = await TrafficModel.findAll({
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertTrafficModelsToTraffic(trafficModels);
  };

  getSingle = async (id: string): Promise<Traffic | null> => {
    const trafficModel = await TrafficModel.findByPk(id, {
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return trafficModel ? convertTrafficModelToTraffic(trafficModel) : null;
  };

  findByTitle = async (title: string): Promise<Traffic | null> => {
    const trafficModel = await TrafficModel.findOne({
      where: {title}
    });

    return trafficModel ? convertTrafficModelToTraffic(trafficModel) : null;
  };

  create = async (data: Partial<Traffic>): Promise<Traffic> => {
    const trafficModel = await TrafficModel.create({
      ...data,
      id: uuid_v4(),
      amount: data.amount,
      isDeleted: false
    });

    return convertTrafficModelToTraffic(trafficModel);
  };

  update = async (uuid: string, data: Partial<Traffic>): Promise<Traffic> => {
    const traffic = await TrafficModel.findByPk(uuid);
    if (!traffic) {
      throw new NotFoundError('Resource not found!');
    }

    await traffic.update({
      ...data,
      amount: data.amount,
    });

    return convertTrafficModelToTraffic(traffic);
  };

  autoSuggest = async (loginSubstring: string, limit: number): Promise<Traffic[]> => {
    const trafficModels = await TrafficModel.findAll({
      where: {
        login: {
          [Op.iLike]: `%${loginSubstring}%`
        }
      },
      // order: [
      //   ['login', 'ASC']
      // ],
      limit,
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertTrafficModelsToTraffic(trafficModels);
  };
}

const convertTrafficModelToTraffic = (trafficModel: TrafficModel): Traffic => {
  return (trafficModel as unknown) as Traffic;
}

const convertTrafficModelsToTraffic = (trafficModels: TrafficModel[]): Traffic[] => {
  return trafficModels.map(convertTrafficModelToTraffic);
}

const trafficDataAccess = new TrafficDataAccess();
Object.freeze(trafficDataAccess);

export { trafficDataAccess as TrafficDataAccess };
