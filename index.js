const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchContainer]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variable need???

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getFromSessionStorage();

//ek kaam orpemdeing hai

function switchTab(newTab) {
    if (oldTab != newTab) {
        oldTab.classList.remove("old-tab");
        oldTab = newTab;
        oldTab.classList.add("old-tab");

        if (!searchForm.classList.contains("active")) {
            //kya search form wala container invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        {
            //mai phale search wale tab pe tha ab your weather wala tab visible krna padega
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather wale tab pe hu to weather bhi dispaly krna padega,so lets check local storage first for coordinates,if we haved saves them there
            getFromSessionStorage();
        }

    }
}
userTab.addEventListener("click", () => {
    //pass click tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});
//check if we have saved coordinates in local  session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        //if no coordinates saved then 
        grantAccessContainer.classList.add("active");
    }
    else {
        //if coordinates are saved then
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates) {
    //fetching weather info from open weather api
    const { latitude, longitude } = coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    
       //fetching weather info from open weather api
       try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`

        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // console.log(data);
        //displaying weather info
        renderWeatherInfo(data);
    }
    catch (error) {
        loadingScreen.classList.remove("active");
        console.error(error);
    }
}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
    //saving coordinates in local storage
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    //fetching weather info
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchUserWeatherInfo(cityName);
})



async function fetchUserWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    //fetching weather info from open weather api
  try{ const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    )
        const data = await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
}
        catch (error) {
            console.error(error);
        }

    }




