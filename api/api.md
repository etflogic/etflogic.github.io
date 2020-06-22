# API Guide

## Overview

This documentation serves to outline the features of a portion of ETFLogic's data API available to clients. The data API should not be accessed without prior written consent from ETFLogic. Any unauthorized access is prohibited.

This data is also provided in flat-file format for delivery (push or pull) via SFTP or AWS S3.

## Methodology

Please contact the team for detailed documentation on the methodology, calculations and data sources.

## API Server

* The Data API is RESTful and available over the internet.
* Hostname: https://data.etflogic.io/
* Stages
  * `test`, available via https://data.etflogic.io/test/
  * `prod`, available via https://data.etflogic.io/prod/
* API Keys must be provisioned manually by the ETFLogic `engineering` team. Keys are unique to the client and permission you for specific endpoints, history and ticker universe.

## Data Refresh

Data is refreshed in both `prod` and `test` APIs everyday at 0715 EST. Earlier data schedules are possible upon request. The API data refresh time is available in the [options](#functionoptions) payload.


## Main Endpoint: /?

One endpoint is provided by the data API. Calls to this endpoint are differentiated by passing query parameters:
* Multiple functions are available at the top-level path of the API
* A GET request can be made by replacing FUNCTION_NAME in this example URL:
> `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=<FUNCTION NAME>`

#### Function Overview



| Function Name | Description |
| -- | -- | 
| [options](#functionoptions) | Returns available functions and tickers. | 
| [overview](#functionoverview) | Provides general overview statistics like last close, last NAV, returns | 
| [holdings](#functionholdings) | T-1 basket holdings | 
| [distribution](#functiondistribution) | All available distributions with ex-dates | 
| [flows](#functionflows) | Fund flows time-series | 
| [premium-discount](#functionpremium-discount) | NAV vs Close Price premium and discount calculations. Related to ETF Rule 6c-11 calculations  | 
| [spreads](#functionspreads) | Median bid-ask spreads as well as other spread calculations. Related to ETF Rule 6c-11 calculations | 
| [total-return](#functiontotal-return) | Historical total return windows, as-of T-1 as well as quarter-end, looking back on multiple time-frames | 
| [basket-exposures](#functionbasket-exposures) | Basket statistics such as sector, industry, region, geography, maturity exposures. | 


#### Query Parameters

The following query parameters apply to all `function=<FUNCTION_NAME>` calls:
1. `apikey`
   * Required
   * Description: Your API Key provisions your access to the API, available tickers, endpoints and fields.
1. `function`
   * Default is `function=options`
   * Other functions are detailed below.
   * Function Names: 1 of options, overview, holdings, distribution, flows, premium-discount, spreads, total-return, basket-exposures. 
1. `date`
   * Optional
   * Format is `YYYY-MM-DD`
   * Dsecription: The as-of date of the returned data. 
   * Default: `date=<last available date>`, typically T-1
   * Functions: flows, premium-discount, spreads, total-return
1. `date_gteq`
   * Optional
   * Format is `YYYY-MM-DD`
   * Dsecription: The minimum date returned in a time-series request.
   * Functions: flows, premium-discount, spreads, total-return
1. `fields`
   * Optional
   * Description: Requires a comma-delimited string of options.
   * Example: for `function=spreads` you could pass something like `fields=ticker,asof_date,median_spread`
1. `format`
   * Optional
   * Description: changes the format of the returned data between CSV and JSON
   * Default: `format=json`
   * Options
     1. `csv`
     1. `json`
1. `ticker`
   * Optional
   * Description: You can override the default ticker list by passing in a comma-delimited list of US tickers. The default ticker list may be limited to permissions tied to your API key. 


### /?function=options

Returns available options

> Quick Start: GET request to `https://data.etflogic.io/test/?apikey=options&function=options`
* HTTP Method supported: GET


### /?function=overview
### /?function=holdings
### /?function=distribution
### /?function=performance
### /?function=flows
### /?function=premium-discount
### /?function=spreads

#### Field Definitions


| Field Key | Format | Name | Description |
| -- | -- | -- | -- |
| `ticker` | String | Exchange Ticker | This is the latest exchange ticker used to reference the data |
| `asof_date` |  YYYY-MM-DD | As-Of Date | The as-of date includes all data up to the close of this date. |
| `median_spread` | Float | Median Spread | The median spread (50th percentile) calculation as defined by the SEC's ETF Rule 6c-11.  |
| `unique_dates` | Integer | Unique Trade Dates | The number of trade dates available in a 30-day calendar lookback. |
| `sample_count` | Integer |# of 10-Second Samples | The number of ten second samples. A typical trading day has 2,340 10-second samples. |
| `p05` | Float | 5th Percentile Spread | 5% of spreads are equal to or tighter than this number. |
| `p34` | Float | 34th Percentile Spread | 34% of spreads are equal to or tighter than this number. |
| `p50` | Float | 50th Percentile Spread | Also the `median_spread`. 50% of spreads are equal to or tighter than this number.  |
| `p68` | Float | 68th Percentile Spread | 68% of spreads are equal to or tighter than this number. |
| `p95` | Float | 95th Percentile Spread | 95% of spreads are equal to or tighter than this number. |

* Spread numbers (`median_spread` and `pXX` percentile spreads) are ratios. For example, a returned number of 0.00091 would be formatted as 0.091% or 9.1bps.
* Please refer to the [SEC Final Rule](https://www.sec.gov/rules/final/2019/33-10695.pdf) for the definition of the `median_spread` calculation on page 109, footnote #369. The ETFLogic methdology document, available upon request, provides further details and clarity on this calculation.


### /?function=total-return
### /?function=basket-exposures


## Examples

You may [download an example Excel worksheet](ETFLogic_Data_API_Caller.xls ':ignore') with API calls here.


These examples use the `wget` command line tool to make requests to the API.


##### Basic Example: Obtain Latest Data

```
wget -q -O- 'https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=spreads'

```
Returns a JSON object with `spreads` array.

#####  Getting Available Options

```
wget -q -O- 'https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=options'

```
Returns a JSON object with `options` object.

#####  Selecting a specific date and fields

```
wget -q -O- 'https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=spreads&fields=asof_date,ticker,p50,p05,p95&date=20200204'

```
Returns a JSON object with `spreads` array.

#####  Getting a CSV payload


```
wget -q -O- 'https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=spreads&format=csv'

```
Returns a CSV text blob. `format=csv` is only valid for `function=spreads`.


## Errors

Some errors will return JSON with HTTP code 200. A sample error payload:

```
{
  "error": {
    "code": "date",
    "msg": "date is not one of available dates. Make a request with `function=options` to obtain all available dates. Ensure date value is formatted as YYYYMMDD."
  }
}
```


## Other Items

* CORS is enabled.
  * Howerver, the expectation is that this API is for internal use only.
  * If you will be embedding this API on public website, please alert the `engineering` team.
* Feature requests, changes, modifications are always welcome.

## Deprecated Endpoints
* [/spreads](spreads-deprecated.md "Spreads API Endpoint (deprecated)")

## Change List

* 2020.06.20 - Added multiple `function=<FUNCTION NAME` support for ETF overview, holdings, distributions, performance, flows, premium-discount, spreads, total-return and basket-exposures. 
* The /spreads endpoint was deprecated
* 2020.04.30 - Added ticker support
* 2020.02.06 - Added CSV support
