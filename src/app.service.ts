import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import type { BrowserContext } from 'puppeteer';
import { InjectContext } from 'nest-puppeteer';
@Injectable()
export class AppService {
  // constructor(
  //   @InjectContext() private readonly browserContext: BrowserContext,
  // ) {}

  getHello() {
    return 'Hello';
  }

  // async test() {
  //   const page = await this.browserContext.newPage();
  //   await page.goto(`https://www.op.gg/summoner/userName=스뿡지밥`);
  //   return await page.content();
  // }

  async getLolInfo(username: string) {
    const url = `https://www.op.gg/summoner/userName=${username}`;

    try {
      const browser = await puppeteer.launch({
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: 'networkidle2',
      });

      //------------------------------------------
      const tier = [];
      const stats = [];

      const nickName = await page.evaluate(() => {
        return document.querySelector('.summoner-name').textContent;
      });

      const profile_icon = await page.$eval('.profile-icon img', (e) => e.src);

      const level = await page.evaluate(() => {
        return document.querySelector('.profile-icon span').textContent;
      });

      const tier_img = await page.$eval(
        '.css-1v663t.e1x14w4w1 img',
        (e) => e.src,
      );

      const tierstore = await page.evaluate(() => {
        const tier_tier = document.querySelector(
          '.css-1v663t.e1x14w4w1 .tier',
        ).textContent;

        const tier_lp = document.querySelector(
          '.css-1v663t.e1x14w4w1 .lp',
        ).textContent;

        const win_lose = document.querySelector(
          '.css-1v663t.e1x14w4w1 .win-lose-container',
        ).textContent;
        return { tier_tier, tier_lp, win_lose };
      });

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

      tier.push(tier_img, tierstore);
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

  async getLolChessInfo(username: string) {
    const url = `https://lolchess.gg/search?region=KR&name=jeromia`;
    //https://lolchess.gg/profile/kr/%EC%8A%A4%EB%BF%A1%EC%A7%80%EB%B0%A5
    console.log('test');
    try {
      // const browser = await puppeteer.launch();
      const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();
      await page.goto(url);

      const player_name = await page.evaluate(() => {
        return document.querySelector('.player-name').textContent;
      });

      const profile_icon = await page.$eval(
        '.profile__tier__icon img',
        (e) => e.src,
      );
      const tier = await page.evaluate(() => {
        return document.querySelector('.profile__tier__summary span')
          .textContent;
      });

      const game_count = await page.evaluate(() => {
        return document.querySelector('.profile__tier__stat__value.float-right')
          .textContent;
      });

      const recent_history = await page.$$eval(
        'profile__match-history-v2__items',
        (elements) => {
          return elements.map((e) => e.outerHTML);
        },
      );

      // const alltest = await page.evaluate(() => {
      //   return document.querySelector('profile__match-history-v2__items')
      //     .outerHTML;
      // });

      // console.log(alltest);

      return { player_name, profile_icon, tier, game_count, recent_history };
    } catch (err) {
      console.log(err);
    }
  }
}
