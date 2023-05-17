import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //소환자명 검색
  @Get('crawling')
  async performCrawling() {
    const username = '씩씩하구';
    const url = `https://www.op.gg/summoner/userName=${username}`;

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      //----------------------------------------
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      //------------------------------------------
      const tier = [];
      const stats = [];

      const nickName = $('h1').text(); //스뿡지밥
      // const profile_icon = $('.profile-icon img').toString(); //프로필 아이콘
      //<img src=\"https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon4568.jpg?image=q_auto,f_png,w_auto&amp;v=1684225762498\" alt=\"profile image\">
      const profile_icon = $('.profile-icon img').attr('src');
      //https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon4568.jpg?image=q_auto,f_png,w_auto&v=1684225762498
      const level = $('.profile-icon span').text(); //레벨
      // const tier = $('.css-1v663t.e1x14w4w1').toString();
      const tier_img = $('.css-1v663t.e1x14w4w1 img').attr('src');
      const tier_tier = $('.css-1v663t.e1x14w4w1 .tier').text();
      const tier_lp = $('.css-1v663t.e1x14w4w1 .lp').text();
      const win_lose = $('.css-1v663t.e1x14w4w1 .win-lose-container').text();
      // const recent = $('.css-3i6n1d.ehasqiv3').text(); //<--얘는 안됨
      const stats_win_lose = await page.evaluate(() => {
        return document.querySelector('.css-3i6n1d.ehasqiv3 .stats .win-lose')
          .textContent;
      });
      const stats_kda = await page.evaluate(() => {
        return document.querySelector('.css-3i6n1d.ehasqiv3 .stats .k-d-a')
          .textContent;
      });
      const stats_ratio = await page.evaluate(() => {
        return document.querySelector('.css-3i6n1d.ehasqiv3 .stats .ratio')
          .textContent;
      });
      const stats_kill_participantion = await page.evaluate(() => {
        return document.querySelector(
          '.css-3i6n1d.ehasqiv3 .stats .kill-participantion',
        ).textContent;
      });

      const stats_img = await page.$('.css-3i6n1d.ehasqiv3 .stats svg');

      const stats_img_tag = await page.evaluate(
        (stats_img) => stats_img.outerHTML,
        stats_img,
      );

      const recent_history = await page.$$eval(
        '.css-1qq23jn.e1iiyghw3',
        (elements) => {
          return elements.map((e) =>
            e.outerHTML.split('<li class="css-1qq23jn e1iiyghw3">'),
          );
        },
      );

      //<li class=\"css-1qq23jn e1iiyghw3\"> 기준으로 잘라서 배열에 넣기

      tier.push(tier_img, tier_tier, tier_lp, win_lose);
      stats.push(
        stats_win_lose,
        stats_kda,
        stats_ratio,
        stats_kill_participantion,
        stats_img_tag,
      );
      await browser.close();
      return {
        nickName,
        profile_icon,
        level,
        //--profile
        tier,
        //------tier
        stats,
        //------stats
        recent_history,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
