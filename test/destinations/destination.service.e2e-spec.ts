import { setupDefaultApp } from "@app/app";
import { AppModule } from "@app/app.module";
import {DestinationsService} from "@app/destinations/destinations.service";
import { DestinationModel } from "@app/destinations/models/destination.model";
import { CreateQuoteDTO } from "@app/quotes/dto/create-quote.dto";
import { UpdateQuoteDTO } from "@app/quotes/dto/update-quote.dto";
import { QuoteModel } from "@app/quotes/models/quote.model";
import { QuotesService } from "@app/quotes/quotes.service";
import { Database } from "@e2e/database";
import { DestinationProvider } from "@e2e/providers/destination.provider";
import { QuoteProvider } from "@e2e/providers/quote.provider";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";

describe('QuotesModule - QuotesService', () => {
  let app: INestApplication;
  let service: DestinationsService;

  let db: Database;
  let destinationProvider: DestinationProvider;

  beforeAll(async () => {
    db = new Database(DestinationProvider);
    await db.connect('DestinationService E2E Tests');

    destinationProvider = db.getProvider(DestinationProvider);
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


});
