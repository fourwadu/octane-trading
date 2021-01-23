import querystring from 'querystring';

const SITE_BASE = 'https://rocket-league.com';

// Represents a trade on RL Garage
class RLGarageTrade {
    constructor($, tradeObj) {
        // General header information
        this.username = $(tradeObj).find('.rlg-trade__username').text();
        this.time = $(tradeObj).find('.rlg-trade__time').children().first().text();
        this.url = SITE_BASE + $(tradeObj).find('a.rlg-trade__action').attr('href');
        this.platformName = $(tradeObj).find('.rlg-trade__platformname').children().first().text().replace("Add on ", "");
        this.platformLink = $(tradeObj).find('a.rlg-trade__platform').attr('href')

        // Actual trade items
        // TODO: Assign prices based on credits
        this.hasItems = [...$(tradeObj).find('.rlg-trade__itemshas').children().map((_, e) => new RLGarageItem($, e, this.url))]
        this.wantItems = [...$(tradeObj).find('.rlg-trade__itemswants').children().map((_, e) => new RLGarageItem($, e, this.url))]

        // Assign a price to the items
        this.pricedTrade = priceItems(this.hasItems, this.wantItems);
        this.buyTrade = this.pricedTrade === 1;
        this.sellTrade = this.sellTrade === 2;

        // Footer note
        this.note = $(tradeObj).find('.rlg-trade__note').text();
    }
}

// Represents a Trade Item on RL Garage
class RLGarageItem {
    constructor($, tradeItem, tradeUrl) {
        // General item info
        this.imageUrl = SITE_BASE + $(tradeItem).find('.rlg-item__image').attr('src');
        this.name = $(tradeItem).find('.rlg-item__name').text().trim();

        // Specific info to RL Garage
        let itemParams = querystring.parse($(tradeItem).attr('href').slice(10));
        this.id = itemParams.filterItem;
        this.paint = parseInt(itemParams.filterPaint) > 0 ? itemParams.filterPaint : 'N';
        this.cert = parseInt(itemParams.filterCertification) > 0 ? itemParams.filterCertification : 'N';
        
        this.quantity = parseInt($(tradeItem).find('div.rlg-item__quantity').text().trim()) ? parseInt($(tradeItem).find('div.rlg-item__quantity').text().trim()) : 1;
        this.price = null;

        this.tradeUrl = tradeUrl;
    }

    setItemPrice(price) {
        this.price = price;
    }
}

const priceItems = (hasItems, wantItems) => {
    let hasCredits = hasItems.length === wantItems.filter(item => item.name === "Credits").length;
    let wantCredits = wantItems.length === hasItems.filter(item => item.name === "Credits").length;

    // If there are credits on both sides, just return, something weird with that trade
    if (hasCredits && wantCredits) return null;

    // Go through either hasItems or wantItems and assign the price the quantity of credits on the other side of the trade
    if (hasCredits) {
        for (let i = 0; i < hasItems.length; i++) {
            hasItems[i].setItemPrice(wantItems[i].quantity);
        }
        return 1;
    } else if (wantCredits) {
        for (let i = 0; i < wantItems.length; i++) {
            wantItems[i].setItemPrice(hasItems[i].quantity);
        }
        return 2;
    } else {
        return null;
    }
}

export default RLGarageTrade;