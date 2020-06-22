
# Deprecated APIs

* The following API endpoints are deprecated. This means that they will continue be supported in the near term. However, we encourage the use of the `function=<FUNCTION NAME>` query paramter GET method detailed in the API guide.


### /spreads

The median spread calculation is provided using the calculation specified per regulatory requirements.

#### Overview
> Quick Start: Make a call to `https://data.etflogic.io/test/spreads?apikey=<YourAPIKey>`

* HTTP Method supported: GET

* Note: This endpoint can also be called using the top-level endpoint: `https://data.etflogic.io/test/? function=spreads?apikey=<YourAPIKey>`

#### Query Parameters
1. `apikey`
   * Required
   * Description: Your API Key permits you access to the API for a particular set of tickers, endpoints and features.
1. `date`
   * Optional
   * Dsecription: The as-of date of the returned data. Up to two months of history are available.
   * Default: `date=<last available date>`
1. `fields`
   * Optional
   * Description: Requires a comma-delimited string of options.
   * Default: `fields=ticker,asof_date,median_spread`
   * Options: See [field definitions](#Field-Definitions) below...
1. `format`
   * Optional
   * Description: changes the format of the returned data between CSV and JSON
   * Default: `format=json`
   * Options
     1. `csv`
     1. `json`
1. `function`
   * Optional
   * Description: Passing in `function=options` provides a way to see all available options to the API, including dates, columns and tickers.
   * Default: `function=spreads`
   * Options:
     1. `spreads`
     1. `options`
1. `ticker`
   * Optional
   * Description: You can override the default ticker list by passing in a comma-delimited list of US tickers. The default ticker list will typically be tied to a particular ETF Issuer. 