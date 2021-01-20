import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DestinationModel} from './models/destination.model';

const MODELS = TypeOrmModule.forFeature([ DestinationModel ]);

@Module({
  imports: [ MODELS ],
  providers: [ DestinationsService ],
  controllers: [ DestinationsController ],
  exports: [ MODELS ],
})
export class DestinationsModule {}
