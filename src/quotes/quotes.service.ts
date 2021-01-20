import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {classToPlain} from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import {UpdateQuoteDTO} from './dto/update-quote.dto';
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
  
  public async updateQuote(id: string, arg: UpdateQuoteDTO) : Promise<QuoteModel> {
    const updateData: Partial<QuoteModel> = {};
    for (const [ key, value ] of Object.entries(arg)) {
      if (value == null) continue;
      updateData[key] = value;
    }

    if (Object.keys(updateData).length === 0) {
      return this.quoteRepo.findOne(id);
    }

    const result = await this.quoteRepo.update(id, updateData);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return this.quoteRepo.findOne(id);
  }

  /**
   * A simple "give me everything" service method without pagination or filters.
   */
  public async listAll(): Promise<QuoteModel[]> {
    const all = await this.quoteRepo.find({ order: { createdAt: -1 } });
    return all;
  }

}
