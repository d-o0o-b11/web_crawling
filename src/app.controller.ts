import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
    const username = '스뿡지밥';
    const url = `https://www.op.gg/summoner/userName=${username}`;

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const tier = [];

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
      const recent = $('.css-150oaqg.e1shm8tx0').toString();

      tier.push(tier_img, tier_tier, tier_lp, win_lose);

      return {
        nickName,
        profile_icon,
        level,
        //--profile
        tier,
        //------tier
        recent,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
