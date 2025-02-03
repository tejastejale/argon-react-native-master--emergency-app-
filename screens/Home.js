import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { Block, Text } from "galio-framework";
import Mapbox, {
  Camera,
  FillExtrusionLayer,
  MapView,
  PointAnnotation,
} from "@rnmapbox/maps";
import ambulance from "../assets/imgs/Cars/ambulance.png";
import fire from "../assets/imgs/Cars/fire.png";
import police from "../assets/imgs/Cars/police.png";
import * as Location from "expo-location";
import tw from "twrnc";
import { locationData } from "../constants/contantFunctions/contants";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { Icon } from "../components";
import ArButton from "../components/Button";
const { height } = Dimensions.get("screen");
import * as Linking from "expo-linking";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import GeminiChat from "../components/ChatBot";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For AsyncStorage

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
  const [role, setRole] = useState("");
  // Bottom sheet snap points
  const snapPoints = [150, height * 0.5];

  useEffect(() => {
    const getRole = async () => {
      const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage
      const parsedToken = JSON.parse(token);
      setRole(parsedToken.data?.profile?.user_type);
    };
    getRole();
  }, []);

  useEffect(() => {
    requestPermission();

    const backAction = async () => {
      const token = await AsyncStorage.getItem("token"); // Get token from AsyncStorage
      const parsedToken = JSON.parse(token);
      if (parsedToken.data?.token) {
        // If token exists, exit the app
        BackHandler.exitApp();
        return true; // Prevent default back action
      } else {
        return false; // Proceed with default back action
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the listener on unmount
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

  const call = () => {
    Linking.openURL("tel:108");
  };

  const [open, setOpen] = useState(false);

  // Use shared value for open/close state
  const width = useSharedValue(0); // Start with 0 width
  const opacity = useSharedValue(0); // Start with 0 opacity

  // When the sidebar is opened or closed, the values are animated
  if (open) {
    width.value = withSpring(1, { stiffness: 100, damping: 20 });
    opacity.value = withSpring(1, { stiffness: 100, damping: 20 });
  } else {
    width.value = withSpring(0, { stiffness: 100, damping: 20 });
    opacity.value = withSpring(0, { stiffness: 100, damping: 20 });
  }

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      width: width.value * 100 + "%", // Cover the full screen width
      opacity: opacity.value, // Transition opacity
    };
  });

  return (
    <Block flex center style={tw`w-full`}>
      {isMapLoading && (
        <View
          style={tw`absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-white/80 z-1`}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={tw`mt-2 text-base text-black`}>Loading map...</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={tw`z-1000 absolute z-10 top-0 right-0 bg-purple-600 rounded-full p-5 m-2 py-4.5`}
      >
        <FontAwesome6 name="user-doctor" size={20} color="white" />
      </TouchableOpacity>
      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <View style={styles.bg}>
          <GeminiChat setOpen={setOpen} open={open} />
        </View>
      </Animated.View>
      {loc && locData && showMap && (
        <MapView
          style={tw`h-full w-full`}
          styleURL="mapbox://styles/mapbox/navigation-day-v1" // Change to night mode (dark theme)
          zoomEnabled
          rotateEnabled
          onMapIdle={handleMapLoad}
          onMapLoadingError={() =>
            alert("Something went wrong while loading the map!")
          }
        >
          {/* 3D Buildings Layer */}
          {/* <FillExtrusionLayer
            id="3d-buildings"
            sourceLayerID="building"
            style={{
              fillExtrusionColor: [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "#d6e0f0", // Low buildings: light beige
                50,
                "#d6e0f0", // Medium buildings: soft purple
                100,
                "#d6e0f0", // Tall buildings: deeper purple
              ],
              fillExtrusionHeight: [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"],
              ],
              fillExtrusionBase: ["get", "min_height"],
              fillExtrusionOpacity: 0.85,
            }}
          /> */}

          {/* 3D Custom Layer for Dynamic Effects */}
          <FillExtrusionLayer
            id="3d-dynamic"
            sourceLayerID="building"
            style={{
              fillExtrusionColor: [
                "case",
                ["==", ["get", "type"], "skyscraper"],
                "#ff5722", // Highlight skyscrapers with a bright color
                "#d6e0f0", // Default color for other buildings
              ],
              fillExtrusionHeight: [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                0,
                200,
                300, // Dynamic height for specific types
              ],
              fillExtrusionOpacity: 0.9,
            }}
          />

          {/* Camera Settings */}
          <Camera
            centerCoordinate={loc}
            zoomLevel={16}
            animationMode="none"
            animationDuration={3000}
            pitch={60} // Gives the map a 3D angle
          />

          {/* Marker for the Current Location */}
          <PointAnnotation id="marker" style={tw`h-10 w-10`} coordinate={loc}>
            <View />
          </PointAnnotation>
        </MapView>
      )}
      {!showMap && (
        <View style={tw`flex h-full items-center justify-center`}>
          <Text
            style={tw`text-lg text-center text-red-400 font-medium tracking-widest`}
          >
            Please grant location!
          </Text>
        </View>
      )}
      {role === "driver" && (
        <BottomSheet
          containerStyle={{ zIndex: 1000 }}
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
          <BottomSheetView style={tw`flex-1 px-4`}>
            <BottomSheetScrollView
              style={tw`flex-1`}
              contentContainerStyle={tw`pb-10`}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={tw`bg-white active:bg-red-400 p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-between items-center`}
              >
                <View style={tw`flex flex-row items-center gap-2 py-2`}>
                  <View>
                    <FontAwesome
                      name="map-marker"
                      size={40}
                      style={tw`text-red-500 mr-2`}
                    />
                  </View>
                  <View style={tw`flex`}>
                    <Text style={tw`text-lg font-bold`}>Name</Text>
                    <Text style={tw`text-sm text-gray-500`}>Number</Text>
                  </View>
                </View>
                <Icon
                  name="phone"
                  family="FontAwesome"
                  size={40}
                  style={tw`text-green-500 mr-1`}
                />
              </View>
            </BottomSheetScrollView>
          </BottomSheetView>
        </BottomSheet>
      )}
      {role === "customer" && (
        <BottomSheet
          containerStyle={{ zIndex: 1000 }}
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
          <BottomSheetView style={tw`flex-1 px-4`}>
            <ScrollView
              style={tw`flex-1`}
              contentContainerStyle={tw`pb-10`}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <View
                onTouchStart={call}
                style={tw`bg-white active:bg-red-400 p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-between items-center`}
              >
                <View style={tw`flex flex-row items-center gap-2 py-2`}>
                  <View>
                    <Icon
                      name="phone"
                      family="FontAwesome"
                      size={40}
                      style={tw`text-green-500 mr-1`}
                    />
                  </View>
                  <View style={tw`flex`}>
                    <Text style={tw`text-lg font-bold`}>Call 108</Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Call directly to emergency helpline
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={tw`bg-white p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-between items-center`}
              >
                <View style={tw`flex flex-row items-center`}>
                  <Image source={ambulance} style={tw`w-16 h-20 mr-5`} />
                  <View style={tw`flex`}>
                    <Text style={tw`text-lg font-bold`}>Ambulance</Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Notify nearest ambulances
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={tw`bg-white p-3 rounded-lg mb-3 h-fit shadow-md flex flex-row justify-between items-center`}
              >
                <View style={tw`flex flex-row items-center`}>
                  <Image source={fire} style={tw`w-16 h-16 mr-5`} />
                  <View style={tw`flex`}>
                    <Text style={tw`text-lg font-bold`}>Fire Brigade</Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Notify nearest fire brigade
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={tw`bg-white p-3 rounded-lg h-fit shadow-md flex flex-row justify-between items-center`}
              >
                <View style={tw`flex flex-row items-center`}>
                  <Image source={police} style={tw`w-14 h-16 mr-5`} />
                  <View style={tw`flex`}>
                    <Text style={tw`text-lg font-bold`}>Police</Text>
                    <Text style={tw`text-sm text-gray-500`}>
                      Notify nearest police
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      )}
    </Block>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    // backgroundColor: "red", // Semi-transparent dark background
    zIndex: 10,
  },
  bg: {
    flex: 1,
    // backgroundColor: "red", // Your sidebar's background color
  },
  toggleButton: {
    position: "absolute",
    bottom: 50,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
