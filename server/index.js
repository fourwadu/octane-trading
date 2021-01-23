import { getPage, scrapeTrades, PLATFORMS, SEARCH_TYPE } from './parsing/RLGarage';

getPage({platform: PLATFORMS.PC}).then((html) => {
    console.log('Page html:', html.length);
    scrapeTrades(html);
});