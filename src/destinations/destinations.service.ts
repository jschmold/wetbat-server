import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUpdateDestinationDTO } from './dto/create-update-destination.dto';
import { DestinationModel } from './models/destination.model';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(DestinationModel)
    private readonly destinationRepo: Repository<DestinationModel>
  ) { }
  

  /**
   * Create a brand new destination. This does not require uniqueness, and also does not
   */
  public async createDestination(arg: CreateUpdateDestinationDTO): Promise<DestinationModel> {
    const created = this.destinationRepo.create(arg);

    await this.destinationRepo
      .createQueryBuilder()
      .insert()
      .values(created)
      .returning('*')
      .execute();

    return created;
  }

  /**
   * Update an existing destination with a validated CreateUpdateDestinationDTO
   */
  public updateDestination(): Promise<DestinationModel> {
    throw new NotImplementedException();
  }

  /**
   * List all destinations, ordered by their airport code
   */
  public listAllDestinations(): Promise<DestinationModel[]> {
    throw new NotImplementedException();
  }
}

