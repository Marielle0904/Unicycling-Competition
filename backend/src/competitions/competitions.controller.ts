import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';

@Controller('competitions')
export class CompetitionsController {
  constructor(
    private readonly competitionsService: CompetitionsService,
  ) { }

  @Get()
  async getAll() {
    return this.competitionsService.getAll();
  }

  @Get('upcoming')
  async getUpcoming() {
    return this.competitionsService.getUpcoming();
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.competitionsService.getOne(id);
  }

  @Post()
  async create(
    @Body()
    data: {
      name: string;
      description?: string;
      startDate: string;
      endDate: string;
      location: string;
      vereinId: number;
    },
  ) {
    return this.competitionsService.create(
      data.name,
      data.description,
      data.startDate,
      data.endDate,
      data.location,
      data.vereinId,
    );
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      name: string;
      description?: string;
      startDate: string;
      endDate: string;
      location: string;
      vereinId: number,
    },
  ) {
    return this.competitionsService.update(
      id,
      data.name,
      data.description,
      data.startDate,
      data.endDate,
      data.location,
      data.vereinId,
    );
  }
}
