const city =
    document.getElementById("city");

const search =
    document.getElementById("search");

const cityName =
    document.getElementById("cityName");

const temp =
    document.getElementById("temp");

const humidity =
    document.getElementById("humidity");

const message =
    document.getElementById("message");

const status =
    document.getElementById("status");

const weatherIcon =
    document.getElementById("weatherIcon");

const celsiusBtn =
    document.getElementById("celsiusBtn");

const fahrenheitBtn =
    document.getElementById("fahrenheitBtn");

const reply =
    document.getElementById("reply");

let selectedUnit = "C";
let currentWeather = null;

function getWeatherIcon(description) {
    const desc = (description || "").toLowerCase();
    if (desc.includes("sun") || desc.includes("clear")) return "☀️";
    if (desc.includes("cloud")) return "☁️";
    if (desc.includes("rain") || desc.includes("shower") || desc.includes("drizzle")) return "🌧️";
    if (desc.includes("thunder")) return "⛈️";
    if (desc.includes("snow")) return "❄️";
    if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze")) return "🌫️";
    return "🌤️";
}

function renderWeather(current) {
    currentWeather = current;
    cityName.textContent = city.value;
    weatherIcon.textContent = getWeatherIcon(current.weatherDesc?.[0]?.value);

    const temperature = selectedUnit === "C"
        ? current.temp_C
        : current.temp_F;

    temp.textContent = `Current temp: ${temperature}°${selectedUnit}`;
    humidity.textContent = `Humidity: ${current.humidity}%`;
    status.textContent = "";
    message.textContent = "";
    reply.textContent = "Thank you for using my app 😉."
}

function updateUnit(unit) {
    if (unit === selectedUnit) return;
    selectedUnit = unit;

    celsiusBtn.classList.toggle("active", unit === "C");
    fahrenheitBtn.classList.toggle("active", unit === "F");

    if (currentWeather) {
        renderWeather(currentWeather);
    }
}

async function getWeather() {
    message.textContent = "";
    status.textContent = "Loading...";
    search.disabled = true;

    try {
        console.log("Started...");
        const response =
            await fetch(
                `https://wttr.in/${encodeURIComponent(city.value)}?format=j1`
            );

        if (!response.ok) {
            throw new Error("Weather service returned an error.");
        }

        const data = await response.json();

        if (!data.current_condition || !data.current_condition.length) {
            throw new Error("No weather data available.");
        }

        renderWeather(data.current_condition[0]);
    }

    catch (error) {
        console.log(error);
        status.textContent = "";
        message.textContent =
            "Unable to fetch weather. Please try again.";
    }

    finally {
        search.disabled = false;
        status.textContent = "";
    }
}

search.addEventListener("click", () => {
    if (!city.value) {
        alert("Enter a city");
        return;
    }

    getWeather();
});

celsiusBtn.addEventListener("click", () => updateUnit("C"));
fahrenheitBtn.addEventListener("click", () => updateUnit("F"));