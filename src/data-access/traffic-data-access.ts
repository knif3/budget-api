import { v4 as uuid_v4 } from 'uuid';
import { injectable } from 'tsyringe';
import { Traffic } from '../interfaces/traffic';
import { BudgetModel, CompanyModel, TrafficModel } from './models';
import { NotFoundError } from '../errors/notfound-error';
import { userId } from '../services/core/user-handler';

const convertTrafficModelToTraffic = (trafficModel: TrafficModel): Traffic =>
  trafficModel as unknown as Traffic;

const convertTrafficModelsToTraffic = (
  trafficModels: TrafficModel[]
): Traffic[] => trafficModels.map(convertTrafficModelToTraffic);

@injectable()
export class TrafficDataAccess {
  constructor() {}

  public getAll = async (): Promise<Traffic[]> => {
    const trafficModels = await TrafficModel.findAll({
      include: [
        {
          model: BudgetModel,
          where: {
            userId: `${userId()}`,
          },
          attributes: ['title', 'budgetType', 'currency'],
        },
        {
          model: CompanyModel,
          attributes: ['title'],
        },
      ],
    });

    return convertTrafficModelsToTraffic(trafficModels);
  };

  public getSingle = async (id: string): Promise<Traffic | null> => {
    const trafficModel = await TrafficModel.findByPk(id, {
      include: [
        {
          model: BudgetModel,
          where: {
            userId: `${userId()}`,
          },
          attributes: ['title', 'budgetType', 'currency'],
        },
        {
          model: CompanyModel,
          attributes: ['title'],
        },
      ],
    });

    return trafficModel ? convertTrafficModelToTraffic(trafficModel) : null;
  };

  public findByTitle = async (title: string): Promise<Traffic | null> => {
    const trafficModel = await TrafficModel.findOne({
      where: { title },
    });

    return trafficModel ? convertTrafficModelToTraffic(trafficModel) : null;
  };

  public create = async (data: Partial<Traffic>): Promise<Traffic> => {
    const trafficModel = await TrafficModel.create({
      ...data,
      id: uuid_v4(),
      amount: data.amount,
      isDeleted: false,
    });

    return convertTrafficModelToTraffic(trafficModel);
  };

  public update = async (
    uuid: string,
    data: Partial<Traffic>
  ): Promise<Traffic> => {
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

  public delete = async (uuid: string): Promise<boolean> => {
    // TODO user validation
    const traffic = await TrafficModel.findByPk(uuid);
    if (!traffic) {
      throw new NotFoundError('Resource not found!');
    }

    await traffic.destroy();

    return !!(await TrafficModel.findByPk(uuid));
  };
}
