import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from 'nest-puppeteer';
// import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [], //PuppeteerModule.forRoot({ pipe: true })
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
