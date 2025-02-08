let apiKey = 'a16f9842d6de44feb6745336250802';
let baseUrl = 'http://api.weatherapi.com/v1/current.json?key=' + apiKey + '&aqi=yes&q=';

const cityElement = document.querySelector('.name');
const formElement = document.querySelector('form');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const searchInput = document.getElementById('name');
const cloudsElement = document.getElementById('clouds');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const mainElement = document.querySelector('main');

formElement.addEventListener('submit', (event) => {
    event.preventDefault();  
    const cityName = searchInput.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
    }
});

const fetchWeatherData = (cityName) => {
    fetch(`${baseUrl}${cityName}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the API response for debugging
            if (data && data.current) {
                updateWeatherUI(data);
            } else {
                showError();
            }
            searchInput.value = '';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            showError();
        });
};

const updateWeatherUI = (data) => {
    cityElement.querySelector('figcaption').innerText = data.location.name;

    fetch(`https://restcountries.com/v3.1/name/${data.location.country}`)
        .then(response => response.json())
        .then(countryData => {
            const countryCode = countryData[0].cca2;
            cityElement.querySelector('img').src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
        })
        .catch(() => {
            cityElement.querySelector('img').src = '';
        });

    const conditionCode = data.current.condition.code;
    temperatureElement.querySelector('img').src = `https://openweathermap.org/img/wn/${mapConditionToIcon(conditionCode)}@4x.png`;
    temperatureElement.querySelector('span').innerText = `${data.current.temp_c} C`;
    descriptionElement.innerText = data.current.condition.text;

    cloudsElement.innerText = `${data.current.cloud}`;
    humidityElement.innerText = `${data.current.humidity}`;
    pressureElement.innerText = `${data.current.pressure_mb}`;
};

const mapConditionToIcon = (code) => {
    const iconMap = {
        1000: '01d',
        1003: '02d',
        1006: '03d',
        1009: '04d',
        1030: '50d',
        1063: '09d',
        1066: '13d',
        1087: '11d',
        1117: '13d',
        1135: '50d',
        1150: '09d',
        1183: '10d',
        1195: '10d',
        1204: '13d',
        1240: '09d',
        1273: '11d',
    };
    return iconMap[code] || '01d';
};

const showError = () => {
    mainElement.classList.add('error');
    setTimeout(() => {
        mainElement.classList.remove('error');
    }, 1000);
};

const initApp = () => {
    fetchWeatherData('Kolkata');
};

initApp();

document.body.style.margin = '0';
document.body.style.minHeight = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.backgroundImage = 'linear-gradient(to bottom, #dcdcdc 50%, #e9e9e9 50%)';

document.querySelector('main').style.width = '100%';
document.querySelector('main').style.maxWidth = '400px';
document.querySelector('main').style.minHeight = '400px';
document.querySelector('main').style.padding = '20px';
document.querySelector('main').style.boxSizing = 'border-box';
