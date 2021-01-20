import Moment from 'moment';
import { loremIpsum } from 'lorem-ipsum';
import { setupDefaultApp } from "@app/app";
import { AppModule } from "@app/app.module";
import { DestinationModel } from "@app/quotes/models/destination.model";
import { QuotesService } from "@app/quotes/quotes.service";
import { Database } from "@e2e/database";
import { DestinationProvider } from "@e2e/providers/destination.provider";
import { QuoteProvider } from "@e2e/providers/quote.provider";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { CreateQuoteDTO } from '@app/quotes/dto/create-quote.dto';
import { QuoteModel } from '@app/quotes/models/quote.model';

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
});
