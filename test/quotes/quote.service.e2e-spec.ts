import {setupDefaultApp} from "@app/app";
import {AppModule} from "@app/app.module";
import {QuotesService} from "@app/quotes/quotes.service";
import {Database} from "@e2e/database";
import {QuoteProvider} from "@e2e/providers/quote.provider";
import {INestApplication} from "@nestjs/common";
import {TestingModule, Test} from "@nestjs/testing";

describe('QuotesModule - QuotesService', () => {
  let app: INestApplication;
  let service: QuotesService;

  let db: Database;
  let quoteProvider: QuoteProvider;

  beforeAll(async () => {
    db = new Database(QuoteProvider);
    await db.connect('OrganizationService E2E Tests');

    quoteProvider = db.getProvider(QuoteProvider);
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
    await db.disconnect();
  });
});
