
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

function doCalc(){
		var ticker = document.getElementById('input_ticker').value;
		var input_trade_size = document.getElementById('input_trade_size').value;
		var input_roundtrips = document.getElementById('input_roundtrips').value;


	var spreadData = getSpreads(ticker);
	if("error" in spreadData) 
		showhide("etf_calc_info",false);
	else showhide("etf_calc_info",true);

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

