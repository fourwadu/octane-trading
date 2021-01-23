const { getPage, scrapeTrades, PLATFORMS, SEARCH_TYPE } = require('./parsing/rlGarage');

getPage({platform: PLATFORMS.PC}).then((html) => {
    console.log('Page html:', html.length);
    scrapeTrades(html);
});