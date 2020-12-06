import { Budget } from '../../interfaces/budget';
import { v4 as uuid_v4 } from 'uuid';
import { Op } from 'sequelize';
import { BudgetModel } from './models';
import { NotFoundError } from '../../errors/notfound-error';

class BudgetDataAccess {
  getAll = async (): Promise<Budget[]> => {
    const budgetModels = await BudgetModel.findAll({
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertBudgetModelsToBudget(budgetModels);
  };

  getSingle = async (id: string): Promise<Budget | null> => {
    const budgetModel = await BudgetModel.findByPk(id, {
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return budgetModel ? convertBudgetModelToBudget(budgetModel) : null;
  };

  findByTitle = async (title: string): Promise<Budget | null> => {
    const budgetModel = await BudgetModel.findOne({
      where: {title}
    });

    return budgetModel ? convertBudgetModelToBudget(budgetModel) : null;
  };

  create = async (data: Partial<Budget>): Promise<Budget> => {
    const budgetModel = await BudgetModel.create({
      ...data,
      id: uuid_v4(),
      // openingBalance: data.openingBalance,
      // isDeleted: false,
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
      // amount: data.openingBalance,
    });

    return convertBudgetModelToBudget(budget);
  };

  autoSuggest = async (loginSubstring: string, limit: number): Promise<Budget[]> => {
    const budgetModels = await BudgetModel.findAll({
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

    return convertBudgetModelsToBudget(budgetModels);
  };
}

const convertBudgetModelToBudget = (budgetModel: BudgetModel): Budget => {
  return (budgetModel as unknown) as Budget;
}

const convertBudgetModelsToBudget = (budgetModels: BudgetModel[]): Budget[] => {
  return budgetModels.map(convertBudgetModelToBudget);
}

const budgetDataAccess = new BudgetDataAccess();
Object.freeze(budgetDataAccess);

export { budgetDataAccess as BudgetDataAccess };
