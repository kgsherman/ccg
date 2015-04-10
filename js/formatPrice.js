var numberFormat = require('underscore.string/numberFormat');

var formatPrice = function (priceObject, currency, vat) {
	var priceSymbol = (function () {
		switch (currency) {
			case 'usd': return '$';
			case 'eur': return '€';
			case 'gbp': return '£';
			default: return '$';
		}
	})();
	var hasPrice = (typeof priceObject[currency] == 'number');
	var priceFormatted;
	if (hasPrice) {
		var priceRaw = priceObject[currency] * (1 + vat / 100);
		if (priceRaw.toFixed(0) == priceRaw) {
			priceFormatted = currency == 'eur' ?
				numberFormat(priceRaw, 0, ',', '.')
				:
				numberFormat(priceRaw, 0, '.', ',');
		} else {
			priceFormatted = currency == 'eur' ?
				numberFormat(priceRaw, 2, ',', '.')
				:
				numberFormat(priceRaw, 2, '.', ',');
		}
	} else {
		priceFormatted = '---';
	}
	return priceSymbol + priceFormatted;
}

module.exports = formatPrice;