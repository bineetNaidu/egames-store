import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import {
  GameResponseDto,
  DeleteGameResponseDto,
  GamesResponseDto,
} from './dto/games.response-dto';
import { Prisma } from '@prisma/client';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getAllGames(): Promise<GamesResponseDto> {
    const games = await this.prisma.game.findMany({
      include: {
        category: true,
      },
    });
    return { games };
  }

  // WORK IN PROGRESS!
  async getAllNewGames(): Promise<GamesResponseDto> {
    const games = await this.prisma.game.findMany({
      where: {
        created_at: {
          gt: new Date(
            new Date().getTime() - 24 * 60 * 60 * 1000 * 7,
          ).toISOString(), // 7 days ago
        },
      },
      include: {
        category: true,
      },
    });
    return { games };
  }

  async createGame(createGameDto: CreateGameDto): Promise<GameResponseDto> {
    const dto = createGameDto.data;
    if (!dto.name) {
      throw new BadRequestException({
        errors: [
          {
            field: 'name',
            message: 'Game name is required',
          },
        ],
      });
    }
    const existingGame = await this.prisma.game.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existingGame) {
      throw new ConflictException({
        errors: [
          {
            field: 'name',
            message: 'Game with this name already exists',
          },
        ],
      });
    }

    const game = await this.prisma.game.create({
      data: {
        name: dto.name,
        details: dto.details,
        game_size: dto.game_size,
        info: dto.info,
        price: dto.price,
        thumbnail: dto.thumbnail,
        images: dto.images,
        tags: dto.tags,
        is_available: dto.is_available ? dto.is_available : true,
        category: dto.category_id
          ? { connect: { id: dto.category_id } }
          : {
              create: {
                name: dto.category.name,
              },
            },
      },
    });
    return { game };
  }

  async getGame(id: number): Promise<GameResponseDto> {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { game };
  }

  async updateGame(
    id: number,
    updateGameDto: Prisma.GameUpdateArgs,
  ): Promise<GameResponseDto> {
    const dto = updateGameDto.data;

    const game = await this.prisma.game.update({
      where: {
        id,
      },
      data: dto,
    });

    return { game };
  }

  async deleteGame(id: number): Promise<DeleteGameResponseDto> {
    const game = await this.prisma.game.delete({
      where: {
        id,
      },
    });

    return {
      game: {
        deletedGameId: game.id,
        deleted: true,
      },
    };
  }
}
