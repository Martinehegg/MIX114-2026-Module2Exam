Task 2. (25 points)
In this task, you write a short application that displays a Select element with country names. 

When a country is selected, the app should first display basic country information, 

then fetch and show the current weather in that country’s capital city, 

and finally fetch and display the latest exchange rate from the country’s currency to Norwegian Krona. 

The weather and exchange-rate sections should only be shown after the country data has been successfully loaded, so the application performs the requests sequentially. 

You should use weather icon linked in the JSON for the weather in this moment. The 'chanceofrain' forecast from the weather data should be displayed as a Highcharts Area plot. 

The list of countries to populate the Select element can be fetched from the following WebAPI: https://restcountries.com/v3.1/all?fields=name.

Detailed information about a specific country can be fetched from the following URL template: https://restcountries.com/v3.1/name/<country name>.

The current weather for the capital city can be fetched from the following WebAPI template: https://wttr.in/<capital city>?format=j1.

The exchange rate to EUR can be fetched from the following WebAPI template: https://open.er-api.com/v6/latest/<currency code>.

 