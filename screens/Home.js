import React, { use, useEffect } from "react";
import { StyleSheet, Dimensions, Image, View } from "react-native";
import { Block, theme } from "galio-framework";
import Mapbox, { Camera, MapView, PointAnnotation } from "@rnmapbox/maps";
import { requestAndroidLocationPermissions } from "@rnmapbox/maps";
import * as Location from "expo-location";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import marker from "../assets/imgs/location-marker.png";
import { locationData } from "../constants/contantFunctions/contants";

const { width } = Dimensions.get("screen");

Mapbox.setAccessToken(
  "pk.eyJ1IjoidGVqYXNjb2RlNDciLCJhIjoiY200d3pqMGh2MGtldzJwczgwMTZnbHc0dCJ9.KyxtwzKWPT9n1yDElo8HEQ"
);

const Home = () => {
  const [locData, setLocData] = React.useState(null);
  const [loc, setLoc] = React.useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (loc) {
      let temp = locationData(loc);
      setLocData(temp);
    }
  }, [loc]);

  const requestPermission = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        // Get the current position
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLoc([location.coords.longitude, location.coords.latitude]);
      } else {
        alert("Location permission denied");
      }
    } catch (error) {
      console.error("Error requesting permissions or getting location:", error);
      alert("Error while getting location, please try again later!");
    }
  };

  return (
    <Block flex center style={styles.home}>
      {loc && locData ? (
        <MapView
          style={tw`h-full w-full`}
          styleURL="mapbox://styles/mapbox/outdoors-v12"
          zoomEnabled={true}
          rotateEnabled={true}
        >
          <Camera
            centerCoordinate={loc}
            zoomLevel={15}
            animationMode="none"
            animationDuration={3000}
            pitch={30}
          />
          <PointAnnotation
            // onSelected={(e) => console.log(e)} // display the location data of point annotation
            id="marker"
            style={styles.marker}
            coordinate={loc}
          >
            <View></View>
          </PointAnnotation>
        </MapView>
      ) : null}
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  marker: {
    height: 40,
    width: 40,
    resizeMode: "stretch",
  },
});

export default Home;
