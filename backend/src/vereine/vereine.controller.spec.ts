import { Test, TestingModule } from '@nestjs/testing';
import { VereineController } from './vereine.controller';

describe('VereineController', () => {
  let controller: VereineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VereineController],
    }).compile();

    controller = module.get<VereineController>(VereineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
