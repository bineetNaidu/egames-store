import {
  Controller,
  Body,
  ParseIntPipe,
  Param,
  Get,
  Put,
  Delete,
  Post,
  HttpCode,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { Prisma } from '@prisma/client';
import {
  DeleteGameResponseDto,
  GameResponseDto,
  GamesResponseDto,
} from './dto/games.response-dto';
import type { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getAllGames(): Promise<GamesResponseDto> {
    return await this.gamesService.getAllGames();
  }

  @Get('new_games')
  @HttpCode(200)
  async getAllNewGames(): Promise<GamesResponseDto> {
    return await this.gamesService.getAllNewGames();
  }

  @Post('create')
  @HttpCode(201)
  async createGame(
    @Body() createGameDto: CreateGameDto,
  ): Promise<GameResponseDto> {
    return await this.gamesService.createGame(createGameDto);
  }

  @Get(':id')
  async getGame(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GameResponseDto> {
    return await this.gamesService.getGame(id);
  }

  @Put(':id/update')
  @HttpCode(200)
  async updateGame(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameDto: Prisma.GameUpdateArgs,
  ): Promise<GameResponseDto> {
    return await this.gamesService.updateGame(id, updateGameDto);
  }

  @Delete(':id/delete')
  @HttpCode(200)
  async deleteGame(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteGameResponseDto> {
    return await this.gamesService.deleteGame(id);
  }
}
