import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export default class CitySelector extends React.Component {
  state = {
    cities: [],
    selectedOption: null
  }

    loadCities(countryId, cityPreffix) {
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
            if(i === 0) selectedOption = option;
          }
          this.setState({ cities });
          if(selectedOption) this.handleChange(selectedOption);
        })
    }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.onChange(selectedOption.value);
  }

  componentDidMount() {
    //this.loadCities('LT', 'Kau');
  }

  render() {
    const { selectedOption } = this.state;

    return (
      <Select value={selectedOption} onChange={this.handleChange} options={this.state.cities}/>
    )
  }
}
