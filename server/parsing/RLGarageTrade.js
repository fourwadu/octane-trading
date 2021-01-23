const querystring = require('querystring')

// Represents a trade on RL Garage
class RLGarageTrade {
    constructor($, tradeObj) {
        // General header information
        this.username = $(tradeObj).find('.rlg-trade__username').text();
        this.tradeTime = $(tradeObj).find('.rlg-trade__time').children().first().text();
        this.platformName = $(tradeObj).find('.rlg-trade__platformname').children().first().text().replace("Add on ", "");
        this.platformLink = $(tradeObj).find('a.rlg-trade__platform').attr('href')

        // Actual trade items
        // TODO: Assign prices based on credits
        this.hasItems = $(tradeObj).find('.rlg-trade__itemshas').children().map((_, e) => new RLGarageItem($, e))
        this.wantItems = $(tradeObj).find('.rlg-trade__itemswants').children().map((_, e) => new RLGarageItem($, e))

        // Footer not
        this.tradeNote = $(tradeObj).find('.rlg-trade__note').text();
    }
}

// Represents a Trade Item on RL Garage
class RLGarageItem {
    constructor($, tradeItem) {
        // General item info
        this.itemImageUrl = 'https://rocket-league.com' + $(tradeItem).find('.rlg-item__image').attr('src');
        this.itemName = $(tradeItem).find('.rlg-item__name').text();

        // Specific info to RL Garage
        let itemParams = querystring.parse($(tradeItem).attr('href').slice(10));
        this.itemId = itemParams.filterItem;
        this.itemPaint = itemParams.filterPaint;
        this.itemCertification = itemParams.filterCertification;
    }
}

module.exports = RLGarageTrade