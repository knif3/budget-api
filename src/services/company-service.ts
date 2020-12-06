import { CompanyDataAccess } from '../data-access';
import { Company } from '../interfaces/company';
import { ConflictError } from '../errors/conflict-error';

class CompanyService {
    getAll = async (): Promise<Company[]> => {
        return CompanyDataAccess.getAll();
    }

    getSingle = async (id: string): Promise<Company | null> => {
        return CompanyDataAccess.getSingle(id);
    }

    // getSingleByLogin = async (title: string): Promise<Company | null> => {
    //     return CompanyDataAccess.findByTitle(title);
    // }

    create = async (data: Omit<Company, 'id'>): Promise<Company> => {
        const user = await CompanyDataAccess.findByTitle(data.title);
        if (user) {
            throw new ConflictError('Item already exists!');
        }

        return CompanyDataAccess.create(data);
    }

    update = async (uuid: string, data: Partial<Company>): Promise<Company> => {
        return CompanyDataAccess.update(uuid, data);
    }

    // softDeleteCompany = async (uuid: string): Promise<Company> => {
    //     return CompanyDataAccess.update(uuid, {
    //         isDeleted: true
    //     });
    // }
}

const companyService = new CompanyService();
Object.freeze(companyService);

export { companyService as CompanyService };
