import React from 'react'

export default class FavItem extends React.Component {
  render() {
    return (
      <div className="fav-item">
        <div>{this.props.cityName}</div>
        <div>{this.props.temp}℃</div>
        <div>{this.props.condition}</div>
      </div>
    )
  }
}
