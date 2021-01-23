const cheerio = require('cheerio');
const axios = require('axios');
const querystring = require('querystring');

const RLGarageTrade = require('./RLGarageTrade');

const RL_GARAGE_URL = 'https://rocket-league.com/trading';

// "Enums"
const PLATFORMS = {
    PC: 1,
    Playstation: 2,
    Xbox: 3,
    Nintendo: 4
}
const SEARCH_TYPE = {
    Any: 0,
    Want: 1,
    Have: 2
}

// Fetches the RL Garage and returns the HTML of the site based on parameters
const getPage = async ({ platform=PLATFORMS.PC, search_type=SEARCH_TYPE.Any, item=0, minCredits=0, maxCredits=100000 } = {}) => {
    const queryData = querystring.stringify({
        'filterItem': item,
        'filterMinCredits': minCredits,
        'filterMaxCredits': maxCredits,
        'filterPlatform[]': platform,
        'filterSearchType': search_type
    });
    const tradeUrl = `${RL_GARAGE_URL}?${queryData}`;

    try {
        var response = await axios.get(tradeUrl);
        return response.data;
    } catch (err) {
        return null;
    }
}

// Scrapes trades from the page HTML
const scrapeTrades = (pageHTML) => {
    const $ = cheerio.load(pageHTML);
    let trades = $('.rlg-trade').map((_, e) => new RLGarageTrade($, e))

    return trades;
}

module.exports = { getPage, scrapeTrades, PLATFORMS, SEARCH_TYPE }