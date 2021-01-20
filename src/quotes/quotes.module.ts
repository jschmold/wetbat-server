import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteModel } from './models/quote.model';
import {DestinationsModule} from '@app/destinations/destinations.module';

// Declaring this here because we want to make it available to the module and export it too
const MODELS = TypeOrmModule.forFeature([ QuoteModel ]);

@Module({
  imports: [ MODELS, DestinationsModule ],
  providers: [ QuotesService ],
  controllers: [ QuotesController ],
  exports: [ MODELS ],
})
export class QuotesModule {}
