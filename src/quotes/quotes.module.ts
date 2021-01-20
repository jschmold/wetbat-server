import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationModel } from './models/destination.model';
import { QuoteModel } from './models/quote.model';

// Declaring this here because we want to make it available to the module and export it too
const MODELS = TypeOrmModule.forFeature([
  QuoteModel,
  DestinationModel,
]);

@Module({
  imports: [ MODELS ],
  providers: [ QuotesService ],
  controllers: [ QuotesController ],
  exports: [ MODELS ],
})
export class QuotesModule {}
