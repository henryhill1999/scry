import React from "react";
import { useSelector } from "react-redux";
import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { connect } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomPopup from "./CustomPopup";

import { createUseStyles } from "react-jss";
import geonames from "../utils/geonames";
import geoData from "../utils/geo_data";

// necessary to allow for correct loading of marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const useStyles = createUseStyles((theme) => ({
  map: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
}));

const MapWrapper = (props) => {
  const classes = useStyles(props);

  //   const mapObjects: MapObject[] = useSelector((state) =>
  //     Object.values({
  //       ...state.observations.events,
  //       ...state.observations.documents,
  //     }).filter(
  //       obj => globalTime >= obj.dateRange[0] && globalTime <= obj.dateRange[1],
  //     ),
  //   );

  const mapObjects = [
    { uuid: "1", coord: [44, -90] },
    { uuid: "2", coord: [45, -90] },
  ];

  return (
    <>
      <Map className={classes.map} center={[35, -100]} zoom={5}>
        {props.children}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: US National Park Service"
          minZoom={4}
          maxZoom={10}
        />
        {mapObjects.map((obs) => (
          <Marker key={obs.uuid} position={obs.coord}>
            {/* <Popup>*/}
            {/* <CustomPopup /> */}
            {/* title={obs.name} description={obs.description} */}
            {/* </Popup> */}
          </Marker>
        ))}
        {Object.keys(props.mentions).map((obs, i) => {
          return (
            <Circle
              key={geoData[obs]["name"]}
              center={[geoData[obs]["latitude"], geoData[obs]["longitude"]]}
              radius={10000 * Math.sqrt(props.mentions[obs].count)}
            >
              <Popup>
                <CustomPopup
                  data={{
                    mentions: props.mentions[obs].count,
                    literals: props.mentions[obs].literals,
                    ...geoData[obs],
                  }}
                />
              </Popup>
              {/* title={obs.name} description={obs.description} */}
              {/* </Popup> */}
            </Circle>
          );
        })}
      </Map>
    </>
  );
};

const mapStateToProps = (state) => ({
  documents: state.documents,
  mentions: state.mentions,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);