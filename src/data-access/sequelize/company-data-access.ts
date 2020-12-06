import { Company } from '../../interfaces/company';
import { v4 as uuid_v4 } from 'uuid';
import { CompanyModel } from './models';
import { NotFoundError } from '../../errors/notfound-error';

class CompanyDataAccess {
  getAll = async (): Promise<Company[]> => {
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

  getSingle = async (id: string): Promise<Company | null> => {
    const companyModel = await CompanyModel.findByPk(id, {
      // include: [
      //   {
      //     model: GroupModel,
      //     through: {attributes: []}
      //   }
      // ]
    });

    return companyModel ? convertCompanyModelToCompany(companyModel) : null;
  };

  findByTitle = async (title: string): Promise<Company | null> => {
    const companyModel = await CompanyModel.findOne({
      where: {title}
    });

    return companyModel ? convertCompanyModelToCompany(companyModel) : null;
  };

  create = async (data: Partial<Company>): Promise<Company> => {
    const companyModel = await CompanyModel.create({
      ...data,
      id: uuid_v4(),
      // openingBalance: data.openingBalance,
      // isDeleted: false,
    });

    return convertCompanyModelToCompany(companyModel);
  };

  update = async (uuid: string, data: Partial<Company>): Promise<Company> => {
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

  delete = async (uuid: string): Promise<boolean> => {
    // TODO user validation
    const company = await CompanyModel.findByPk(uuid);
    if (!company) {
      throw new NotFoundError('Resource not found!');
    }

    await company.destroy();

    return !! await CompanyModel.findByPk(uuid);
  };
}

const convertCompanyModelToCompany = (companyModel: CompanyModel): Company => {
  return (companyModel as unknown) as Company;
}

const convertCompanyModelsToCompany = (companyModels: CompanyModel[]): Company[] => {
  return companyModels.map(convertCompanyModelToCompany);
}

const companyDataAccess = new CompanyDataAccess();
Object.freeze(companyDataAccess);

export { companyDataAccess as CompanyDataAccess };
