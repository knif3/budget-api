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
            throw new ConflictError('Item already exists!');
        }

        return BudgetDataAccess.create(data);
    }

    update = async (uuid: string, data: Partial<Budget>): Promise<Budget> => {
        return BudgetDataAccess.update(uuid, data);
    }

    // softDeleteBudget = async (uuid: string): Promise<Budget> => {
    //     return BudgetDataAccess.update(uuid, {
    //         isDeleted: true
    //     });
    // }
}

const budgetService = new BudgetService();
Object.freeze(budgetService);

export { budgetService as BudgetService };