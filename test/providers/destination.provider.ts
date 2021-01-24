import { loremIpsum } from 'lorem-ipsum';

import { DestinationModel } from "@app/destinations/models/destination.model";
import { ProvideModels, DatabaseProvider } from "@e2e/database/provider";
import { QueryBuilder, QueryRunner, Repository } from "typeorm";

export interface IOneDestination {
  name: string;
  airportCode: string;
  country: string;
}

@ProvideModels(DestinationModel)
export class DestinationProvider extends DatabaseProvider<DestinationModel> {

  public get repo(): Repository<DestinationModel> {
    return this.db.repo(DestinationModel);
  }

  public queryBuilder(alias?: string, runner?: QueryRunner): QueryBuilder<DestinationModel> {
    return this.repo.createQueryBuilder(alias, runner);
  }

  public async createOne(arg: IOneDestination): Promise<DestinationModel> {
    const created = this.repo.create(arg);
    
    await this.queryBuilder()
      .insert()
      .values(created)
      .returning('*')
      .execute();

    return created;
  }

  public async createMany(... arg: IOneDestination[]): Promise<DestinationModel[]> {
    const created = this.repo.create(arg);
    
    await this.queryBuilder()
      .insert()
      .values(created)
      .returning('*')
      .execute();

    return created;
  }

  /**
   * Generate 1 destination model with a random name
   */
  public generateOne(): Promise<DestinationModel> {
    const name = this.randomName();
    return this.createOne({ name, airportCode: 'TST', country: 'E2E TEST COUNTRY' });
  }

  /**
   * Generate multiple destinations with random names. Default amount is 5.
   */
  public generateMany(amt = 5): Promise<DestinationModel[]> {
    const dataset = [];
    for (let i = 0; i < amt; ++i) {
      dataset.push({
        name: this.randomName(),
        airportCode: 'TST',
        country: 'E2E TEST COUNTRY',
      });
    }

    return this.createMany(... dataset);
  }

  private randomName(): string {
    return loremIpsum({ count: 5 }).slice(0, 254);
  }
}
