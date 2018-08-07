function updateDetailBoxes(data) {
    // insert layout
    let html = "";
    for (var i = 0; i < data.box_keys.length; i++) {
        html += `
          <div class="col-md-6 col-sm-6 mb-4">
            <div id="${data.box_keys[i]}"></div>
          </div>
          `;
    }
    document.getElementById("detail_boxes").innerHTML =
        '<div class="row">' + html + "</div>";

    // insert individual items in layout
    for (var i = 0; i < data.box_keys.length; i++) {
        insertItem(data[data.box_keys[i]], data.box_keys[i]);
    }
}

function generateTableHtml(data) {
    let tableHeaderCols = data.table_description
        .map(item => {
            return `<th>${item[1]}</th>`;
        })
        .join("");

    let tableHeaderHtml = `
    <thead class="table_header">
      <tr>
        ${tableHeaderCols}
      </tr>
    </thead>
  `;

    let tableBodyHtml = data.payload
        .map(item => {
            let tableRows = "";
            for (var i = 0; i < data.table_description.length; i++) {
                if (data.table_description[i][2] === "percent") {
                    tableRows += `<td class="${
            data.table_description[i][2]
          }">${formatPercent(item[data.table_description[i][0]], 1)}</td>`;
                } else {
                    tableRows += `<td class="${data.table_description[i][2]}">${
            item[data.table_description[i][0]]
          }</td>`;
                }
            }

            let html = `
    <tr>
     ${tableRows}
    </tr>
    `;
            return html;
        })
        .join("");

    let html = `
  <div class="outer-box">
              <div class="title">
                <div class="${data.icon}"></div>
                <h3>${data.box_name}</h3>
              </div>
              <table class="sortable" id="table-item-${data.box_name}">
                ${tableHeaderHtml}

                <tbody>${tableBodyHtml}</tbody>
              </table>
            </div>
 `;

    return html;
}

// value is 3-item list  (key, value, value formatter)
function formatValue(value) {
    if (value[2] === "") return value[1];
    else {
        return eval(value[2])(value[1]);
    }
}

function wrapTextInTooltip(text, tooltip) {
    if (tooltip === undefined || tooltip === "") return text;
    else {
        return `
      <a href="#" data-toggle="tooltip" title="${tooltip}">
        ${text}
      </a>
      `;
    }
}

function generateInfoHtml(data) {
    let list = ``;
    for (var i = 0; i < data.payload.length; i++) {
        list += `
      <tr>
        <th scope="row">${wrapTextInTooltip(data.payload[i][0], data.payload[i][3])}</th>
        <td>${formatValue(data.payload[i])}</td>
      </tr>`;
    }

    let html = `
    <div class="outer-box">
                <div class="title title-top">
                  <div class="${data.icon}"></div>
                  <h3>${data.box_name}</h3>
                </div>
                <table class="table table-hover">
                <tbody>${list}</tbody>
              </table>
              </div>

    `;

    return html;
}

function insertItem(data, id) {
    let html = ``;
    if (data.box_type === "info") {
        html = generateInfoHtml(data);
    } else if (data.box_type === "table") {
        html = generateTableHtml(data);
    }
    var loc = document.getElementById(id);
    if (loc) loc.innerHTML = html;
}

function updateDelayedData() {
    let url = "https://api.iextrading.com/1.0/stock/" + globalTicker + "/quote";

    fetch(url)
        .then(response => response.json())
        .then(json => {
            let delayedPrice = `
      <div class='inner_delayed_price' id='inner_delayed_price'>
        <div>
          Current Price:
          <span class="big_price">$${json.latestPrice}</span>
          <span id="colored_numbers">
          <span class="change">${formatChange(json.change, 2)}</span>
          <span class="change_percent">(${formatPercentSigned(
            json.changePercent,
            2
          )})</span>
          </span>
        </div>
        <div>
          Latest Volume:
          <span class="latest_volume">${formatNumberToWords(
            json.latestVolume
          )}</span>
          &nbsp;ADV:
          <span class="adv">${formatNumberToWords(json.avgTotalVolume)}</span>

        </div>
      </div>
    `;

            let divItem = document.getElementById("outer_delayed_price");
            divItem.innerHTML = delayedPrice;

            divItem = document.getElementById("colored_numbers");
            let rgbColor = json.changePercent > 0 ? "0,255,0" : "255,0,0";
            divItem.setAttribute("style", `color: rgba(${rgbColor}, 1)`);
        });
}

let globalTicker = null;

function addData(data) {
    insertGridLayout(data);
    updateChartData(data.etf_ticker);
    globalTicker = data.etf_ticker;

    updateDetailBoxes(data);
    updateDelayedData();
    setInterval(updateDelayedData, 15 * 1000);
}

function updateChartData(ticker) {
    let url = `https://api.iextrading.com/1.0/stock/${ticker}/chart/1y`;
    fetch(url)
        .then(response => response.json())
        .then(json => {
            chartData = json;
            google.charts.setOnLoadCallback(drawChart);
        });
}

var str2date = s => {
    var ss = s.split("-");
    return new Date(ss[0], ss[1] - 1, ss[2]);
};

function drawChart() {
    var chartDiv = document.getElementById("main_chart");

    var data = new google.visualization.DataTable();
    data.addColumn("date", "Date");
    data.addColumn("number", "Price");

    data.addRows(
        chartData.map(item => {
            return [str2date(item.date), item.close];
        })
    );

    var options = {
        chart: {
            title: "Price return"
        },
        width: "100%",
        height: 400,
        chartArea: {
            left: 30,
            top: 20,
            width: "90%",
            height: "80%"
        },
        series: {
            0: {
                axis: "Price"
            }
        },
        axes: {
            y: {
                Price: {
                    label: "Price"
                }
            }
        },
        explorer: {
            actions: ["dragToZoom", "rightClickToReset"],
            axis: "horizontal",
            keepInBounds: true,
            maxZoomIn: 4.0
        },
        legend: {
            position: "bottom"
        },
        crosshair: {}
    };

    var c = new google.visualization.LineChart(chartDiv);
    c.draw(data, options);
}

function insertGridLayout(data) {
    let mainItems = `
  <div class="row row-eq-height">
    <div class="col-md-8">
      <h1>${data.etf_ticker}
        <small>${data.etf_name}</small>
      </h1>
      <div class="outer_delayed_price" id="outer_delayed_price"></div>
    </div>

    <div class="col-md-4 powered">
      Powered By &nbsp; <img src="images/etflogic_logo.png" height="50">
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-8">
      <div id="main_chart"></div>
    </div>
    <div class="col-md-4">
      <div id="info1">
        <div class="title title-top">
          <div class="icon-info"></div>
          <h3>ETF Overview</h3>
        </div>
        <div id="etf_description"></div>
      </div>
      <br />
      <div id="info2">
        <div class="title title-top">
          <div class="icon-cog"></div>
          <h3>ETF Details</h3>
        </div>
        <div id="etf_highlights"></div>
      </div>
    </div>
  </div>
  <div class="row row-eq-height" id="detail_boxes"></div>
      `;
    document.getElementById("main_section").innerHTML = mainItems;
    insertItem(data["info1"], "info1");
    insertItem(data["info2"], "info2");
}

function loadJSON(callback, file) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", file, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadTickerData(response) {

  response = JSON.parse(response);
  if(response === null){

  }
  addData(response);

 };

function loadPageDetails() {
    if (!window.location.search) {
        return;
    }
    let params = new URLSearchParams(window.location.search);
    for (let p of params) {
        if (p[0] === "ticker") {
            //loadJSON(loadTickerData,'http://localhost:8000/data/'+p[1]+".json");
            loadJSON(
                loadTickerData,
                "https://sandbox.etflogic.io/poc/data/" + p[1] + ".json"
            );
        }
    }
}



function tickerSearchInit(){
    var tickerSearch = new Bloodhound({
        datumTokenizer: function (datum) {
            return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            ajax: {
              jsonp: 'callback',
              dataType: 'jsonp'
            },
            wildcard: '%QUERY',
            url: 'https://f4sw9lx0u5.execute-api.us-west-2.amazonaws.com/test/find?ticker=%QUERY',
            transform: function (response) {
                console.log("We got a response: "  + JSON.stringify(response));
                // Map the remote source JSON array to a JavaScript object array
                return $.map(response, function (ticker) {
                    return {
                        value: ticker.ticker
                    };
                });
            }
        }
    });

  $('#remote .typeahead').typeahead(null, {
      display: 'value',
      source: tickerSearch
  });

  tickerSearch.initialize();  

}

window.addEventListener("resize", drawChart);
