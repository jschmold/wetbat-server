import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import { QuoteModel } from './models/quote.model';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {

  constructor(
    private readonly quotes: QuotesService,
  ) {}

  /**
   * The path that allows a user to create a new quote. This is the endpoint
   * after the automatic validation occurs.
   *
   * [POST] /quotes/
   */
  @Post()
  public createQuote(@Body() dto: CreateQuoteDTO): Promise<QuoteModel> {
    if (!dto.datesAreValid) {
      throw new BadRequestException('Departure and Return dates must be in the future');
    }

    return this.quotes.createQuote(dto);
  }
}
