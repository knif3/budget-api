import { v4 as uuid } from 'uuid';
import { Op } from 'sequelize';
import { Budget } from '../interfaces/budget';
import { BudgetModel, UserModel } from './models';
import { NotFoundError } from '../errors/notfound-error';
import { userId } from '../services/core/user-handler';

const convertBudgetModelToBudget = (budgetModel: BudgetModel): Budget => (budgetModel as unknown) as Budget;

const convertBudgetModelsToBudget = (budgetModels: BudgetModel[]): Budget[] => budgetModels.map(convertBudgetModelToBudget);

class BudgetDataAccess {
  getAll = async (): Promise<Budget[]> => {
    const budgetModels = await BudgetModel.findAll({
      where: {
        userId: `${userId()}`,
      },
    });

    return convertBudgetModelsToBudget(budgetModels);
  };

  getSingle = async (id: string): Promise<Budget | null> => {
    const budgetModel = await BudgetModel.findOne({
      where: {
        id,
        userId: `${userId()}`,
      },
      include: [
        {
          model: UserModel,
        },
      ],
    });

    return budgetModel ? convertBudgetModelToBudget(budgetModel) : null;
  };

  findByTitle = async (title: string): Promise<Budget | null> => {
    const budgetModel = await BudgetModel.findOne({
      where: {
        userId: userId(),
        title,
      },
    });

    return budgetModel ? convertBudgetModelToBudget(budgetModel) : null;
  };

  create = async (data: Partial<Budget>): Promise<Budget> => {
    const budgetModel = await BudgetModel.create({
      ...data,
      id: uuid(),
      active: true,
      userId: userId(),
    });

    return convertBudgetModelToBudget(budgetModel);
  };

  update = async (uuid: string, data: Partial<Budget>): Promise<Budget> => {
    const budget = await BudgetModel.findByPk(uuid);
    if (!budget) {
      throw new NotFoundError('Resource not found!');
    }

    await budget.update({
      ...data,
    });

    return convertBudgetModelToBudget(budget);
  };

  delete = async (uuid: string): Promise<boolean> => {
    // TODO user validation
    const budget = await BudgetModel.findByPk(uuid);
    if (!budget) {
      throw new NotFoundError('Resource not found!');
    }

    await budget.destroy();

    return !!await BudgetModel.findByPk(uuid);
  };
}

const budgetDataAccess = new BudgetDataAccess();
Object.freeze(budgetDataAccess);

export { budgetDataAccess as BudgetDataAccess };
