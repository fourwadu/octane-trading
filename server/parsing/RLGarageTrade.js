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
        this.hasItems = $(tradeObj).find('.rlg-trade__itemshas').children().map((_, e) => new RLGarageItem($, e))
        this.wantItems = $(tradeObj).find('.rlg-trade__itemswants').children().map((_, e) => new RLGarageItem($, e))

        // Assign a price to the items
        this.pricedTrade = priceItems(this.hasItems, this.wantItems)

        // Footer note
        this.note = $(tradeObj).find('.rlg-trade__note').text();
    }
}

// Represents a Trade Item on RL Garage
class RLGarageItem {
    constructor($, tradeItem) {
        // General item info
        this.imageUrl = SITE_BASE + $(tradeItem).find('.rlg-item__image').attr('src');
        this.name = $(tradeItem).find('.rlg-item__name').text().trim();

        // Specific info to RL Garage
        let itemParams = querystring.parse($(tradeItem).attr('href').slice(10));
        this.id = itemParams.filterItem;
        this.paint = itemParams.filterPaint;
        this.certification = itemParams.filterCertification;
        
        this.quantity = parseInt($(tradeItem).find('div.rlg-item__quantity').text().trim()) ? parseInt($(tradeItem).find('div.rlg-item__quantity').text().trim()) : 1;
        this.price = null;
    }

    setItemPrice(price) {
        this.itemPrice = price;
    }
}

priceItems = (hasItems, wantItems) => {
    let hasCredits = hasItems.length === wantItems.filter((_, item) => item.name === "Credits").length;
    let wantCredits = wantItems.length === hasItems.filter((_, item) => item.name === "Credits").length;

    // If there are credits on both sides, just return, something weird with that trade
    if (hasCredits && wantCredits) return false;

    // Go through either hasItems or wantItems and assign the price the quantity of credits on the other side of the trade
    if (hasCredits) {
        for (let i = 0; i < hasItems.length; i++) {
            hasItems[i].setItemPrice(wantItems[i].quantity);
        }
        return true
    } else if (wantCredits) {
        for (let i = 0; i < wantItems.length; i++) {
            wantItems[i].setItemPrice(hasItems[i].quantity);
        }
        return true;
    } else {
        return false;
    }
}

export default RLGarageTrade;