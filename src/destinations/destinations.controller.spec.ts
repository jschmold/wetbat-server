import { createSpyObject, SpyObject } from '@app/testing/spy-object';
import { Test, TestingModule } from '@nestjs/testing';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { v4 as uuid } from 'uuid';
import { loremIpsum } from 'lorem-ipsum';
import { plainToClass } from 'class-transformer';
import { DestinationModel } from './models/destination.model';
import { UpdateDestinationDTO } from './dto/update-destination.dto';
import { CreateDestinationDTO } from './dto/create-destination.dto';

describe('DestinationsController', () => {
  let controller: DestinationsController;
  
  let service: SpyObject<DestinationsService>;

  beforeEach(async () => {

    service = createSpyObject([ 'createDestination', 'updateDestination', 'listAllDestinations' ]);
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          { provide: DestinationsService, useValue: service },
        ],
        controllers: [ DestinationsController ],
      })
      .compile();

    controller = module.get<DestinationsController>(DestinationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#getAllDestinations',  () => {

    let result: DestinationModel[];
    beforeEach(() => {
      result = [];
      for (let i = 0; i < 10; ++i) {
        const data = plainToClass(DestinationModel, {
          id: uuid(),
          name: loremIpsum(),
          country: loremIpsum(),
          airportCode: 'YYC',
        });

        result.push(data);
      }

      service.listAllDestinations.mockResolvedValue(result);
    });

    it('lists all destinations', async () => {
      const data= await controller.getAllDestinations(); 
      expect(data).toEqual(result);
    });
  });

  describe('#updateDestination', () => {

    let dto: UpdateDestinationDTO;
    let result: DestinationModel;
    let id: string;

    beforeEach(() =>  {
      id = uuid();
      const name = loremIpsum();
      const country = loremIpsum();
      dto = plainToClass(UpdateDestinationDTO, { name, country });
      result = plainToClass(DestinationModel, { id, name, country, airportCode: 'YYC' });

      service.updateDestination.mockResolvedValue(result);
    });

    it('calls the service properly', async () => {
      await controller.updateDestination(id, dto);
      expect(service.updateDestination).toHaveBeenCalledWith(id, dto);
    });

    it('returns the data from the service', async () => {
      const response = await controller.updateDestination(id, dto);
      expect(response).toEqual(result);
    });
  });

  describe('#createDestination', () => {
    let dto: CreateDestinationDTO;
    let result: DestinationModel;
    
    beforeEach(() => {
      const name = loremIpsum();
      const country = loremIpsum();
      const airportCode = 'YYC';

      dto = plainToClass(CreateDestinationDTO, { name, country, airportCode });
      result = plainToClass(DestinationModel, { id: uuid(), name, country, airportCode });

      service.createDestination.mockResolvedValue(result);
    });

    it('calls the service correctly', async () => {
      await controller.createDestination(dto);
      expect(service.createDestination).toHaveBeenCalledWith(dto);
    });

    it('returns the created data', async () => {
      const creation = await controller.createDestination(dto);
      expect(creation).toEqual(result);
    });
  });

});
