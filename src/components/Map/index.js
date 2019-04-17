import React, { Component, Fragment } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { HomeViewStyle } from '../../utils/Styles';
import { BLUE_COLOR } from '../../utils/Colors.js';
import Directions from '../Directions';
import { setMapRegion } from '../../actions/MapPlacesActions';
import { setPlaceOrigin } from '../../actions/DirectionsActions';
import { getPixelSize } from '../../utils';
import { Icon } from 'native-base';
import PopulateCarsInMap from '../../utils/PopulateCarsInMap';
import CustomMapStyle from "../../utils/Styles/CustomMapStyle.json";
import PricePreview from '../PricePreview';

const APIKEY = process.env['GOOGLE_API_KEY'];

const request = {
  directionsServiceBaseUrl: "https://maps.googleapis.com/maps/api/directions/json",
  origin: '',
  waypoints: '',
  destination: '-20.4435,-54.6478', //Campo Grande, MS - BRASIL
  apikey: "AIzaSyB1O8amubeMkw_7ok2jUhtVj9IkME9K8sc",
  mode: 'driving',
  language: 'pt',
  //request: `${directionsServiceBaseUrl}?origin=${origin}&waypoints=${waypoints}&destination=${destination}&key=${apikey}&mode=${mode}&language=${language}`
};


class Map extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      initialRegion: {
        longitude: 0,
        latitude: 0,
        longitudeDelta: 0.0134,
        latitudeDelta: 0.0143
      },
      carsPos: [
        { latitude: -20.3478, longitude: -40.2950, key: 0 },
        { latitude: -20.3438, longitude: -40.2920, key: 1 },
        { latitude: -20.3408, longitude: -40.2900, key: 2 },
        { latitude: -20.3848, longitude: -40.3226, key: 3 },
        { latitude: -20.3577481, longitude: -40.2956602, key: 4 }
      ]
    };
    this.mapRef = null;
    this.directionsRef = null;
  }

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        const region = {
            ...this.state.initialRegion,
            longitude,
            latitude
        };
        
        //Request to get direction for put random cars in the map
        request.origin = `${latitude},${longitude}`;

        console.log(request.origin);

        this.setState({initialRegion: region});
        this.props.setMapRegion(region);
        this.props.setPlaceOrigin(region);
        if (this.directionsRef !== null) {
          this.directionsRef.fetchRoute(
            request.directionsServiceBaseUrl,
            request.origin,
            request.waypoints,
            request.destination,
            request.apikey,
            request.mode,
            request.language
          ).then( result =>{
            const carsPos = PopulateCarsInMap(2,69978 /**5 km*/, origin, result.coordinates);
            console.log(carsPos);
            this.setState({carsPos});
          })
          .catch(err => {alert(err)});
        }
      },
      (error) => alert(error.message)
   );
  }

  render() {
    return (
      <View>
        <MapView 
          customMapStyle={CustomMapStyle}
          style={ HomeViewStyle.MapView }
          region={this.props.region || this.state.initialRegion}
          initialRegion={this.state.initialRegion}
          showsUserLocation
          followsUserLocation
          loadingEnabled
          loadingIndicatorColor={BLUE_COLOR}
          userLocationAnnotationTitle={'Você'}
          ref={ref => {this.mapRef = ref}}
        >
          <Fragment>
            <Directions onReady={(result) => {
                console.log(result);
                this.mapRef.fitToCoordinates(result.coordinates);
              }}
              onRef={el => {this.directionsRef = el}}
            />
            {
              this.props.destination &&
              <Marker 
                coordinate={this.props.destination} 
                anchor={{x: 0, y:0}} 
              />
            }
            {
              this.state.carsPos.map((item, index) => {
                return (
                  <Marker 
                    key={item.key}
                    coordinate={item}
                    image={require("../../../assets/icons/car-top.png")}
                  />
                )
              })
            }
          </Fragment>
        </MapView>
      </View>      
    );
  }
}

const mapStatesToProps = (state, props) => {
  const { region } =  state.MapPlacesReducer;
  const { origin, destination } = state.DirectionsReducers;
	return { region, origin, destination };
}

export default connect(mapStatesToProps, { setMapRegion, setPlaceOrigin }, null)(Map);