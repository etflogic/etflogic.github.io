# API Guide

## Overview

This documentation serves to outline the features of a portion of ETFLogic's data API available to clients. The data API should not be accessed without prior written consent from ETFLogic. Any unauthorized access is prohibited.

This data is also provided in flat-file format for delivery (push or pull) via SFTP or AWS S3.

## Methodology

Please contact the team for detailed documentation on the methodology, calculations and data sources.

## API Server and Details

* The Data API is RESTful and available over the internet.
* Hostname: https://data.etflogic.io/
* Stages
  * `test`, available via https://data.etflogic.io/test/
  * `prod`, available via https://data.etflogic.io/prod/


## Endpoints
The following endpoints are provided by the data API:

### /spreads

The median spread calculation is provided using the calculation specified per regulatory requirements.

#### Overview
* HTTP Method supported: GET

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

#### Field Definitions


| Field Key | Format | Name | Description |
| -- | -- | -- | -- |
| `ticker` | String | Exchange TIcker | This is the latest exchange ticker used to reference the data |
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


#### Examples

These examples use the `wget` command line tool to make requests to the API.


##### Basic Example: Obtain Latest Data

```
wget -q -O- 'https://data.etflogic.io/test/spreads?apikey=<YourAPIKey>'

```
Returns a JSON object with `spreads` array.

#####  Getting Available Options

```
wget -q -O- 'https://data.etflogic.io/test/spreads?apikey=<YourAPIKey>&function=options'

```
Returns a JSON object with `options` object.

#####  Selecting a specific date and fields

```
wget -q -O- 'https://data.etflogic.io/test/spreads?apikey=<YourAPIKey>&fields=asof_date,ticker,p50,p05,p95&date=20200204'

```
Returns a JSON object with `spreads` array.

#####  Getting a CSV payload


```
wget -q -O- 'https://data.etflogic.io/test/spreads?apikey=<YourAPIKey>&format=csv'

```
Returns a CSV text blob. `format=csv` is only valid for `function=spreads`.

### /warning

_Coming Soon_

Premium and Discount monitoring is handled by the endpoint. The endpoint monitors threshold levels, alerts as an ETF gets closer to a warning flag event. If a warning flag is raised, a countdown timer is provided to monitor the length of time required to maintain that warning on an issuer website.

### /stats

_Coming Soon_

Aggregated premium and discount statistics are provided on quarterly and yearly time periods as well as for the life of the fund.

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

## Change List

* 2020.02.06 - Added CSV support
