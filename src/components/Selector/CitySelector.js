import React from 'react'
import Select from 'react-select'
import axios from 'axios'
require('dotenv').config({ path: '../.env' })

export default class CitySelector extends React.Component {
  state = {
    cities: [],
    selectedOption: null
  }

    loadCities(countryId, cityPreffix) {
      this.setState({cities: []});
      axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
          headers:{
            'x-rapidapi-key': process.env.REACT_APP_APIDAPI_KEY,
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'useQueryString': 'true'
          },
          params: {
            countryIds: countryId,
            namePrefix: cityPreffix ? cityPreffix : '',
            sort: '-population'
          }
        }).then(res => {
          let cities = [];
          let selectedOption = null;
          const data = res.data.data;
          for(var i = 0; i < data.length; i++) {
            let option = {label: data[i].city, value: data[i].id};
            cities.push(option);
          }
          this.setState({ cities, selectedOption: null });
          if(selectedOption) this.handleChange(selectedOption);
        }).catch(function (error) {
          console.error(error);
        });
    }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.onChange(selectedOption.label);
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <Select className="selector" value={selectedOption} onChange={this.handleChange} options={this.state.cities}/>
    )
  }
}
