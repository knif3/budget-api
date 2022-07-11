import { singleton } from 'tsyringe';
import { BudgetDataAccess } from '../data-access';
import { Budget } from '../interfaces/budget';
import { ConflictError } from '../errors/conflict-error';

@singleton()
export class BudgetService {
  constructor(private budgetDataAccess: BudgetDataAccess) {}

  getAll = async (): Promise<Budget[]> => this.budgetDataAccess.getAll();

  getSingle = async (id: string): Promise<Budget | null> =>
    this.budgetDataAccess.getSingle(id);

  // getSingleByLogin = async (title: string): Promise<Budget | null> => {
  //     return this.budgetDataAccess.findByTitle(title);
  // }

  create = async (data: Omit<Budget, 'id'>): Promise<Budget> => {
    const user = await this.budgetDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return this.budgetDataAccess.create(data);
  };

  update = async (uuid: string, data: Omit<Budget, 'id'>): Promise<Budget> =>
    this.budgetDataAccess.update(uuid, data);

  delete = async (uuid: string): Promise<boolean> =>
    this.budgetDataAccess.delete(uuid);
}
