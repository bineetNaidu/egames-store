import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './shared/prisma.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);
  await app.listen(process.env.PORT);
}
bootstrap();
