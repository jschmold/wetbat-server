import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDTO } from './dto/create-destination.dto';
import { UpdateDestinationDTO } from './dto/update-destination.dto';
import { DestinationModel } from './models/destination.model';

@Controller('destinations')
export class DestinationsController {

  constructor(
    private readonly destinations: DestinationsService,
  ) {}

  /**
   * A user will call this route to be able to populate their dropdown menu of destinations.
   * It is also necessary that the ids for a destination are present in the quote,
   * so this is considered "on-init" app loading data.
   */
  @Get()
  public getAllDestinations(): Promise<DestinationModel[]> {
    return this.destinations.listAllDestinations();
  }

  /**
   * Allow the user to create new destinations that were not a part of the db initialization.
   */
  @Post()
  public createDestination(
    @Body() dto: CreateDestinationDTO,
  ): Promise<DestinationModel> {
    return this.destinations.createDestination(dto);
  }
  
  /**
   * Allow the user to correct any information that is incorrect within a destination.
   */
  @Patch('id')
  public updateDestination(
    @Param('id') id: string,
    @Body() arg: UpdateDestinationDTO,
  ): Promise<DestinationModel> {
    return this.destinations.updateDestination(id, arg);
  }

}
