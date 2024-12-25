import React, { useEffect } from "react";
import { StyleSheet, Dimensions, Image, View } from "react-native";
import { Block, theme } from "galio-framework";
import Mapbox, { Camera, MapView, PointAnnotation } from "@rnmapbox/maps";
import { requestAndroidLocationPermissions } from "@rnmapbox/maps";
import * as Location from "expo-location";
import tw from "twrnc";
import Ionicons from "@expo/vector-icons/Ionicons";
import marker from "../assets/imgs/location-marker.png";

const { width } = Dimensions.get("screen");

Mapbox.setAccessToken(
  "pk.eyJ1IjoidGVqYXNjb2RlNDciLCJhIjoiY200d3pqMGh2MGtldzJwczgwMTZnbHc0dCJ9.KyxtwzKWPT9n1yDElo8HEQ"
);

const Home = () => {
  const [locData, setLocData] = React.useState(null);
  const [loc, setLoc] = React.useState([73.776171, 19.996917]);

  useEffect(() => {
    requestPermission();
    locationData();
  }, []);

  const url = (lat, long) => {
    let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${long}&lon=${lat}`;
    return url;
  };

  const locationData = () => {
    fetch(url(73.776171, 19.996917))
      .then((res) => res.json())
      .then((data) => setLocData(data));
  };

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
      <MapView
        style={tw`h-full w-full`}
        styleURL="mapbox://styles/mapbox/outdoors-v12"
        zoomEnabled={true}
        rotateEnabled={true}
      >
        <Camera
          zoomLevel={15}
          centerCoordinate={loc}
          animationMode="flyTo"
          animationDuration={3000}
          pitch={30}
        />
        <PointAnnotation id="marker" coordinate={loc}>
          <View>
            <Image
              style={styles.marker}
              source={require("../assets/imgs/location-marker.png")}
            />
          </View>
        </PointAnnotation>
      </MapView>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  marker: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
});

export default Home;
