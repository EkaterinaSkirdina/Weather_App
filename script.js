const form = document.querySelector('#form');
const input = document.querySelector('.form__input');
form.onsubmit = submitHandler;
const API_KEY = "ccf102b9bc5a4c927b47685afef479d7";

async function submitHandler (e) {
    e.preventDefault();

    if (!input.value.trim()) {
        console.log('ENTER CITY NAME');
        return;
    }

    const cityName = input.value.trim();
    input.value = '';

    const cityInfo = await getGeo(cityName);
    //проверка на пустой ответ
    if (cityInfo.length == 0) return;

    // console.log(cityInfo);
    // console.log(cityInfo[0]['lat']);
    // console.log(cityInfo[0]['lon']);

    const weatherInfo = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);
    console.log(weatherInfo);
    // парсим значения из json
    console.log(weatherInfo.name); // название города
    console.log(weatherInfo.main.temp); // температура
    console.log(weatherInfo.main.humidity); //влажность
    console.log(weatherInfo.wind.speed); // скорость ветра
    console.log(weatherInfo.weather[0]['main']); // тип погоды(облачно, ясно...)

    // все полученные данные поместим в объект
    const weatherData = {
        name: weatherInfo.name,
        temp: weatherInfo.main.temp,
        humidity: weatherInfo.main.humidity,
        speed: weatherInfo.wind.speed,
        main: weatherInfo.weather[0]['main']
    };

    //запускаем основную функцию
    renderWeatherData(weatherData);

}

//функция получения гео-данных введенного города
async function getGeo(name) {
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
    const response = await fetch(geoURL);
    const data = await response.json();
    return data;
}

// функцияя получения данных о погоде по гео-данным
async function getWeather(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherURL);
    const data = await response.json();
    console.log(data);
    return data;
}

// функция отрисовки данных о погоде
function renderWeatherData(data) {
    const temp = document.querySelector('.weather__temp');
    const city = document.querySelector('.weather__city');
    const humidity = document.querySelector('#humidity');
    const speed = document.querySelector('#speed');
    const img = document.querySelector('.weather__img');
    

    temp.innerText = Math.round(data.temp) + '°с';
    city.innerText = data.name;
    humidity.innerText = data.humidity + '%';
    speed.innerText = Math.round(data.speed) + 'km/h';

    // отрисовка картинок погоды по данным main
    const fileNames = {
        Clouds: 'clouds',
        Clear: 'clear',
        Rain: 'rain',
        Mist: 'mist',
        Drizzle: 'drizzle',
    };

    if  (fileNames[data.main]) {
        img.src = `./img/${fileNames[data.main]}.png`;
    }
}