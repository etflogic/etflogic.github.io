function formatChange(num, precision) {
  return (num > 0 ? "+" : "-") + num.toFixed(precision);
}

function formatQuote(value) {
  let options = {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "USD"
  };
  return value.toLocaleString("en", options);
}

function formatPercent_2decimal(num) {
  return formatPercent(num, 2);
}

function formatPercent_3decimal(num) {
  return formatPercent(num, 3);
}

function formatPercent(num, precision) {
  return (num * 100).toFixed(precision) + "%";
}

function formatPercentSigned(num, precision) {
  return (num > 0 ? "+" : "") + (num * 100).toFixed(precision) + "%";
}

function formatPriceToWords(num) {
  // assumes positive price
  return "$" + formatNumberToWords(num);
}

function formatNumberToWords(num) {
  let value, suffix;
  if (num >= 1e12) {
    value = num / 1e12;
    suffix = "T";
  } else if (num >= 1e9) {
    value = num / 1e9;
    suffix = "B";
  } else if (num >= 1e6) {
    value = num / 1e6;
    suffix = "M";
  } else if (num >= 1e3) {
    value = num / 1e3;
    suffix = "K";
  } else {
    value = num;
    suffix = "";
  }

  let digits = value < 10 ? 1 : 0;

  if (!value) return value; // return null

  return value.toFixed(digits) + suffix;
}

function createTickerLinks(ticker_list) {
  let html = ``;
  for (var i = 0; i < ticker_list.length; i++) {
    html += `<a href="index.html?ticker=${ticker_list[i]}">${
      ticker_list[i]
    }</a> `;
  }
  return html;
}
