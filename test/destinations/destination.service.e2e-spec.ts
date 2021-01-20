import { setupDefaultApp } from "@app/app";
import { AppModule } from "@app/app.module";
import { DestinationsService } from "@app/destinations/destinations.service";
import { CreateUpdateDestinationDTO } from "@app/destinations/dto/create-update-destination.dto";
import { DestinationModel } from "@app/destinations/models/destination.model";
import { KeysOf } from "@app/shared/types";
import { Database } from "@e2e/database";
import { DestinationProvider } from "@e2e/providers/destination.provider";
import { INestApplication, NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { plainToClass } from "class-transformer";
import { v4 as uuid } from 'uuid';
import { loremIpsum } from "lorem-ipsum";

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

    service = moduleFixture.get(DestinationsService);
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('#createDestination', () => {
    let dto: CreateUpdateDestinationDTO;

    beforeEach(() => {
      dto = plainToClass(CreateUpdateDestinationDTO, {
        airportCode: 'YYC',
        country: 'Canada',
        name: loremIpsum({ count: 3 }),
      });
    });

    afterEach(async () => {
      await destinationProvider.delete({ name: dto.name });
    });

    it('creates the destination', async () => {
      const result = await service.createDestination(dto);
      expect(result.name).toEqual(dto.name);
      expect(result.airportCode).toEqual(dto.airportCode);
      expect(result.country).toEqual(dto.country);

      const row = await destinationProvider.repo.findOne(result.id);
      expect(row).toEqual(result);
    });
  });

  describe('#listAllDestinations', () => {
    it('lists all destinations', async () => {
      const count: number = await destinationProvider.queryBuilder()
        .select('count(*)')
        .where('true')
        .execute()
        .then(a => parseInt("" + a[0].count, 10));

      const items = await service.listAllDestinations();
      expect(items.length).toEqual(count);
    });
  });

  describe('#updateDestination', () => {
    let destination: DestinationModel;
    let dto: CreateUpdateDestinationDTO;

    beforeEach(async () => {
      destination = await destinationProvider.generateOne();

      dto = plainToClass(CreateUpdateDestinationDTO, {
        airportCode: 'TAT',
        country: 'E2E Update Test',
        name: loremIpsum({ count: 3 }),
      });
    });

    afterEach(async () => {
      await destinationProvider.delete({ id: destination.id });
    });

    it('updates the destination', async () => {
      const result = await service.updateDestination(destination.id, dto);
      const row = await destinationProvider.repo.findOne(destination.id);
      expect(result).toEqual(row);

      const keys: KeysOf<CreateUpdateDestinationDTO> = [ 'airportCode', 'country', 'name' ];
      for (const key of keys) {
        expect(result[key]).toEqual(dto[key]);
      }
    });

    it('throws a NotFoundException if id is invalid', async () => {
      try {
        await service.updateDestination(uuid(), dto);
        throw new Error('Expected a NotFoundException but none were thrown');
      } catch (err) {
        expect(err instanceof NotFoundException).toBeTruthy();
      }
    });

  });

});
