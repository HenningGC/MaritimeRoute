import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import portsData from './PortData';
import { findNearest } from 'geolib';

class MapComponent extends Component {
  state = {
    coordinates: '',
    startMarker: null,
    endMarker: null,
  };

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoianBicCIsImEiOiJjbHVwZDF4ZjEyM3E4MnFvbDltbTQ4bzl6In0.u4_hbqslKZv_0TZWETKSIQ';
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
    this.map.on('mousemove', this.handleMouseMove);
    this.map.on('click', this.handleMapClick);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pathCoordinates && prevProps.pathCoordinates !== this.props.pathCoordinates) {
      this.plotPath();
    }
  }

  handleMouseMove = (e) => {
    this.setState({
      coordinates: JSON.stringify(e.lngLat.wrap()),
    });
  };

  handleMapClick = (e) => {
    console.log('handleMapClick called');
    const { lngLat } = e;
    console.log('Clicked coordinates:', lngLat);
    if (!this.state.startMarker) {
      this.addMarker(lngLat, 'start');
      this.props.onPointSelect(lngLat, 'start');
    } else if (!this.state.endMarker) {
      this.addMarker(lngLat, 'end');
      this.props.onPointSelect(lngLat, 'end');
    }
  };

  addMarker(lngLat, type) {
    console.log('addMarker called with type:', type);
    const color = type === 'start' ? 'blue' : 'purple';
    const label = type === 'start' ? 'Start' : 'End';
    const marker = new mapboxgl.Marker({ color })
      .setLngLat([lngLat.lng, lngLat.lat])
      .setPopup(new mapboxgl.Popup().setText(label))
      .addTo(this.map);
    if (type === 'start') {
      console.log('Setting startMarker state');
      this.setState({ startMarker: marker });
    } else if (type === 'end') {
      console.log('Setting endMarker state');
      this.setState({ endMarker: marker });
    }
  }

  removeMarker(type) {
    console.log('removeMarker called with type:', type);
    if (type === 'start' && this.state.startMarker) {
      console.log('Removing start marker');
      this.state.startMarker.remove();
      this.setState({ startMarker: null });
    } else if (type === 'end' && this.state.endMarker) {
      console.log('Removing end marker');
      this.state.endMarker.remove();
      this.setState({ endMarker: null });
    }
  }

  plotPath() {
    const { pathCoordinates } = this.props;
    console.log('Path coordinates:', pathCoordinates);
  
    if (this.map.getSource('route')) {
      console.log('Updating existing route source');
      this.map.getSource('route').setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: pathCoordinates,
        },
      });
    } else {
      console.log('Adding new route source and layer');
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: pathCoordinates,
          },
        },
      });
  
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });
    }
  
    // Adjust map viewport to fit the path
    this.map.fitBounds(pathCoordinates, { padding: 50 });
  }

  removeRoute() {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
  }

  clearMap() {
    this.removeMarker('start');
    this.removeMarker('end');
    this.removeRoute();
  }

  render() {
    return (
      <div>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{ width: '100%', height: '400px' }}
        />
        <button onClick={() => this.removeMarker('start')}>
          Remove Start Marker
        </button>
        <button onClick={() => this.removeMarker('end')}>
          Remove End Marker
        </button>
        <button onClick={() => this.removeRoute()}>
          Remove Route
        </button>
        <button onClick={() => this.clearMap()}>
          Clear Map
        </button>
      </div>
    );
  }
}

export default MapComponent;