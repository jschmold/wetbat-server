import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DestinationsService } from './destinations.service';
import { DestinationModel } from './models/destination.model';

describe('DestinationsService', () => {
  let service: DestinationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          DestinationsService,
          { provide: getRepositoryToken(DestinationModel), useValue: jest.fn() },
        ],
      })
      .compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
