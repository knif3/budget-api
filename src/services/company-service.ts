import { CompanyDataAccess } from '../data-access';
import { Company } from '../interfaces/company';
import { ConflictError } from '../errors/conflict-error';
import { Budget } from '../interfaces/budget';

class CompanyService {
  getAll = async (): Promise<Company[]> => CompanyDataAccess.getAll()

  getSingle = async (id: string): Promise<Company | null> => CompanyDataAccess.getSingle(id)

  // getSingleByLogin = async (title: string): Promise<Company | null> => {
  //     return CompanyDataAccess.findByTitle(title);
  // }

  create = async (data: Omit<Company, 'id'>): Promise<Company> => {
    const user = await CompanyDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return CompanyDataAccess.create(data);
  }

  update = async (uuid: string, data: Partial<Company>): Promise<Company> => CompanyDataAccess.update(uuid, data)

  delete = async (uuid: string): Promise<boolean> => CompanyDataAccess.delete(uuid)
}

const companyService = new CompanyService();
Object.freeze(companyService);

export { companyService as CompanyService };
