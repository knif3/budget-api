import { singleton } from 'tsyringe';
import { CompanyDataAccess } from '../data-access';
import { Company } from '../interfaces/company';
import { ConflictError } from '../errors/conflict-error';

@singleton()
export class CompanyService {
  constructor(private readonly companyDataAccess: CompanyDataAccess) {}

  getAll = async (): Promise<Company[]> => this.companyDataAccess.getAll();

  getSingle = async (id: string): Promise<Company | null> =>
    this.companyDataAccess.getSingle(id);

  // getSingleByLogin = async (title: string): Promise<Company | null> => {
  //     return this.companyDataAccess.findByTitle(title);
  // }

  create = async (data: Omit<Company, 'id'>): Promise<Company> => {
    const user = await this.companyDataAccess.findByTitle(data.title);
    if (user) {
      throw new ConflictError('Resource already exists!');
    }

    return this.companyDataAccess.create(data);
  };

  update = async (uuid: string, data: Partial<Company>): Promise<Company> =>
    this.companyDataAccess.update(uuid, data);

  delete = async (uuid: string): Promise<boolean> =>
    this.companyDataAccess.delete(uuid);
}
