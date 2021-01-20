import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import { QuoteModel } from './models/quote.model';

@Injectable()
export class QuotesService {

  constructor(
    @InjectRepository(QuoteModel)
    private readonly quoteRepo: Repository<QuoteModel>
  ) { }

  /**
   * Takes a validated DTO and creates a quote from it. Call this after checking dates.
   */
  public async createQuote(arg: CreateQuoteDTO): Promise<QuoteModel> {
    const model = this.quoteRepo.create(arg);

    await this.quoteRepo.createQueryBuilder()
      .insert()
      .values(model)
      .returning('*')
      .execute();

    return model;
  }
}
