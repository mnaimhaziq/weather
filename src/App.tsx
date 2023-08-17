import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface WeatherData {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    condition: {
      icon: string;
      text: string;
    };
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
      };
    }[];
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY;
  
    // Get user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&days=1&key=${apiKey}`;
  
        axios.get<WeatherData>(apiUrl)
          .then(response => {
            setWeatherData(response.data);
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
          });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }, []);

 

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400">
      <div className="w-5/12 h-4/6 bg-yellow-200 rounded-3xl shadow-lg p-8 flex flex-col justify-center items-center">
        {weatherData ? (
          <>
            <h1 className="text-6xl font-bold mb-4">{weatherData.current.temp_c}°C</h1>
            <h2 className="text-4xl font-semibold mb-6">{weatherData.location.name}</h2>
            <div className="mb-6">
              <img
                src={weatherData.current.condition.icon}
                alt={weatherData.current.condition.text}
                className="max-w-full h-auto"
              />
            </div>
            {weatherData.forecast.forecastday.length > 0 && (
              <p className="text-2xl text-gray-700 mb-2">
                Average Temp: {weatherData.forecast.forecastday[0].day.avgtemp_c}°C 
              </p>
            )}
            {weatherData.forecast.forecastday.length > 0 && (
              <p className="text-xl text-gray-500">
                High: {weatherData.forecast.forecastday[0].day.maxtemp_c}°C, Low: {weatherData.forecast.forecastday[0].day.mintemp_c}°C
              </p>
            )}
          </>
        ) : (
          <p className='text-2xl font-bold'>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
