import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import { UpdateQuoteDTO } from './dto/update-quote.dto';
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

  /**
   * This path allows the user to list all quotes in descending order. Note, because this is 
   * literally MVP, there's no pagination or anything. This will return all results.
   *
   * In the future, we will need a "dto" that allows the user to select the parameters. Search query,
   * pagination, and perhaps field filters (like dates).
   *
   * [GET] /quotes/
   */
  @Get()
  public listQuotes(): Promise<QuoteModel[]> {
    return this.quotes.listAll();
  }


  /**
   * The path that allows users to update a quote. This will throw a NotFoundException if the user
   * provides an id in the path that does not resolve an actual quote, and will also throw a 
   * BadRequestException in the situation that the user has provided an invalid update object (bad
   * dates for example)
   *
   * [PATCH] /quotes/:id
   */
  @Patch('id')
  public updateQuote(
    @Param('id') id: number,
    @Body() dto: UpdateQuoteDTO,
  ): Promise<QuoteModel> {
    if (!dto.datesAreValid) {
      throw new BadRequestException('Departure and Return dates must be in the future');
    }

    return this.quotes.updateQuote(id, dto);
  }
  
}
