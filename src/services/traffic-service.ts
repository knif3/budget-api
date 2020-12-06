import { TrafficDataAccess } from '../data-access';
import { Traffic } from '../interfaces/traffic';
import { ConflictError } from '../errors/conflict-error';

class TrafficService {
  getAll = async (): Promise<Traffic[]> => {
    return TrafficDataAccess.getAll();
  }

  getSingle = async (userId: string): Promise<Traffic | null> => {
    return TrafficDataAccess.getSingle(userId);
  }

  getSingleByLogin = async (title: string): Promise<Traffic | null> => {
    return TrafficDataAccess.findByTitle(title);
  }

  createNew = async (data: Omit<Traffic, 'id'>): Promise<Traffic> => {
    const user = await TrafficDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return TrafficDataAccess.create(data);
  }

  update = async (uuid: string, data: Partial<Traffic>): Promise<Traffic> => {
    return TrafficDataAccess.update(uuid, data);
  }


  delete = async (uuid: string): Promise<boolean> => {
    return TrafficDataAccess.delete(uuid);
  }
}

const trafficService = new TrafficService();
Object.freeze(trafficService);

export { trafficService as TrafficService };
