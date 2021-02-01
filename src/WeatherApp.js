import React, {Component} from 'react';
import './style/WeatherApp.scss';
import CountrySelector from './components/Selector/CountrySelector';
import CitySelector from './components/Selector/CitySelector';
import WeatherItem from './components/WeatherItem/WeatherItem';
import FavItem from './components/WeatherItem/FavItem';
import WeatherMap from './components/WeatherMap/WeatherMap';
import { CustomDialog } from 'react-st-modal';
import AboutDialogContent from './components/Dialog/AboutDialogContent';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherItemVisibilityClass: 'hidden',
      bgImageStyle: '',
      favList: []
    };
    this.citySelectorRef = React.createRef();
  }

  onCountryChange = (countryCode) => {
    let state = this.state;
    state.weatherItemVisibilityClass = "hidden";
    state.country = countryCode;

    this.setState(state);
    this.citySelectorRef.current.loadCities(countryCode);
  }

  onCityChange = (cityName) => {
    this.loadCityWeather(cityName);
  }

  loadCityWeather = (cityName) => {
    const options = {
      method: 'GET',
      url: 'https://community-open-weather-map.p.rapidapi.com/weather',
      params: {
        q: cityName + ',' + this.state.country,
        id: '2172797',
        units: 'metric'
      },
      headers: {
        'x-rapidapi-key': 'dccf185d9emshd202e9aa7a619c3p14ef37jsn09bef7ea83c2',
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
      }
    };

    axios.request(options).then(res => {
      let state = this.state;
      state.id = res.data.id;
      state.city = cityName;
      state.weatherItemVisibilityClass = "page-form-data";
      state.lon = res.data.coord.lon;
      state.lat = res.data.coord.lat;
      state.condition = res.data.weather[0].description;
      state.temp = Math.round(res.data.main.temp);
      state.feelsLike = res.data.main.feels_like;
      state.wind = res.data.wind.speed;
      state.icon = 'http://openweathermap.org/img/w/' + res.data.weather[0].icon + '.png';
      this.setState(state);
    }).catch(function (error) {
      alert("Failed to load weather data");
    	console.error(error);
    });

    this.loadCityImage(cityName);
  }

  getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  updateState = (obj) => {
    const state = Object.assign(this.state, obj);
    this.setState(state);
  }

  loadCityImage = (cityName) => {
    const options = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/pixabay.com/api',
      params: {
        key: '20100608-ec551a30a23754cda7131c518',
        q: cityName.replace(' ','+'),
        image_type: 'photo',
        //category: 'places',
        safesearch: 'true'
      }
    };
    this.updateState({bgImageStyle: ""})
    axios.request(options).then(res => {
      let state = this.state;
      if(res.data.hits.length < 1) {
        this.updateState({bgImageStyle: ""});
      } else {
        var id = this.getRandomNumber(0,res.data.hits.length - 1);
        this.updateState({bgImageStyle: res.data.hits[id].webformatURL});
      }
      this.setState(state);
    }).catch(function (error) {
      alert("Failed to load image data");
      console.error(error);
    });
  }

  isFavAdded = () => {
    for(let i = 0; i < this.state.favList.length; i++) {
      if(this.state.favList[i].id === this.state.id) {
        return true;
      }
    }
    return false;
  }

  addFavItem = () => {
    this.state.favList.push(this.state);
    this.setState(this.state);
  }

  onFavToggle = () => {
    if(!this.isFavAdded()) {
      this.addFavItem();
    }
  }

  render() {
    return (
      <div className="page">
        <div className="page-cont">
          <div className="page-form">
            <div className="page-form-select">
              <div className="page-title">What's the weather today?</div>
              <CountrySelector onChange={this.onCountryChange}/>
              <CitySelector onChange={this.onCityChange} ref={this.citySelectorRef}/>
              <div className="page-form-btn-cont">
                <div className="page-menu" onClick={async () => {
                    await CustomDialog(<AboutDialogContent />, {
                      title: 'About',
                      showCloseIcon: true,
                    });
                  }}>
                  About
                </div>
              </div>
            </div>
            <div className={this.state.weatherItemVisibilityClass} style={{ backgroundImage: `url(${this.state.bgImageStyle})` }}>
              <WeatherItem cityName={this.state.city} temp={this.state.temp}
                condition={this.state.condition} onChange={this.onFavToggle} icon={this.state.icon}/>
            </div>
          </div>
          <WeatherMap onViewportChange={this.state.viewport}/>
        </div>
        <div className="fav-list">
        {this.state.favList.map((item) =>
        <FavItem className="fav-item" cityName={item.city} temp={item.temp}
          condition={item.condition}/>
        )}
        </div>
      </div>
    );
  }
}
