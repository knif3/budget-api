import { injectable } from 'tsyringe';
import { TrafficDataAccess } from '../data-access';
import { Traffic } from '../interfaces/traffic';
import { ConflictError } from '../errors/conflict-error';

@injectable()
export class TrafficService {
  constructor(private trafficDataAccess: TrafficDataAccess) {}

  getAll = async (): Promise<Traffic[]> => this.trafficDataAccess.getAll();

  getSingle = async (userId: string): Promise<Traffic | null> =>
    this.trafficDataAccess.getSingle(userId);

  getSingleByLogin = async (title: string): Promise<Traffic | null> =>
    this.trafficDataAccess.findByTitle(title);

  createNew = async (data: Omit<Traffic, 'id'>): Promise<Traffic> => {
    const user = await this.trafficDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return this.trafficDataAccess.create(data);
  };

  update = async (uuid: string, data: Partial<Traffic>): Promise<Traffic> =>
    this.trafficDataAccess.update(uuid, data);

  delete = async (uuid: string): Promise<boolean> =>
    this.trafficDataAccess.delete(uuid);
}
