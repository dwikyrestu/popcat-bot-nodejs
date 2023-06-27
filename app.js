const puppeteer = require('puppeteer');
const url = require('url');

(async () => {
  var totalCount = 0;

  const browser = await puppeteer.launch({
    headless: true
  });

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');

  await page.goto('https://popcat.click/');

  page.on("response", async (response) => {

    if (response.url().includes("pop_count")) {

        const urlString = await response.url();
        const parsedUrl = new URL(urlString);
        const popCount = parsedUrl.searchParams.get('pop_count');

        if((await response.text()).includes("429")){
          console.log(await response.text());
        }else{
          totalCount = totalCount+parseInt(popCount);
          console.log(`Total Count : ${totalCount}, Req Count : ${popCount}`)
        } 
    }

  });

  setInterval(async () => {
    await page.click('div.cat-img');
  }, 50);

})();