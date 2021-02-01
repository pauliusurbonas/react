import React from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

export default class CountrySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      selectedOption: null
    };
  }

  loadCountries(defaultOption) {
    const countries = countryList().getData();
    const selectedOption = countries.filter(option => option.value === defaultOption);
    this.setState({ countries, selectedOption });
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    this.props.onChange(selectedOption.value);
  }

  componentDidMount() {
    this.loadCountries();
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <Select className="selector" value={selectedOption} onChange={this.handleChange} options={this.state.countries}/>
    )
  }
}
