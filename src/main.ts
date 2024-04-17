import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
    const logger = new Logger('bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const port = process.env.PORT;
    await app.listen(port);
    logger.log(`API running on port ${port}`);
}
bootstrap();
