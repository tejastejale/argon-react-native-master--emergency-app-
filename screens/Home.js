import React, { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, theme } from "galio-framework";
import Mapbox, { Camera, MapView, PointAnnotation } from "@rnmapbox/maps";
import { requestAndroidLocationPermissions } from "@rnmapbox/maps";
import tw from "twrnc";

const { width } = Dimensions.get("screen");

Mapbox.setAccessToken(
  "pk.eyJ1IjoidGVqYXNjb2RlNDciLCJhIjoiY200d3pqMGh2MGtldzJwczgwMTZnbHc0dCJ9.KyxtwzKWPT9n1yDElo8HEQ"
);

const Home = () => {
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await requestAndroidLocationPermissions();
      if (permission) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Success:", position);
            alert(
              `Current Position: ${position.coords.latitude}, ${position.coords.longitude}`
            );
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Error getting location");
          }
        );
      } else {
        alert("Location permission denied");
      }
    } catch (error) {
      // console.error("Error requesting permissions:", error);
      alert("Error requesting permissions");
    }
  };

  return (
    <Block flex center style={styles.home}>
      <MapView
        style={tw`h-full w-full`}
        zoomEnabled={true}
        rotateEnabled={true}
      >
        <Camera
          zoomLevel={15}
          centerCoordinate={[73.776171, 19.996917]}
          animationMode="flyTo"
          animationDuration={5000}
        />
        <PointAnnotation id="marker" coordinate={[73.776171, 19.996917]} />
      </MapView>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
});

export default Home;
