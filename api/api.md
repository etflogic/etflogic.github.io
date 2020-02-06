# API Guide

## Overview

This documentation serves to outline the features of a portion of ETFLogic's data API available to clients. The data API is not accessible and should not be accessed without prior written consent from ETFLogic. Any unauthorized access is prohibited. 

## Methodology

Please contact the team for detailed documentation on the methodology, calculations and data sources. 

## API Server and Details

* The ETFLogic API is available via the web 
* Hostname: https://data.etflogic.io 
* Stages
  * `test`, available via https://data.etflogic.io/test/
  * `prod`, available via https://data.etflogic.io/prod/


## Endpoints
The following endpoints are provided by the data API:

### spreads

The median spread calculation is provided using the calculation specified per regulatory requirements.

#### Overview
* HTTP Method supported: GET

#### Query Parameters
* `apikey`, required,
* `date`, optional
  * Default `date=<last available date>`
* `fields`, optional, 
  * Default `fields=ticker,asof_date,median_spread`
* `format`, optional, 
  * Default `format=json`
* `function`, optional
  * Default `function=spreads`

#### Example

```
wget -q -O- 'https://data.etflogic.io/test/spreads?apikey=<Your API Key>'

```

### warning

_Coming Soon_

Premium and Discount monitoring is handled by the endpoint. The endpoint monitors threshold levels, alerts as an ETF gets closer to a warning flag event. If a warning flag is raised, a countdown timer is provided to monitor the length of time required to maintain that warning on an issuer website.

### stats

_Coming Soon_

Aggregated premium and discount statistics are provided on quarterly and yearly time periods as well as for the life of the fund. 