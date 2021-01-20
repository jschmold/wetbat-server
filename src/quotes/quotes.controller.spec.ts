import Moment from 'moment';

import { createSpyObject, SpyObject } from '@app/testing/spy-object';
import { Test, TestingModule } from '@nestjs/testing';
import { loremIpsum } from 'lorem-ipsum';
import { CreateQuoteDTO } from './dto/create-quote.dto';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { QuoteModel } from './models/quote.model';
import {UpdateQuoteDTO} from './dto/update-quote.dto';

describe('QuotesController', () => {
  let controller: QuotesController;
  
  let service: SpyObject<QuotesService>;

  beforeEach(async () => {

    service = createSpyObject([ 'createQuote', 'updateQuote' ]);

    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          { provide: QuotesService, useValue: service },
        ],
        controllers: [ QuotesController ],
      })
      .compile();

    controller = module.get<QuotesController>(QuotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createQuote', () => {
    let dto: CreateQuoteDTO;
    let result: QuoteModel;

    beforeEach(() => {
      const name = loremIpsum({ count: 2 });

      dto = plainToClass(CreateQuoteDTO, {
        returnDate: Moment().add(30, 'days').toDate(),
        departureDate: Moment().add(14, 'days').toDate(),
        destinationId: uuid(),
        name,
      });

      result = plainToClass(QuoteModel, {
        id: uuid(),
        name: dto.name,
        destinationId: dto.destinationId,
        departureDate: dto.departureDate,
        returnDate: dto.returnDate,
        travelMethod: null,
      });

      service.createQuote.mockResolvedValue(result);
    });

    it('rejects invalid dates', async () => {
      const noDates = plainToClass(CreateQuoteDTO, { ... dto });
      delete noDates.returnDate;
      delete noDates.departureDate;

      const beforeDates = plainToClass(CreateQuoteDTO, { ... dto });
      beforeDates.returnDate = Moment().subtract(5, 'days').toDate();
      beforeDates.departureDate = Moment().subtract(25, 'days').toDate();

      for (const item of [ noDates, beforeDates ]) {
        try {
          await controller.createQuote(item);
          throw new Error('Did not get exception when we expected BadRequest');
        } catch (err) {
          expect(err instanceof BadRequestException).toBeTruthy();
        }
      }
    });

    it('calls the service correctly', async () => {
      const response = await controller.createQuote(dto);
      expect(service.createQuote).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('#updateQuote', () => {
    let dto: UpdateQuoteDTO;
    let result: QuoteModel;
    let id: string;

    beforeEach(() => {
      id = uuid();

      const name = loremIpsum({ count: 2 });
      dto = plainToClass(UpdateQuoteDTO, { name });

      result = plainToClass(QuoteModel, {
        id,
        name: dto.name,
        destinationId: uuid(),
        departureDate: Moment().add(3, 'days').toDate(),
        returnDate: Moment().add(20, 'days').toDate(),
        travelMethod: null,
      });

      service.updateQuote.mockResolvedValue(result);
    });

    it('calls the service correctly', async () => {
      const data = await controller.updateQuote(id, dto);
      expect(data).toEqual(result);
    });

    it('rejects invalid dates', async () => {
      dto.returnDate = Moment().subtract(5, 'days').toDate();
      dto.departureDate = Moment().subtract(25, 'days').toDate();

      try {
        await controller.updateQuote(id, dto);
        throw new Error('Did not get exception when we expected BadRequest');
      } catch (err) {
        expect(err instanceof BadRequestException).toBeTruthy();
      }

    });
  });
});
