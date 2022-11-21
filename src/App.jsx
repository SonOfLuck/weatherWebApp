import { useState, useEffect } from 'react'
import './App.css'
import BarChart from './BarChart'
import LineChart from './LineChart'
function App() {
  const [inputValue, setInputValue] = useState("")
  const [currentCity, setCurrentCity] = useState("Brussels")
  const [weatherForecast, setWeatherForecast] = useState([])
  const [activeID, setActiveID] = useState("")
  const [t24U, setT24U] = useState([])
  const [wind24U, setWind24U] = useState([])
  const [rainChance, setRainChance] = useState([])
  const [graphActivity, setGraphActivity] = useState([true, false, false, false])


  const [rainActive, setRainActive] = useState(false)
  const [tempActive, setTempActive] = useState(true)
  const [windActive, setWindActive] = useState(false)
  const [humidityActive, setHumidityActive] = useState(false)
  const [precipitation24U, setPrecipitation24U] = useState([])
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const APIKEY = "00cac1a633394b1aa6885227221711"
  const days = 5;
  const aqi = "no"
  const alerts = "no"

  useEffect(() => {
    setActiveID(new Date().getDay());
    apiCall(days, currentCity, aqi, alerts).then((data) => {
      if (data.forecast.forecastday) {
        setWeatherForecast(data.forecast.forecastday)
        setCurrentCity(`${data.location.name}, ${data.location.country}`)
      }
    }).catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    set24hGraphData()
  }, [weatherForecast])
  useEffect(() => {
    set24hGraphData()
  }, [activeID])

  const apiCall = (day, place, aq, alert) => {
    return fetch(`http://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${place}&days=${day}&aqi=${aq}&alerts=${alert}`)
      .then((response) => { return response.json() })
      .catch((err) => console.error("error: " + err))
  }

  const weatherForecast_City = () => {
    apiCall(days, inputValue, aqi, alerts).then((data) => {
      if (data.forecast.forecastday) {
        setWeatherForecast(data.forecast.forecastday)
        setCurrentCity(`${data.location.name}, ${data.location.country}`)
      }
    }).catch((err) => console.error(err))
  }

  const setDayActive = (day) => {
    setActiveID(day)
  }

  const getOffset = () => {
    let offset = []
    let offSetCounter = 0;
    let offset_days = []
    let currentDay = new Date().getDay() // 0-6
    for (let i = 0; i < 7; i++) {
      if (currentDay == 7) {
        currentDay = 0;
      }
      offset_days.push(currentDay)
      offset.push(offSetCounter)
      offSetCounter++
      currentDay++
    }

    let currentOffset = 0;
    for (let i = 0; i < 7; i++) {
      if (offset_days[i] == activeID) {
        currentOffset = offset[i]
      }
    }

    return currentOffset
  }

  const set24hGraphData = () => {
    let temp_D = [];
    let humidity_D = [];
    let wind_D = [];
    let chance_of_rain_D = [];
    let offset = getOffset()
    weatherForecast.map((day) => {
      day.hour.map((hour) => {
        let lengthStr = hour.time.length;
        if (hour.time.substring(lengthStr - 8, lengthStr - 6) === JSON.stringify(new Date().getDate() + offset)) { // + offset day between day now and active.
          temp_D.push(hour.temp_c)
          humidity_D.push(hour.humidity)
          wind_D.push(hour.wind_kph)
          chance_of_rain_D.push(hour.chance_of_rain)
        }
      })
    })
    setT24U(temp_D)
    setWind24U(wind_D)
    setPrecipitation24U(humidity_D)
    setRainChance(chance_of_rain_D)
  }

  return (
    <div className="App">
      <h1>Weather App Forecast</h1>
      <div className='searchDiv'>
        <h3>{`Location: ${currentCity}`}</h3>
        <div className='searchDivInput'>
          <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} type="text" placeholder='city name'></input>
          <button onClick={() => weatherForecast_City()}>Search</button>
        </div>
      </div>

      <div className='chartsDiv'>
        {graphActivity[0] == true ? <LineChart name={"Temperature °C"} dataWeather={t24U} /> : ''}
        {graphActivity[1] == true ? <BarChart name={"Rain chance %"} dataWeather={rainChance} /> : ''}
        {graphActivity[2] == true ? <LineChart name={"Wind km/h"} dataWeather={wind24U} /> : ''}
        {graphActivity[3] == true ? <BarChart name={"Humitidy %"} dataWeather={precipitation24U} /> : ''}
      </div>
      <div className='barActiveElements'>
        <span onClick={() => setGraphActivity([1, 0, 0, 0])} style={{ borderBottom: graphActivity[0] == true ? '5px solid yellow' : '' }}>Temperature</span>
        <span onClick={() => setGraphActivity([0, 1, 0, 0])} style={{ borderBottom: graphActivity[1] == true ? '5px solid yellow' : '' }} >Rain chance</span>
        <span onClick={() => setGraphActivity([0, 0, 1, 0])} style={{ borderBottom: graphActivity[2] == true ? '5px solid yellow' : '' }}>Wind</span>
        <span onClick={() => setGraphActivity([0, 0, 0, 1])} style={{ borderBottom: graphActivity[3] == true ? '5px solid yellow' : '' }}>Humidity</span>
      </div>
      <div>
        <div className="card5Days">
          {
            weatherForecast.map((day) => {
              return (
                <div className='forecast1card' key={day.date} id={new Date(day.date).getDay()} onClick={() => setDayActive(new Date(day.date).getDay())}
                  style={{
                    backgroundColor: activeID == new Date(day.date).getDay() ? 'rgb(220,220,220)' : '',
                  }}
                >
                  <p className='day_forecast'>{weekday[new Date(day.date).getDay()]}</p>
                  <img className='fotoCard' src={day.day.condition.icon} id="day-logo" alt={day.day.condition.text} />
                  <div className='temperatures_5days'>
                    <p className='Thigh'>{`${day.day.maxtemp_c.toString()}°`}</p>
                    <p className='TLow'>{`${day.day.mintemp_c.toString()}°`}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
export default App
