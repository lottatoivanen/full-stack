import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAll().then(initialCountries => {
      setCountries(initialCountries)
    })
  }, [])

  const showCountry = (country) => {
    setFilter(country.name.common)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  const countriesToShow = filter === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  useEffect(() => {
    if (countriesToShow.length !== 1) {
      setWeather(null)
      return
    }
    const capital = countriesToShow[0].capital[0]
    if (!capital) {
      setWeather(null)
      return
    }
    weatherService.getWeather(countriesToShow[0].capital[0]).then(weatherData => {
      setWeather(weatherData)
    }
    )
  }, [countriesToShow])
  
  
  return (
    <div>
      <h2>Countries</h2>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {countriesToShow.length > 10 && (
        <div>Too many matches, specify another filter</div>
      )}

      {countriesToShow.length > 1 && countriesToShow.length <= 10 && (
        <ul>
          {countriesToShow.map(country => 
            <li key={country.cca3}>{country.name.common} <button type="button" onClick={() => showCountry(country)}> show</button></li>
          )}
        </ul>
      )}
      {countriesToShow.length === 1 && (
      <div>
        <h1>{countriesToShow[0].name.common}</h1>
        <div>Capital: {countriesToShow[0].capital[0]}</div>
        <div>Area: {countriesToShow[0].area} km²</div>
        <h2>Languages:</h2>
        <ul>
          {Object.values(countriesToShow[0].languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        <img
          src={countriesToShow[0].flags.png} 
          alt={`Flag of ${countriesToShow[0].name.common}`} 
          width="150" 
        />
        <h2>Weather in {countriesToShow[0].capital[0]}</h2>
        <div>Temperature: {weather?.main?.temp} °C</div>
        {weather?.weather?.[0]?.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
        )}
        <div>Wind: {weather?.wind?.speed} m/s</div>
        </div>
      )}
    </div>
  )
}

export default App
