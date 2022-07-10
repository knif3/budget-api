import { v4 as uuid_v4 } from 'uuid';
import { injectable } from 'tsyringe';
import { Company } from '../interfaces/company';
import { CompanyModel } from './models';
import { NotFoundError } from '../errors/notfound-error';

const convertCompanyModelToCompany = (companyModel: CompanyModel): Company =>
  companyModel as unknown as Company;

const convertCompanyModelsToCompany = (
  companyModels: CompanyModel[]
): Company[] => companyModels.map(convertCompanyModelToCompany);

@injectable()
export class CompanyDataAccess {
  constructor() {}

  public getAll = async (): Promise<Company[]> => {
    const companyModels = await CompanyModel.findAll({
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return convertCompanyModelsToCompany(companyModels);
  };

  public getSingle = async (id: string): Promise<Company> => {
    const companyModel = await CompanyModel.findByPk(id, {
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    if (!companyModel) {
      throw new Error('No user found!');
    }

    return convertCompanyModelToCompany(companyModel);
  };

  public findByTitle = async (title: string): Promise<Company> => {
    const companyModel = await CompanyModel.findOne({
      where: { title },
    });

    if (!companyModel) {
      throw new Error('No user found!');
    }

    return convertCompanyModelToCompany(companyModel);
  };

  public create = async (data: Partial<Company>): Promise<Company> => {
    const companyModel = await CompanyModel.create({
      ...data,
      id: uuid_v4(),
      // openingBalance: data.openingBalance,
      // isDeleted: false,
    });

    return convertCompanyModelToCompany(companyModel);
  };

  public update = async (
    uuid: string,
    data: Partial<Company>
  ): Promise<Company> => {
    const company = await CompanyModel.findByPk(uuid);
    if (!company) {
      throw new NotFoundError('Resource not found!');
    }

    await company.update({
      ...data,
      // amount: data.openingBalance,
    });

    return convertCompanyModelToCompany(company);
  };

  public delete = async (uuid: string): Promise<boolean> => {
    // TODO user validation
    const company = await CompanyModel.findByPk(uuid);
    if (!company) {
      throw new NotFoundError('Resource not found!');
    }

    await company.destroy();

    return !!(await CompanyModel.findByPk(uuid));
  };
}
