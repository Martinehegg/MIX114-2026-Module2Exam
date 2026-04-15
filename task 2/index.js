

async function getCountry(){ //using async to be able to use await inside the function
    console.log('Funksjonen kjører!')
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
    const data = await response.json(); //Take the json data and convert it to a JavaScript object

    console.log(data); //log the data to the console to see what it looks like

    const select = document.getElementById('countrySelect');

    data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common; //Set the value of the option to the common name of the country(e.g. "Norway" instead of "Kingdom of Norway")
        option.textContent = country.name.common; //Set the text content of the option to the common name of the country
        select.appendChild(option); //Append the option to the select element
        });
    }
window.onload = getCountry;

async function showCountryInfo(){
    const selectedCountry = document.getElementById('countrySelect').value;
    
    if (selectedCountry === ''){
        return;
    }
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(selectedCountry)}`); //fetch the data for the selected country using the restcountries API, and encode the country name to handle spaces and special characters
    const data = await response.json();
    const country = data[0];

    const name = country.name.common;
    const capital = country.capital[0]; //because the capital is an array, we need to access the first element of the array to get the capital city
    const region = country.region;
    const population = country.population;

    const div = document.getElementById('countryInfo');

    div.innerHTML =`
    <h2>${name}</h2>
    <p> Capital: ${capital}</p>
    <p> Region: ${region}</p>
    <p> Population: ${population}</p>
    `

    const weatherResponse = await fetch(`https://wttr.in/${encodeURIComponent(capital)}?format=j1`); //fetch the weather data for the capital city using the wttr.in API, and encode the capital city name to handle spaces and special characters
    const weatherData = await weatherResponse.json();

    console.log(weatherData); //log the weather data to the console to see what it looks like
    
    const currentWeather = weatherData.current_condition[0]
    const temperature = currentWeather.temp_C; //Get the current temperature in Celsius
    const description = currentWeather.weatherDesc[0].value; //Get the weather description
    const icon = currentWeather.weatherIconUrl[0].value; //Get the URL of the weather icon

    const weatherDiv = document.getElementById('weatherInfo');

    weatherDiv.innerHTML =`
    <h3> Weather in ${capital}</h3>
    <p> Temperature: ${temperature}°C</p>
    <p> Description: ${description}</p>
    <img src="${icon}" alt="Weather icon">
    `;

    const hourly = weatherData.weather[0].hourly; //Get the hourly weather data for the current day
    const rainData = hourly.map(hour=> Number(hour.chanceofrain));//to get a list of numbers (chance of rain) from each hour to use in the highcharts graph
    const times = hourly.map(hour=> hour.time); //to get a list of times from each hour to use as categories in the highcharts graph

    Highcharts.chart('chartArea',{
        chart: {
            type: 'area'
        },
        title: {
            text: 'Chance of Rain Throughout the Day'
        },
        xAxis: {
            categories: times
        }, 
        yAxis: {
            title:{
                text: 'Percentage (%)'
            }
        },
        series: [{
            name: 'Chance of Rain',
            data: rainData

        }]
    });

    const currencyCode = Object.keys(country.currencies)[0]; //Get the currency code (e.g. "NOK" for Norwegian Krone) from the country data. Using Object.keys because the currency is an object with the currency code as the key.
    const exchangeResponse = await fetch(`https://open.er-api.com/v6/latest/${currencyCode}`);    const exchangeData = await exchangeResponse.json();

    const valutaDiv = document.getElementById('valutaInfo');

    valutaDiv.innerHTML =`
    <h3> Exchange Rate for ${currencyCode}</h3>
    <p> 1 ${currencyCode} = ${exchangeData.rates.NOK} NOK </p>
    `
};
