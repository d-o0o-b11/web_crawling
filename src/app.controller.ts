import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
// import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('/test')
  // getTest() {
  //   return this.appService.test();
  // }

  //소환자명 검색
  @Get('crawling/lol')
  async performCrawling() {
    return await this.appService.getLolInfo('씩씩하구');
  }

  @Get('crawling/lolchess')
  async lolChessCrawling() {
    return await this.appService.getLolChessInfo('씩씩하구');
  }
}
