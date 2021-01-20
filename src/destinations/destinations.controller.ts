import { Controller, Get, NotImplementedException, Patch, Post } from '@nestjs/common';
import { DestinationModel } from './models/destination.model';

@Controller('destinations')
export class DestinationsController {
  @Get()
  public getAllDestinations(): Promise<DestinationModel[]> {
    throw new NotImplementedException();
  }

  @Post()
  public createDestination(): Promise<DestinationModel> {
    throw new NotImplementedException();
  }
  
  @Patch('id')
  public updateDestination(): Promise<DestinationModel> {
    throw new NotImplementedException();
  }

}
