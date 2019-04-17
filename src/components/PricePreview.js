import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setMapRegion } from '../actions/MapPlacesActions';
import { setPlaceOrigin } from '../actions/DirectionsActions';

class PricePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={style.container} >
          <Text style={style.text}>
            { JSON.stringify(this.props.destination) }
          </Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    height: 200,
    backgroundColor: '#FFF',
    position: 'absolute',
    left: 0, right: 0,
    bottom: 0,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowColor: '#000000',
    elevation: 8
  },
  text: {
    color: "black"
  }
})

const mapStatesToProps = (state, props) => {
  const { region } = state.MapPlacesReducer;
  const { origin, destination } = state.DirectionsReducers;
  return { region, origin, destination };
}

export default connect(mapStatesToProps, {}, null)(PricePreview);