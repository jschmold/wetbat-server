import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
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
  public async updateDestination(id: string, arg: CreateUpdateDestinationDTO): Promise<DestinationModel> {
    const target = await this.destinationRepo.findOne(id);
    if (!target) {
      throw new NotFoundException();
    }

    const updateData: Partial<DestinationModel> = {};
    for (const [ key, value ] of Object.entries(arg)) {
      if (value == null) continue;
      updateData[key] = value;
    }

    await this.destinationRepo.createQueryBuilder()
      .update(updateData)
      .whereEntity(target)
      .returning('*')
      .execute();

    return target;
  }

  /**
   * List all destinations, ordered by their airport code
   */
  public listAllDestinations(): Promise<DestinationModel[]> {
    return this.destinationRepo.find();
  }
}

