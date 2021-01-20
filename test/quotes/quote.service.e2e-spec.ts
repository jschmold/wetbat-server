import Moment from 'moment';
import { loremIpsum } from 'lorem-ipsum';
import { setupDefaultApp } from "@app/app";
import { AppModule } from "@app/app.module";
import { DestinationModel } from "@app/quotes/models/destination.model";
import { QuotesService } from "@app/quotes/quotes.service";
import { Database } from "@e2e/database";
import { DestinationProvider } from "@e2e/providers/destination.provider";
import { QuoteProvider } from "@e2e/providers/quote.provider";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { CreateQuoteDTO } from '@app/quotes/dto/create-quote.dto';
import { QuoteModel } from '@app/quotes/models/quote.model';
import { plainToClass } from 'class-transformer';
import { UpdateQuoteDTO } from '@app/quotes/dto/update-quote.dto';
import { v4 as uuid } from 'uuid';

describe('QuotesModule - QuotesService', () => {
  let app: INestApplication;
  let service: QuotesService;

  let db: Database;
  let quoteProvider: QuoteProvider;
  let destinationProvider: DestinationProvider;

  let destinations: DestinationModel[];

  beforeAll(async () => {
    db = new Database(QuoteProvider, DestinationProvider);
    await db.connect('QuoteService E2E Tests');

    quoteProvider = db.getProvider(QuoteProvider);
    destinationProvider = db.getProvider(DestinationProvider);
    destinations = await destinationProvider.generateMany();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test
      .createTestingModule({ imports: [ AppModule ] })
      .compile();

    app = moduleFixture.createNestApplication();
    setupDefaultApp(app);
    await app.init();

    service = moduleFixture.get(QuotesService);
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await destinationProvider
      .queryBuilder('dest')
      .delete()
      .whereInIds(destinations.map(a => a.id))
      .execute();
    
    await db.disconnect();
  });

  describe('#createQuote', () => {
    let dto: CreateQuoteDTO;

    let cleanupIds: string[];

    beforeEach(() => {
      cleanupIds = [];
      const name = loremIpsum({ count: 2 });

      dto = new CreateQuoteDTO();
      dto.name = name;
      dto.returnDate = Moment().add(30, 'days').toDate();
      dto.departureDate = Moment().add(14, 'days').toDate();
      dto.destinationId = destinations[2].id;
    });

    afterEach(async () => {
      await quoteProvider
        .queryBuilder('quote')
        .delete()
        .whereInIds(cleanupIds)
        .execute();
    });

    it('inserts the quote', async () => {
      const model = await service.createQuote(dto);
      expect(model).toBeTruthy();
      cleanupIds.push(model.id);

      const row: QuoteModel = await quoteProvider.repo.findOne(model.id);
      expect(row).toEqual(model);
    });
  });

  describe('#updateQuote', () => {
    let quote: QuoteModel;

    beforeEach(async () => {
      const data = {
        name: loremIpsum({ count: 3 }).slice(0, 255),
        departureDate: Moment().add(3, 'days').toDate(),
        returnDate: Moment().add(9, 'days').toDate(),
        destinationId: destinations[4].id,
      };

      quote = await quoteProvider.createOne(data);
    });

    it('updates the fields', async () => {
      const departureDate = Moment().add(4, 'days').toDate();
      const dto = plainToClass(UpdateQuoteDTO, { departureDate });
      const result = await service.updateQuote(quote.id, dto);
      expect(result.departureDate).toEqual(departureDate);

      const row = await quoteProvider.repo.findOne(quote.id);
      expect(row).toEqual(result);
    });

    it('throws NotFound if no id matches', async () => {
      const departureDate = Moment().add(4, 'days').toDate();
      const dto = plainToClass(UpdateQuoteDTO, { departureDate });
      try {
        await service.updateQuote(uuid(), dto);
        throw new Error('Expected a NotFoundException and threw none');
      } catch(err){ 
        expect(err instanceof NotFoundException).toBeTruthy();
      }
    });
  });

  describe('#listAll', () => {
    let quotes: QuoteModel[];

    beforeEach(async () => {
      const qdata = destinations.map(d => ({
        name: loremIpsum({ count: 3 }).slice(0, 255),
        departureDate: Moment().add(3, 'days').toDate(),
        returnDate: Moment().add(9, 'days').toDate(),
        destinationId: d.id,
      }));

      // descending order sort
      quotes = await quoteProvider.createMany(... qdata);
      quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });

    afterEach(async () => {
      await quoteProvider
        .queryBuilder()
        .delete()
        .whereInIds(quotes.map(a => a.id))
        .execute();
    });

    it('lists all items', async () => {
      const items = await service.listAll();

      const savedIds = quotes.map(a => a.id);
      const returnedIds = items.map(a => a.id);

      const allMatch = savedIds.every(a => returnedIds.includes(a));
      expect(allMatch).toBeTruthy();
    });

  });
});
