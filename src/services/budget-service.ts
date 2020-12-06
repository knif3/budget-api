import { BudgetDataAccess } from '../data-access';
import { Budget } from '../interfaces/budget';
import { ConflictError } from '../errors/conflict-error';

class BudgetService {
  getAll = async (): Promise<Budget[]> => {
    return BudgetDataAccess.getAll();
  }

  getSingle = async (id: string): Promise<Budget | null> => {
    return BudgetDataAccess.getSingle(id);
  }

  // getSingleByLogin = async (title: string): Promise<Budget | null> => {
  //     return BudgetDataAccess.findByTitle(title);
  // }

  create = async (data: Omit<Budget, 'id'>): Promise<Budget> => {
    const user = await BudgetDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return BudgetDataAccess.create(data);
  }

  update = async (uuid: string, data: Omit<Budget, 'id'>): Promise<Budget> => {
    return BudgetDataAccess.update(uuid, data);
  }

  delete = async (uuid: string): Promise<boolean> => {
    return BudgetDataAccess.delete(uuid);
  }
}

const budgetService = new BudgetService();
Object.freeze(budgetService);

export { budgetService as BudgetService };
