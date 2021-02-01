import React from 'react'
import './style/WeatherItem.scss';
import { AiOutlineHeart } from "react-icons/ai";

export default class WeatherItem extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFavClick = () => {
    this.props.onChange();
  }

  render() {
    return (
      <div className="weather-item">
        <div className="weather-info page-menu weather-fav-btn" onClick={this.handleFavClick}><AiOutlineHeart/></div>
        <div className="weather-info">{this.props.cityName}</div>
        <div className="weather-info">{this.props.temp}</div>℃
        <div className="weather-icon"><img src={this.props.icon}/></div>
        <div className="weather-details">{this.props.condition}</div>
      </div>
    )
  }
}
