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
const dotenv = require('dotenv');

const CLASS_NAME_HIDDEN = 'hidden';
const CLASS_NAME_LOADING = 'loading';
const LABEL_NO_IMAGE_DATA = 'no image data';
const LABEL_NO_WEATHER_DATA = 'no weather data';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherItemVisibilityClass: CLASS_NAME_HIDDEN,
      bgImageStyle: '',
      favList: [],
      loadingClass: CLASS_NAME_HIDDEN,
      lng: 23.5,
      lat: 55.2
    };
    this.citySelectorRef = React.createRef();
    this.mapRef = React.createRef();
  }

  onCountryChange = (countryCode) => {
    let state = this.state;
    state.weatherItemVisibilityClass = CLASS_NAME_HIDDEN;
    state.country = countryCode;

    this.setState(state);
    this.citySelectorRef.current.loadCities(countryCode);
  }

  onCityChange = (cityName) => {
    this.loadCityWeather(cityName);
  }

  loadCityWeather = (cityName) => {
    this.updateState(this.getLoadingState(true));
    const options = {
      method: 'GET',
      url: 'https://community-open-weather-map.p.rapidapi.com/weather',
      params: {
        q: cityName + ',' + this.state.country,
        id: '2172797',
        units: 'metric'
      },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_APIDAPI_KEY,
        'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
      }
    };

    var that = this;
    axios.request(options).then(res => {
      let state = this.getLoadingState(false);
      state.id = res.data.id;
      state.city = cityName;
      state.weatherItemVisibilityClass = "page-form-data";
      state.condition = res.data.weather[0].description;
      state.temp = Math.round(res.data.main.temp);
      state.feelsLike = res.data.main.feels_like;
      state.wind = res.data.wind.speed;
      state.icon = 'http://openweathermap.org/img/w/' + res.data.weather[0].icon + '.png';
      state.lng = res.data.coord.lon;
      state.lat = res.data.coord.lat;
      this.setState(state);
      this.mapRef.current.flyToPosition(state.lng, state.lat, state.temp);
      this.loadCityImage(cityName);
    }).catch(function (error) {
      var state = that.getLoadingState(true, LABEL_NO_WEATHER_DATA)
      state.bgImageStyle = "";
      that.updateState(state);
    });

  }

  loadCityImage = (cityName) => {
    let state = this.getLoadingState(true);
    state.bgImageStyle = "";
    this.updateState(state);

    const options = {
      method: 'GET',
      url: 'https://cors-anywhere.herokuapp.com/pixabay.com/api',
      params: {
        key: process.env.REACT_APP_PIXABAY_API_KEY,
        q: cityName.replace(' ','+'),
        image_type: 'photo',
        //category: 'places',
        safesearch: 'true'
      }
    };

    var that = this;
    axios.request(options).then(res => {
      const isImgData = res.data.hits.length ? true : false;
      const loadingText = isImgData ? "" : LABEL_NO_IMAGE_DATA;
      let state = this.getLoadingState(!isImgData, loadingText);

      if(!isImgData) {
        state.bgImageStyle = "";
      } else {
        const id = this.getRandomNumber(0,res.data.hits.length - 1);
        state.bgImageStyle = res.data.hits[id].webformatURL;
      }
      this.updateState(state);
    }).catch(function (error) {
      that.updateState(that.getLoadingState(true, LABEL_NO_IMAGE_DATA));
    });
  }

  getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  getLoadingState = (isLoading, text) => {
    let state = this.state;
    state.loadingClass = isLoading ? CLASS_NAME_LOADING : CLASS_NAME_HIDDEN;
    state.loadingText = text ? text : 'loading...';
    return state;
  }

  updateState = (obj) => {
    const state = Object.assign(this.state, obj);
    this.setState(state);
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
                  <span className={this.state.loadingClass}>{this.state.loadingText}</span>
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
          <WeatherMap lng={this.state.lng} lat={this.state.lat} ref={this.mapRef}/>
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
