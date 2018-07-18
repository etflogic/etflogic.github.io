
function updateDetailBoxes(data){

  let html = `

        <div class="row">

          <div class="col-md-6 col-sm-6 mb-4">
            <div id="box-1"></div>
          </div>

          <div class="col-md-6 col-sm-6 mb-4">
             <div id="box-2"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-sm-6 mb-4">
             <div id="box-3"></div>
         </div>

          <div class="col-md-6 col-sm-6 mb-4">
             <div id="box-4"></div>
          </div>

        </div>
        `;
  document.getElementById('detail_boxes').innerHTML  = html;
 
  updateBoxData(data['holdings'], 1);
  updateBoxData(data['sector'],   2);
  updateBoxData(data['country'],  3);
  updateBoxData(data['factor'],   4);

 };


function updateBoxData(data,box_num){


  let tableHeaderCols = data.table_description.map(item => {
    return `<th>${item[1]}</th>`;
  }).join('');


  let tableHeaderHtml =  `
    <thead class="table_header">
      <tr>
        ${tableHeaderCols}             
      </tr>
    </thead>
  `;

  let tableBodyHtml = data.payload.map(item => {

    let tableRows = '';
    for(var i = 0; i < data.table_description.length; i++){
      if(data.table_description[i][2] === 'percent'){
       tableRows +=
         `<td class="${data.table_description[i][2]}">${formatPercent(item[data.table_description[i][0]],1)}</td>`;
      }
      else{
       tableRows +=
         `<td class="${data.table_description[i][2]}">${item[data.table_description[i][0]]}</td>`;
      }
    }

    let html = `
    <tr>
     ${tableRows}
    </tr>
    `;
    return html;
  }).join('');

  let html = `
    <h3 class="my-4">${data.table_name}</h3>
     <div class="detailed_box">
      <table class="sortable" id="table-item-${box_num}">${tableHeaderHtml}<tbody>${tableBodyHtml}</tbody></table>
    </div>  
 `;

  document.getElementById('box-'+box_num).innerHTML  = html;
};


function updateEtfHighlights(data){
  let html = `
    <ul>
      <li>${data.peer_group_suggestion}</li>
      <li>Fund Start Date: ${data.inceptiondate}</li>
      <li>Expense Ratio: ${formatPercent(data.expenseratio/100,3)}</li>
    <ul>
  `;
  document.getElementById('etf_highlights').innerHTML  = html;
}

function updateEtfDescription(data){
  let html = `
    <ul>
      <li>Issuer: ${data.issuer}</li>
      <li>Fund Type: ${data.fund_typ}</li>
      <li>Asset Class: ${data.assetclass}</li>
      <li>Geography: ${data.geography}</li>
      <li>Strategy: ${data.strategy}</li>
      <li>AUM: $${formatNumberToWords(data.aum)}</li>
    <ul>
  `;
  document.getElementById('etf_description').innerHTML  = html;
}

function updateDelayedData(){

  let url = 'https://api.iextrading.com/1.0/stock/'+globalTicker+'/quote';

  fetch(url).then(response => response.json()).then(json => {
   //console.log("We got data: " + JSON.stringify(json));

    let delayedPrice = `
      <div class='inner_delayed_price' id='inner_delayed_price'>
        <div>
          Current Price: 
          <span class="big_price">$${json.latestPrice}</span>
          <span id="colored_numbers">
          <span class="change">${formatChange(json.change,2)}</span>
          <span class="change_percent">(${formatPercentSigned(json.changePercent,2)})</span>
          </span>
        </div>
        <div>
          Latest Volume:
          <span class="latest_volume">${formatNumberToWords(json.latestVolume)}</span>
          &nbsp;ADV:
          <span class="adv">${formatNumberToWords(json.avgTotalVolume)}</span>
    
        </div>
      </div>
    `;

   let divItem = document.getElementById('outer_delayed_price');
   divItem.innerHTML  = delayedPrice;

   divItem = document.getElementById('colored_numbers');
   let rgbColor = json.changePercent > 0 ? '0,255,0' : '255,0,0';
   divItem.setAttribute('style', `color: rgba(${rgbColor}, 1)`);
  });

};

let globalTicker = null;

function formatChange(num,precision) {
  return (num>0? '+':'-')+num.toFixed(precision);
}

function formatQuote(value) {
  let options = {
    'minimumFractionDigits': 2,
    'style': 'currency',
    'currency': 'USD'
  };
  return value.toLocaleString('en', options);
}

function formatPercent(num,precision) {
  return (num* 100).toFixed(precision) + '%';
}

function formatPercentSigned(num,precision) {
  return (num>0? '+':'')+(num* 100).toFixed(precision) + '%';
}

function formatNumberToWords(marketCap) {
  let value, suffix;
  if (marketCap >= 1e12) {
    value = marketCap / 1e12;
    suffix = 'T';
  } else if (marketCap >= 1e9) {
    value = marketCap / 1e9;
    suffix = 'B';
  } else if (marketCap >= 1e6) {
    value = marketCap / 1e6;
    suffix = 'M';
  } else if (marketCap >= 1e3) {
    value = marketCap / 1e3;
    suffix = 'K';
  } else {
    value = marketCap;
    suffix = '';
  }

  let digits = value < 10 ? 1 : 0;

  if(!value) return value; // return null 

  return value.toFixed(digits) + suffix;
}


function addData(data){
      insertGridLayout(data.parent[0]);
      updateChartData(data.parent[0].ticker); 
      globalTicker = data.parent[0].ticker;

      updateDetailBoxes(data);
      updateDelayedData();
      setInterval(updateDelayedData, 15 * 1000);
};

function updateChartData(ticker) {
    let url = `https://api.iextrading.com/1.0/stock/${ticker}/chart/1y`;
    fetch(url).then(response => response.json()).then(json => {
        chartData = json;
        google.charts.setOnLoadCallback(drawChart);
    })
}

var str2date = s => {var ss = s.split('-'); return new Date(ss[0],ss[1]-1,ss[2])}; 

function drawChart() {

  var chartDiv = document.getElementById('main_chart');

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'Date');
  data.addColumn('number', "Price");

  data.addRows(
    chartData.map(item => { 
      return [str2date(item.date),item.close]
    })
  );

  var options = {
    chart: {
      title: 'Price return'
    },
    width:  '100%',
    height: 400,
    chartArea:{left:30,top:20,width:'90%',height:'80%'},
    series: {
      0: {axis: 'Price'},
    },
    axes: {
      y: {
        Price: {label: 'Price'},
      }
    },
    explorer: {
      actions: ['dragToZoom', 'rightClickToReset'],
      axis: 'horizontal',
      keepInBounds: true,
      maxZoomIn: 4.0
    },
    legend: { position: 'bottom'},
    crosshair: {}
  };

  var c = new google.visualization.LineChart(chartDiv);
  c.draw(data, options);

}




function insertGridLayout(data){

  let mainItems = `

      <div class="row">
       <div class="col-md-8">
          <h1 class="my-4">${data.ticker}
            <small>${data.fund}</small>
          </h1>
       </div>
       <div class="col-md-4">
         <div class="outer_delayed_price" id="outer_delayed_price"></div>
       </div>
      </div>

      <div class="row">

        <div class="col-md-8">
          <div id="main_chart"></div>
        </div>

        <div class="col-md-4">
          <h3 class="my-3">ETF Overview</h3>
          <div id="etf_description"></div>
          <h3 class="my-3">ETF Details</h3>
          <div id="etf_highlights"></div>
        </div>

      </div>

      <div id="detail_boxes"></div>

      <div class="row>
       <div class="col-md-12">
       <div class="powered">
        Powered By <img src="http://www.etflogic.io/wp-content/uploads/2017/05/etflogiclogo-1.png" height="50" />
        </div>
       </div>
      </div>

      `;
    document.getElementById('main_section').innerHTML  = mainItems;
    updateEtfDescription(data);
    updateEtfHighlights(data);

 };

function loadJSON(callback,file) {   
  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', file, true); 
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
         callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function loadTickerData(response) {
  addData(JSON.parse(response));
 };

function loadPageDetails() {
  if (!window.location.search) { 
      return;
  };
  let params = new URLSearchParams(window.location.search);
  for (let p of params) {
    if(p[0] === 'ticker'){
      //loadJSON(loadTickerData,'http://localhost:8000/data/'+p[1]+".json");
      loadJSON(loadTickerData,'https://sandbox.etflogic.io/poc/data/'+p[1]+".json");
    }
  }
}

$(window).resize(function(){
  drawChart();
});