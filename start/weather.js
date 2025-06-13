    const apiKey = 'f5908925284d024a5554248618562d6b'; // <-- Replace with your API key
    const cityEl = document.getElementById('city');
    const tempEl = document.getElementById('temp');
    const descEl = document.getElementById('description');
    const iconEl = document.getElementById('icon');

    // Step 1: Get user's IP-based location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(location => {
        const { latitude, longitude, city, region, country_name } = location;
        cityEl.textContent = `${city}, ${region}, ${country_name}`;
        // Step 2: Fetch weather data
        return fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
      })
      .then(res => res.json())
      .then(weather => {
        const { main, weather: details } = weather;
        const [{ description, icon }] = details;

        tempEl.textContent = `${Math.round(main.temp)}°C`;
        descEl.textContent = description;
        iconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconEl.alt = description;
      })
      .catch(err => {
        cityEl.textContent = 'Unable to retrieve weather.';
        tempEl.textContent = '';
        descEl.textContent = '';
        console.error(err);
      });
