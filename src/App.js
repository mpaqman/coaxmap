import React, { Component } from 'react';
import './App.css';

import { mapboxAccessToken } from './mapboxAccessToken.json'

import { Map, TileLayer, ScaleControl, ImageOverlay, Circle } from 'react-leaflet';

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Calendar from 'react-calendar';

const DEFAULT_VIEWPORT = {
  center: [49.299, -124.695],
  zoom: 8,
}
const farmAViewport = {
  center: [49.835, -124.602],
  zoom: 10,
}

const calendarStyle = {
  disply: 'inline-block',
  position: 'absolute',
  top: '0',
  right: '0',
  zIndex: '5000'
};

const mapContainerStyle = {
  position: 'absolute',
  top: '0',
  right: '0'
};

const farmAPolygon =  [[-124.63559,49.80121],[-124.73984,49.89259],[-124.95712,49.7919],[-124.76486,49.65252],[-124.63559,49.80121]]

function Zone(props){
  if(props.isVisible){
    return <Circle center = {[49.807, -124.811]} radius={8000} />
  }
  return null
}

/*function CoaxCalendar(props) {
  if (props.isVisible) {
    return <div className="calendarContainer" style={calendarStyle}>
    <Calendar
      onChange={this.onChangeDate}
      value={this.state.date}
    />
  </div>
  }
  return null;
}*/

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: DEFAULT_VIEWPORT,
      modal: false,//TODO make true. false for dev only
      chloroOpacity: 0,
      zoneVisible: false,
      calendarVisible: true,
      curOverlay: "overlays/2017/07/24/overlay.png",
      date: new Date('2017-07-10'),
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  resetView = () => {
    this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  onViewportChanged = viewport => {
    //lock zoom level
    /*if(viewport.zoom<8){
      viewport.zoom = 8;
    }else if(viewport.zoom > 10){
      viewport.zoom = 10;
    }*/
    //TODO: this still loads tiles from mapbox

    this.setState({ viewport })
    console.log("Zoom level: " + viewport.zoom)
  }
  
  onChangeDate = date => {
    this.setState({ date })

    let y = date.getFullYear().toString();
    let m = (date.getMonth() + 1).toString();
    let d = date.getDate().toString();
    (d.length === 1) && (d = '0' + d);
    (m.length === 1) && (m = '0' + m);
    let path = "overlays/" + y + "/" + m + "/" + d + "/overlay.png";

    this.setState({curOverlay: path});
    console.log("New overlay: " + path);
  }

  onNavSelected = (selected) => {
    console.log(selected);
    
    if(selected==="home"){
      this.resetView();
    }
    if(selected==="zonesOfInterest"){
      this.setState({ viewport: farmAViewport, zoneVisible: true })
    }
    if(selected==="info"){
      this.toggle();
    }
    if(selected==="dataProducts/chlorophyll"){
      this.setState({
        chloroOpacity: 0.9
      });
    }
    if(selected==="calendar"){
      //this.setState({ date: new Date('2018-11-23') });
    }
  }

  

  render() {

    return (
      <div id="page">
        <div>
        
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>CoaX SPECTRAL</ModalHeader>
          <ModalBody>
            Welcome to CoaX SPECTRAL! This is v0.1 of the map. More information should go here.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>View Map</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>

        <SideNav
          onSelect={(selected) => {
            this.onNavSelected(selected);
          }}
        >
          <SideNav.Toggle />
          <SideNav.Nav defaultSelected="home">
            <NavItem eventKey="home">
              <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                Home
              </NavText>
            </NavItem>
            <NavItem eventKey="dataProducts">
              <NavIcon>
              <i className="fas fa-layer-group" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                Data Products
              </NavText>
              <NavItem eventKey="dataProducts/chlorophyll">
                <NavText>
                  Chlorophyll 
                </NavText>
              </NavItem>
              <NavItem eventKey="dataProducts/surfaceTemp">
                <NavText>
                  Sea Surface Temp
                </NavText>
              </NavItem>
            </NavItem>
            <NavItem eventKey="zonesOfInterest">
              <NavIcon>
              <i className="fas fa-chart-area" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                Time Series Data
              </NavText>
            </NavItem>
            <NavItem eventKey="calendar">
              <NavIcon>
              <i className="fas fa-calendar" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                Date Range
              </NavText>
            </NavItem>
            <NavItem eventKey="info">
              <NavIcon>
                <i className="fas fa-info-circle" style={{ fontSize: '1.75em' }} />
              </NavIcon>
              <NavText>
                Info
              </NavText>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
          
        <div className="calendarContainer" style={calendarStyle}>
          <Calendar
            onChange={this.onChangeDate}
            value={this.state.date}
          />
        </div>

        <div className="mapContainer" stryle={mapContainerStyle}>
          <Map
            onViewportChanged={this.onViewportChanged}
            viewport={this.state.viewport}>
            <TileLayer

              attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}"
              id='mapbox.satellite'
              accessToken={ mapboxAccessToken }
            />

            <ScaleControl position="bottomright" imperial="false" />

            <ImageOverlay
              bounds={[[59.500, -139.001], [47.001, -121.502]]}
              url={this.state.curOverlay}
              opacity={this.state.chloroOpacity}
            />

            <Zone isVisible={this.state.zoneVisible} />

            <div id="mapid" className="mapStyle"></div>

          </Map>
        </div>
      </div>
    );
  }
}

export default App;
