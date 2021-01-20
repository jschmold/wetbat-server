import { QuoteModel } from "@app/quotes/models/quote.model";
import { ProvideModels, DatabaseProvider } from "@e2e/database/provider";
import { QueryBuilder, QueryRunner, Repository } from "typeorm";

export interface IOneQuote {
  name:string;
  destinationId: string;
  departureDate: Date;
  returnDate: Date;
  travelMethod?: string;
}

@ProvideModels(QuoteModel)
export class QuoteProvider extends DatabaseProvider<QuoteModel> {

  public get repo(): Repository<QuoteModel> {
    return this.db.repo(QuoteModel);
  }

  public queryBuilder(alias?: string, runner?: QueryRunner): QueryBuilder<QuoteModel> {
    return this.repo.createQueryBuilder(alias, runner);
  }

  public async createOne(arg: IOneQuote): Promise<QuoteModel> {
    const created = this.repo.create(arg);
    
    await this.queryBuilder()
      .insert()
      .values(created)
      .returning('*')
      .execute();

    return created;
  }

  public async createMany(... arg: IOneQuote[]): Promise<QuoteModel[]> {
    const created = this.repo.create(arg);
    
    await this.queryBuilder()
      .insert()
      .values(created)
      .returning('*')
      .execute();

    return created;
  }
}
