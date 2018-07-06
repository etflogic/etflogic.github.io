
// Creator: ETFLogic 2018
// Provided under MIT License
// 

function formatCurrency(value,precision) {
  let options = {
    'minimumFractionDigits': precision,
    'style': 'currency',
    'currency': 'USD'
  };
  return value.toLocaleString('en', options);
}

function formatPercent(num,precision) {
  return (num* 100).toFixed(precision) + '%';
}

function showhide(id,shouldShow) {
	var e = document.getElementById(id);
	//e.style.display = (e.style.display == 'block') ? 'none' : 'block';
	e.style.display = (!shouldShow) ? 'none' : 'block';
};

function addTradingInfoHtml(){

  let tradingInfoHtml = ` 	

  	     <div class="etf_calc_overview">
		 <div class="center_tight">

		  <h1 class="italicize centerize"> Exchange-Traded Fund Trading Information and Related Costs </h1>

		  <h3 class="italicize">What information do I need to know about how the Exchange-Traded Fund
		  ("<t id="output_ticker"></t>") trades?</h3>

			  <div class="answers">
			  Individual shares of an ETF may only be bought and sold in the
			  secondary market through a broker or dealer at a market price. The market
			  price can change throughout the day due to the supply of and demand
			  for ETF shares, and changes in the value of the Fund’s underlying
			  investments, among other reasons. Because ETF shares trade at market
			  prices rather than net asset value, shares may trade at a price greater than
			  net asset value (premium) or less than net asset value (discount).
			  </div>

		  <h3 class="italicize">What costs are associated with trading shares of an ETF?</h3>
			  <div class="answers">

			  An investor may incur costs when buying or selling shares on an
			  exchange that are in addition to the costs described above. Examples
			  include brokerage commissions, costs attributable to the bid-ask spread,
			  and costs attributable to premiums and discounts.
			  </div>

		  <h3 class="italicize">What is the bid-ask spread?</h3>
			  <div class="answers">

			  The bid-ask spread is the difference between the highest price a buyer is
			  willing to pay to purchase shares of the Fund (bid) and the lowest price a
			  seller is willing to accept for shares of the Fund (ask). The bid-ask
			  spread can change throughout the day due to the supply of or demand
			  for ETF shares, the quantity of shares traded, and the time of day the
			  trade is executed, among other factors. For the ETF’s most recent fiscal
			  year ended <t id="output_fiscal_year"></t>, the median bid-ask spread was <br/>
			  <t id="output_median_ba" class="box_it"> </t>.
			  </div>

		  <h3 class="italicize">How does the bid-ask spread impact my return on investment?</h3>
			  <div class="answers">

			  The impact of the bid-ask spread depends on your trading practices. For
			  example, based on the ETF’s fiscal year-end data, purchasing <t class="output_trade_size"></t>
			  worth of ETF shares and then immediately thereafter selling <t class="output_trade_size"></t>
			  worth of ETF shares (i.e., a “ round-trip”), your cost, in dollars, would be
			  as follows:
			  <br/><br/>

			  <div class="enbolden"> For a SINGLE round-trip (each trade being <t class="output_trade_size"></t>) </div><br/>
			  Assuming mid-range spread cost: <t id="output_cost_mid" class="output_cost"></t> <br/>
			  <hr/>
			  Assuming high-end spread cost: <t id="output_cost_high" class="output_cost"></t> <br/>
			  <hr class="hr_thick"/>

			  </div>

		  <h3 class="italicize">But what if I plan to trade ETF shares frequently?</h3>
			  <div class="answers">

			  Based on the ETF’s most recent fiscal year-end data, completing <t class="output_roundtrips"></t>
			  round-trips of <t class="output_trade_size"></t> each, your cost, in dollars, would be as follows: <br/><br/>
			  <div class="enbolden"> 
			  For <t class="output_roundtrips"></t> round-trips (each trade being  <t class="output_trade_size"></t>)</t></div><br/>
			  Mid-range spread cost: <t id="output_cost_rt_mid" class="output_cost"></t> </br>
			  <hr/>
			  High-end spread cost: <t id="output_cost_rt_high" class="output_cost"></t> </br>
			  <hr class="hr_thick"/>
			  </div>

		  <h3 class="italicize">Where can I get more trading information for the ETF?</h3>
			  <div class="answers">

			  The ETF’s website at [www.[Series-SpecificLandingPage.com]]
			  includes recent information on the Fund’s net asset value, market price,
			  premiums and discounts, as well as an interactive calculator you can use
			  to determine how the bid-ask spread would impact your specific
			  investment.
			  </div>
		  </div>
		  </div>
		  </div>
  `;
  document.getElementById('etf_calc_info').innerHTML  = tradingInfoHtml;

};

function doCalc(){
	//showhide("etf_calc_info",false);

	document.getElementById('etf_calc_info').innerHTML = ``;
	var ticker = document.getElementById('input_ticker').value.trim().toUpperCase();
	var input_trade_size = parseFloat(document.getElementById('input_trade_size').value);
	var input_roundtrips = parseFloat(document.getElementById('input_roundtrips').value);

	if(ticker === ''){
		document.getElementById('error_message').innerHTML = `Please enter a known ETF Ticker`;
		return;
	}

	if(input_trade_size > 1e9 || input_trade_size < 100){
	    document.getElementById('error_message').innerHTML = `Trade Size should be between $100 and $1bn`;
		return;
	}

	if(input_roundtrips > 10000 || input_roundtrips < 2){
	    document.getElementById('error_message').innerHTML = `Roundtrip times should be betwen 2 and 10000 `;
		return;	
	}

	var spreadData = getSpreads(ticker);
	//console.log("show: " + JSON.stringify(spreadData));
	if("ba_median" in spreadData){
		document.getElementById('error_message').innerHTML = ``;
		//showhide("etf_calc_info",true);
		addTradingInfoHtml();
	}
	else{
		document.getElementById('error_message').innerHTML = `Ticker ${ticker} not found`;
		return;
	}

	document.getElementById('output_ticker').innerHTML = ticker;
	document.getElementById('output_fiscal_year').innerHTML = `2017`;	
	document.getElementById('output_median_ba').innerHTML = `${formatPercent(spreadData.ba_median,3)}`;

	var nodes = document.getElementsByClassName('output_trade_size');
	var input_trade_size_string = formatCurrency(parseFloat(input_trade_size),0);
	for (var i = 0, len = nodes.length; i < len; i++) {
	    nodes[i].innerHTML = input_trade_size_string;
	};			

	var nodes = document.getElementsByClassName('output_roundtrips');
	for (var i = 0, len = nodes.length; i < len; i++) {
	    nodes[i].innerHTML = `${input_roundtrips}`;
	};	


	document.getElementById('output_cost_mid').innerHTML 
		= `${formatCurrency(spreadData.ba_midrange*input_trade_size*2,2)}`;
	document.getElementById('output_cost_high').innerHTML 
		= `${formatCurrency(spreadData.ba_p95*input_trade_size*2,2)}`;

	document.getElementById('output_cost_rt_mid').innerHTML 
		= `${formatCurrency(spreadData.ba_midrange*input_trade_size*2*input_roundtrips,2)}`;
	document.getElementById('output_cost_rt_high').innerHTML 
		= `${formatCurrency(spreadData.ba_p95*input_trade_size*2*input_roundtrips,2)}`;

};

function getSpreads(ticker){
		for(var i=0; i< SPREAD_DATA.length; i++){
			if(SPREAD_DATA[i].ticker === ticker)
				return SPREAD_DATA[i];
		}
		return {'ticker':ticker, error:true};
};

