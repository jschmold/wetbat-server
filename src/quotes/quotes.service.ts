import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import { UpdateQuoteDTO } from './dto/update-quote.dto';
import { QuoteModel } from './models/quote.model';

/**
 * The service responsible for interfacing with the database and providing QuoteModel specific
 * functionality to the application
 */
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
  
  /**
   * Use validated data, and update a quote against an ID. This will throw a NotFoundException if
   * there are no quotes matching the id provided. Returns the latest version of a quote.
   */
  public async updateQuote(id: number, arg: UpdateQuoteDTO): Promise<QuoteModel> {
    const target = await this.quoteRepo.findOne(id);
    if (!target) {
      throw new NotFoundException();
    }

    const updateData: Partial<QuoteModel> = {};
    for (const [ key, value ] of Object.entries(arg)) {
      if (value == null) continue;
      updateData[key] = value;
    }

    await this.quoteRepo.createQueryBuilder()
      .update(updateData)
      .whereEntity(target)
      .returning('*')
      .execute();

    return target;
  }

  /**
   * A simple "give me everything" service method without pagination or filters. Sorts by
   * descending created dates
   */
  public async listAll(): Promise<QuoteModel[]> {
    const all = await this.quoteRepo.find({ order: { createdAt: -1 } });
    return all;
  }

}
