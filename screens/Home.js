import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Image } from "react-native";
import { Block, Text } from "galio-framework";
import Mapbox, { Camera, MapView, PointAnnotation } from "@rnmapbox/maps";
import ambulance from "../assets/imgs/Cars/ambulance.png";
import fire from "../assets/imgs/Cars/fire.png";
import police from "../assets/imgs/Cars/police.png";
import * as Location from "expo-location";
import tw from "twrnc";
import { locationData } from "../constants/contantFunctions/contants";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { Icon } from "../components";
const { height } = Dimensions.get("screen");

Mapbox.setAccessToken(
  "pk.eyJ1IjoidGVqYXNjb2RlNDciLCJhIjoiY200d3pqMGh2MGtldzJwczgwMTZnbHc0dCJ9.KyxtwzKWPT9n1yDElo8HEQ"
);

const Home = () => {
  const bottomSheetRef = useRef(null);
  const [locData, setLocData] = useState(null);
  const [loc, setLoc] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [sheetArrow, setSheetArrow] = useState(0);
  // Bottom sheet snap points
  const snapPoints = [150, height * 0.4];

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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLoc([location.coords.longitude, location.coords.latitude]);
        return;
      } else {
        setIsMapLoading(false);
        setShowMap(false);
        alert("You must grant location permission for tracking!");
      }
    } catch (error) {
      setShowMap(false);
      console.error("Error requesting permissions or getting location:", error);
      alert("Error while getting location, please try again later!");
    }
  };

  const handleMapLoad = () => {
    setIsMapLoading(false);
  };

  return (
    <Block flex center style={tw`w-full`}>
      {isMapLoading && (
        <View
          style={tw`absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-white/80 z-10`}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={tw`mt-2 text-base text-black`}>Loading map...</Text>
        </View>
      )}
      {loc && locData && showMap && (
        <MapView
          style={tw`h-full w-full`}
          styleURL="mapbox://styles/mapbox/outdoors-v12"
          zoomEnabled
          rotateEnabled
          onMapIdle={handleMapLoad}
          onMapLoadingError={() =>
            alert("Something went wrong while loading the map!")
          }
        >
          <Camera
            centerCoordinate={loc}
            zoomLevel={15}
            animationMode="none"
            animationDuration={3000}
            pitch={30}
          />
          <PointAnnotation id="marker" style={tw`h-10 w-10`} coordinate={loc}>
            <View />
          </PointAnnotation>
        </MapView>
      )}
      {!showMap && (
        <View style={tw`flex h-full align-center justify-center`}>
          <Text
            style={tw`text-lg text-center text-red-400 font-medium tracking-widest`}
          >
            Please grant location permission!
          </Text>
        </View>
      )}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        onChange={(e) => setSheetArrow(e)}
        backgroundStyle={tw`bg-gray-100 rounded-t-3xl`}
        handleIndicatorStyle={tw`hidden`}
        handleComponent={() => (
          <View style={tw`items-center my-2`}>
            <Icon
              name={sheetArrow === 0 ? "chevron-up" : "chevron-down"}
              size={30}
              family="entypo"
              style={tw`text-gray-500`}
            />
          </View>
        )}
      >
        <BottomSheetView style={tw`h-full px-4`}>
          <View
            style={tw`bg-white p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row items-center`}
          >
            <Image source={ambulance} style={tw`w-16 h-20 mr-5`} />
            <View style={tw`flex`}>
              <Text style={tw`text-lg font-bold`}>Ambulance</Text>
              <Text style={tw`text-sm text-gray-500`}>
                Notify nearest ambulances to react you
              </Text>
            </View>
          </View>
          <View
            style={tw`bg-white p-3 rounded-lg mb-3 h-fit shadow-md flex flex-row items-center`}
          >
            <Image source={fire} style={tw`w-16 h-16 mr-5`} />
            <View style={tw`flex`}>
              <Text style={tw`text-lg font-bold`}>Fire Brigade</Text>
              <Text style={tw`text-sm text-gray-500`}>
                Notify nearest fire brigade to react you
              </Text>
            </View>
          </View>
          <View
            style={tw`bg-white p-3 rounded-lg mb-3 h-fit shadow-md flex flex-row items-center`}
          >
            <Image source={police} style={tw`w-14 h-16 mr-5`} />
            <View style={tw`flex`}>
              <Text style={tw`text-lg font-bold`}>Police</Text>
              <Text style={tw`text-sm text-gray-500`}>
                Notify nearest police to react you
              </Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Block>
  );
};

export default Home;
