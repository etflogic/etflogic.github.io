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
   * Description: The as-of date of the returned data. 
   * Default: `date=<last available date>`, typically T-1
   * Functions: flows, premium-discount, spreads, total-return
1. `date_gteq`
   * Optional
   * Format is `YYYY-MM-DD`
   * Description: The minimum date returned in a time-series request.
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

Returns:
1. A list of available `functions`
1. A list of permissioned tickers
1. The last time the API was updated - typically around 7AM EST.

> Quick Start: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=options`
* HTTP Method supported: GET


### /?function=overview

Returns a wide range of datapoints and statistics for the permissioned tickers. 
> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=overview`

A sampling of fields returned from this function is in the table below. Note that fields can be constrained by sending a comma-delimited list of items to a `fields` query-parameter. For example:  `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=overview&fields=ticker,median_spread_6c11`

The `function=overview` provides the latest information available for each data point. Some fields have historical timeseries available, namely the spread and premium-discount calculations. Please refer to the respective functions below.


| Field Name                                     | Example                         | Format    | Explanation                                             |
|------------------------------------------------|---------------------------------|-----------|---------------------------------------------------------|
| ticker                                         | ABCD                            | varchar   |                                                         |
| isin                                           | US123456789A                    | varchar   |                                                         |
| cusip                                          | 123456789                       | varchar   |                                                         |
| mic                                            | BATS                            | varchar   |                                                         |
| figi                                           | BBG000000000                    | varchar   |                                                         |
| figi_composite                                 | BBG000000001                    | varchar   |                                                         |
| primary_exchange                               | Cboe BZX U.S. Equities Exchange | varchar   |                                                         |
| fund_name                                      | The ABCD Fund                   | varchar   |                                                         |
| issuer                                         | Fund Advisors Inc.              | varchar   |                                                         |
| assetclass                                     | Equity                          | varchar   |                                                         |
| expenseratio                                   | 0.005                           | float     |                                                         |
| inceptiondate                                  | 2020-01-05                      | date      | YYYY-MM-DD                                              |
| dividendyield                                  | 0.03                            | float     |                                                         |
| fundamentals_pe_ratio                          | 15.12313                        | float     |                                                         |
| fundamentals_pb_ratio                          | 5.1231                          | float     |                                                         |
| iopv_ticker                                    |                                 | varchar   |                                                         |
| index_fullname                                 | The ABCD Index                  | varchar   |                                                         |
| related_index_ticker                           | ABCDIDX                         | varchar   |                                                         |
| asof_date                                      | 2020-07-04                      | date      | YYYY-MM-DD                                              |
| nav                                            | 34.93873                        | float     | Latest NAV as of the asof_date                          |
| shout                                          | 15400000                        | float     | Shares Outstanding                                      |
| aum                                            | 538056500                       | float     | Latest Assets Under Management of the ETF               |
| lastclose                                      | 35.94                           | float     |                                                         |
| lastvolume                                     | 91322                           | float     |                                                         |
| adv20                                          | 100953.4                        | float     | 20-Day Average Daily Volume                             |
| vol20                                          | 0.008708588                     | float     | 20-Day Volatility, Daily (non-annualized)               |
| mom20                                          | -0.000556328                    | float     | 20-Day Momentum                                         |
| last_market_close_date                         | 2020-07-04                      | date      | YYYY-MM-DD                                              |
| fundamentals_px_to_fcf_ratio                   |                                 | float     | For US Equity Baskets                                   |
| fundamentals_px_to_sales                       |                                 | float     | For US Equity Baskets                                   |
| fundamentals_ebitda_margin                     |                                 | float     | For US Equity Baskets                                   |
| fundamentals_payout_ratio                      |                                 | float     | For US Equity Baskets                                   |
| gross_expense_ratio                            |                                 | float     |                                                         |
| sec_yield_30day                                |                                 | float     |                                                         |
| net_expense_ratio                              | 0.0048                          | float     |                                                         |
| standard_deviation_annualized                  | 0.2159184                       | float     |                                                         |
| standard_deviation_month_count                 | 12                              | float     |                                                         |
| standard_deviation_last_month                  | 2020-01                         | date      | YYYY-MM                                                 |
| pd_range                                       | quarter                         | varchar   | Premium Discount Summary Stats, lookback                |
| pd_range_end_date                              | YYYY-MM-DD                      | date      | Premium and Discount Quarter-End Statistics, YYYY-MM-DD |
| pd_days_at_premium                             | 35                              | float     | Premium and Discount Quarter-End Statistics             |
| pd_days_at_discount                            | 29                              | float     | Premium and Discount Quarter-End Statistics             |
| pd_max_premium_dollars                         | 0.053159                        | float     | Premium and Discount Quarter-End Statistics             |
| pd_min_discount_dollars                        | -0.051491                       | float     | Premium and Discount Quarter-End Statistics             |
| pd_days_within_0_to_50bps                      | 35                              | float     | Premium and Discount Quarter-End Statistics             |
| pd_days_within_0_to_neg50bps                   | 29                              | float     | Premium and Discount Quarter-End Statistics             |
| ts                                             | 2020-01-03 05:35:21.236659Z     | timestamp | Database Update Timestamp                               |
| close_daily_change                             | 0.34                            | float     |                                                         |
| nav_daily_change                               | 0.465168                        | float     |                                                         |
| fundamentals_return_on_equity                  |                                 | float     |                                                         |
| adjnav                                         | 34.93873                        | float     |                                                         |
| adjclose                                       | 34.85                           | float     |                                                         |
| nav_daily_change_percent                       | 0.01349353                      | float     |                                                         |
| close_daily_change_percent                     | 0.009852217                     | float     |                                                         |
| prem_discount_ratio                            | -0.002539617                    | float     |                                                         |
| prem_discount_dollars                          | -0.088731                       | float     |                                                         |
| close_time_bid                                 | 34.92                           | float     |                                                         |
| close_time_ask                                 | 34.95                           | float     |                                                         |
| close_time_midpt                               | 34.935                          | float     |                                                         |
| premium_discount_gt_2pct_streak                | 0                               | float     | Premium-Discount 6c-11 Warning                          |
| premium_discount_warning_flag_triggered        | FALSE                           | boolean   | Premium-Discount 6c-11 Warning                          |
| premium_discount_warning_flag_trigger_date     |                                 | date      | Premium-Discount 6c-11 Warning, YYYY-MM-DD              |
| premium_discount_warning_flag_raised_days_left | 0                               | float     | Premium-Discount 6c-11 Warning                          |
| etfl_peergroup                                 | U.S. Equity Factor Large Cap    | varchar   | Classification Information                              |
| ult_securitytype                               | ETF                             | varchar   | Classification Information                              |
| ult_underlyingassettype                        | Equity                          | varchar   | Classification Information                              |
| ult_classification_developmentlevel            | Developed                       | varchar   | Classification Information                              |
| ult_classification_exposure                    | Country                         | varchar   | Classification Information                              |
| ult_classification_exposureregion              | North America                   | varchar   | Classification Information                              |
| ult_classification_sector                      | Broad                           | varchar   | Classification Information                              |
| average_spread_60_days                         | 0.001004289                     | float     | The daily average spread over the last 60 calendar days |
| median_spread_6c11                             | 0.000558192                     | float     | The 6c-11 Median Spread                                 |
| beta_to_msci_eafe_index                        | 0.7128129                       | float     | Beta Calculation using 2-years of weekly returns        |
| beta_to_msci_emerging_markets_index_usd        | 0.6620794                       | float     | Beta Calculation using 2-years of weekly returns        |
| beta_to_snp_500_index                          | 0.8455228                       | float     | Beta Calculation using 2-years of weekly returns        |

### /?function=holdings

Returns holdings for ETFs if available and permissioned. Extra permissions must be enabled on the backend. Please contact the engineering team if you require this feature.

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=holdings`

### /?function=distribution

Returns historical dividend distributions along with ex-date and identification of long-term, short-term capital gains, amongst other items.  
> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=distribution`

### /?function=performance

Returns standardized performance calculations across various time periods with T-1, Q-1 as-dates. Conforms to Form N-1A return calculations.

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=performance`

### /?function=flows
Returns ETF AUM and flows for the permissioned tickers.
> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=flows`

* Example call with `format=csv` and default lookback date changed using `date_gteq=YYYY.MM.DD` query parameter: `https://data.etflogic.io/test?apikey=<YourAPIKey>&function=flows&format=csv&date_gteq=2010.01.01`


### /?function=premium-discount
Returns 6c-11 premium-discount calculations for the permissioned tickers. 
> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=premium-discount`


### /?function=spreads

Returns percentile and 6c-11 spread calculations for the permissioned tickers. 

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=spreads`



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

Returns a time-series of adjusted price and NAV returns, including a growth of $10k return. Please note that time-series generally start around 2007.01 in our database.

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=performance`


### /?function=basket-exposures

Returns holdings statistics aggregated across many dimensions such as sector, geography, credit and maturity exposures. 

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=basket-exposures`


### /?function=premium-discount-statistics

Returns quarterly and yearly premium-discount statistics per 6c-11 requirements. Leverages the `function=premium-discount` time-series for its underlying data.

> Example Call: GET request to `https://data.etflogic.io/test/?apikey=<YourAPIKey>&function=premium-discount-statistics`

### /?function=spread-threshold-checks

Spread threshold checks provide monitoring around spread widening for individual ETFs. Monitoring is conducted as of the previous trading day and the previous quarter. 
There have been multiple interpretations of the legal text of the threshold checks which has resulted in multiple calculations. We explain the fields the function returns below. 

Spreads for any given ticker and date are calculated by taking the median of daily 10-second bid-ask samples during regular market trading hours. The threshold calculations do not exactly specifiy how to calculate spreads. So we have borrowed the 10-second bid-ask sampling from the ETF Rule 6c-11. For a representative spread for a given ticker+date we have chosen to use the daily median as it is a more robust statistic than the daily average which can be distorted by market opens or closes. 

| Field Key | Format | Example | Description |
| -- | -- | -- | -- |
| ticker| text | XYZ | The exchange listing ticker |
| asof_date | YYYY-MM-DD date | 2021-12-02 |The as-of date of the calculations. Typically T-1.|
| spread_lookback_15d_flag| boolean | false | Have all of the trading days in the last 15 calendar days from the as-of date experienced a bid-ask spread of 1% or more? |
| spread_lookback_15d_gteq1pct_count| integer | 4 | # of trading days in the last 15 calendar days from the as-of date that have experienced a bid-ask spread of 1% of more.|
| spread_lookback_15d_tradeday_count| integer | 11 | # of trading days in the last 15 calendar days|
| spread_lookback_3m_flag| boolean | true | Have there been 30 or more trading days in the last 3 calendar months from the as-of date where the bid-ask spread was 1% or more? |
| spread_lookback_3m_gteq1pct_count| integer | 35 | # of trading days in the last 3 calendar months where the bid-ask spread was 1% or more.|
| spread_lookback_3m_start_date|  YYYY-MM-DD date | 2021-09-07 | The first date in the 3-month lookback window from the as-of date.|
| spread_lookback_3m_tradeday_count| integer | 62 | # of trading days detected in the last 3 calendar months.|
| spread_lookback_prev_quarter_count| integer | 64 | # of trading days in the last completed quarter.|
| spread_lookback_prev_quarter_gteq1pct_count| integer | 27.0 | # of trading days in the last completed quarter where the bid-ask spread was 1% or more.|
| spread_lookback_prev_quarter_gteq1pct_streak_count| integer | 4.0 | Maximum # of consecutive trading days in the last completed quarter where the bid-ask spread was 1% or more.|
| spread_lookback_prev_quarter_gteq2pct_count| integer | 2.0 | # of trading days in the last completed quarter where bid-ask spread was 2% or more.|
| spread_lookback_prev_quarter_last_date| YYYY-MM-DD date | 2021-09-30 | The last calendar day of the last completed quarter, for the purposes of all "prev_quarter" calculations.|
| spread_lookback_prev_quarter_wide_spread_2pct_flag| boolean | true | Has there been at least one day in the last completed quarter where the bid-ask spread was 2% or more?|
| spread_lookback_prev_quarter_wide_spread_persist_flag| boolean | false | Set to true if in the last completed quarter there were either 30 trading days or 15 consecutive trading days where the bid-ask spread was 1% or more.|


The `spread_lookback_prev_quarter_` columns are based on ETFLogic's interpretation of points (2) and (b) below: 

> For at least the first three years after the launch of a Fund, the Adviser will promptly call a meeting of the Board (and will present to the Board for its consideration, recommendations for appropriate remedial measures) and the Board will promptly meet if any of the below thresholds are exceeded (each referred to herein as a “Threshold Breach”): (1) the Tracking Error exceeds 1%; (2) for 30 or more days in any quarter or 15 days in a row (a) the absolute difference between either the Closing Price or the Bid/Ask Price, on one hand, and NAV, on the other, exceeds 2%; or (b) the bid/ask spread exceeds 2%; or (3) as otherwise deemed necessary or appropriate by the Adviser.


## Examples



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
* 2021.02.19 - Modifications to `function=flow` to behave similar to other functions when `date` or `date_gteq` are passed in. 
* 2020.06.20 - Added multiple `function=<FUNCTION NAME` support for ETF overview, holdings, distributions, performance, flows, premium-discount, spreads, total-return and basket-exposures. 
* The /spreads endpoint was deprecated
* 2020.04.30 - Added ticker support
* 2020.02.06 - Added CSV support
