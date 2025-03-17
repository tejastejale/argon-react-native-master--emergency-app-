import React, { useEffect, useRef, useState } from "react";
import Dialog from "react-native-dialog";
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
import Ambulance from "../assets/imgs/Cars/ambulance.png";
import fire from "../assets/imgs/Cars/fire.png";
import Police from "../assets/imgs/Cars/police.png";
import * as Location from "expo-location";
import tw from "twrnc";
import { locationData } from "../constants/contantFunctions/contants";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Dimensions } from "react-native";
import { Icon } from "../components";
const { height } = Dimensions.get("screen");
import * as Linking from "expo-linking";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import GeminiChat from "../components/ChatBot";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For AsyncStorage
import { useWebSocket } from "./socket";
import { acceptRequest, requestCar } from "./API/actions/request";
import RadarPing from "./Widget/temp";
import pin from "../assets/imgs/pin.png";

Mapbox.setAccessToken(
  "pk.eyJ1IjoidGVqYXNjb2RlNDciLCJhIjoiY200d3pqMGh2MGtldzJwczgwMTZnbHc0dCJ9.KyxtwzKWPT9n1yDElo8HEQ"
);

const Home = () => {
  const bottomSheetRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [socketData, setSocketData] = useState([]);
  const [locData, setLocData] = useState(null);
  const [loc, setLoc] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [sheetArrow, setSheetArrow] = useState(0);
  const [role, setRole] = useState("");
  // Bottom sheet snap points
  const snapPoints = [150, height * 0.5];
  const [open, setOpen] = useState(false);
  const [isRequested, setIsRequested] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const width = useSharedValue(0); // Start with 0 width
  const opacity = useSharedValue(0); // Start with 0 opacity
  const [requestAccepted, setRequestAccepted] = useState("");
  const translateX = useSharedValue(0);
  const { sendLocation } = useWebSocket(loc, setSocketData);

  // When the sidebar is opened or closed, the values are animated
  if (open) {
    width.value = withSpring(1, { stiffness: 100, damping: 20 });
    opacity.value = withSpring(1, { stiffness: 100, damping: 20 });
  } else {
    width.value = withSpring(0, { stiffness: 100, damping: 20 });
    opacity.value = withSpring(0, { stiffness: 100, damping: 20 });
  }

  // useEffect(() => {
  //   console.log("\n\n\n", socketData);
  // }, [socketData]);

  useEffect(() => {
    const saveSelectedData = async () => {
      try {
        if (selectedData !== null) {
          const jsonValue = JSON.stringify(selectedData);
          // console.log("Saving selectedData to AsyncStorage:", jsonValue);
          await AsyncStorage.setItem("selectedData", jsonValue);
        }
        // } else {
        //   console.log(
        //     "Not saving selectedData because it is null or undefined"
        //   );
        // }
      } catch (error) {
        console.error("Error saving selectedData:", error);
      }
    };

    saveSelectedData();
  }, [selectedData]);

  useEffect(() => {
    const saveToLocal = async () => {
      try {
        if (requestAccepted !== "")
          await AsyncStorage.setItem(
            "requestAccepted",
            JSON.stringify(requestAccepted)
          );
      } catch (error) {
        console.error("Error saving requestAccepted:", error);
      }
    };
    saveToLocal();
  }, [requestAccepted]);

  useEffect(() => {
    const saveToLocal = async () => {
      try {
        if (isRequested !== "") {
          await AsyncStorage.setItem(
            "isRequested",
            JSON.stringify(isRequested)
          );
        }
      } catch (error) {
        console.error("Error saving isRequested:", error);
      }
    };

    saveToLocal();
  }, [isRequested]);

  useEffect(() => {
    const saveToLocal = async () => {
      try {
        if (typeof socketData === "object" && !Array.isArray(socketData)) {
          console.log("saving this data", socketData);
          await AsyncStorage.setItem("socketData", JSON.stringify(socketData));
        }
      } catch (error) {
        console.error("Error saving socketData:", error);
      }
    };

    saveToLocal();
  }, [socketData]);

  useEffect(() => {
    const loadFromLocal = async () => {
      try {
        const isRequestedStr = await AsyncStorage.getItem("isRequested");
        const requestAcceptedStr = await AsyncStorage.getItem(
          "requestAccepted"
        );
        const selectedDataStr = await AsyncStorage.getItem("selectedData");
        const socketDataStr = await AsyncStorage.getItem("socketData");
        // console.log(socketDataStr);
        // Parse the string to boolean or keep as string based on your needs
        setIsRequested(JSON.parse(isRequestedStr));

        // Directly parse to boolean
        setRequestAccepted(JSON.parse(requestAcceptedStr));

        setSelectedData(JSON.parse(selectedDataStr));

        const temp = JSON.parse(socketDataStr);
        if (typeof temp === "object" && !Array.isArray(temp)) {
          setSocketData(temp);
        }
      } catch (error) {
        console.error("Error loading from local storage:", error);
      }
    };

    loadFromLocal();
  }, []);

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
    const getData = async () => {
      if (loc) {
        let temp = await locationData(loc);
        setLocData(temp);
      }
    };
    getData();
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

  const call = (num) => {
    Linking.openURL(`tel:${num}`);
  };

  const sidebarStyle = useAnimatedStyle(() => {
    return {
      width: width.value * 100 + "%", // Cover the full screen width
      opacity: opacity.value, // Transition opacity
    };
  });

  const handleRequest = async (type) => {
    let body;
    if (loc[0] && loc[1])
      body = {
        request_type: JSON.stringify(type),
        latitude: JSON.stringify(loc[1]),
        longitude: JSON.stringify(loc[0]),
        additional_details: JSON.stringify(locData),
      };
    else {
      alert("Could not get your location right now!");
      return;
    }
    // let resss = await AsyncStorage.getItem("token");
    // console.log(JSON.stringify(resss, null, 2));

    try {
      const res = await requestCar(body);
      console.log(JSON.stringify(res, null, 2));
      if (res?.code === 201) {
        setIsRequested(true);
      } else alert("Something went wrong!!");
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  };

  const returnImageSource = (type) => {
    switch (type) {
      case "Fire Brigade":
        return fire;
      case "Ambulance":
        return Ambulance;
      case "Police":
        return Police;
      default:
        return type;
    }
  };

  const parseAdditionalData = (data) => {
    if (typeof data === "string") {
      const temp = JSON.parse(data?.data?.additional_details);
      return temp?.display_name;
    } else if (typeof data?.data?.additional_details === "string") {
      const temp = JSON.parse(data.data?.additional_details);
      return temp?.display_name;
    } else return data?.data?.additional_details?.display_name;
  };

  const handleAccept = async (id) => {
    try {
      const res = await acceptRequest(id);
      if (res?.code === 200) {
        setRequestAccepted(true);
      } else {
        alert("Something went wrong!");
        console.log(res);
      }
    } catch (error) {
      alert("Something went wrong!");
      console.log(error);
    }
  };

  const showDialog = (data) => {
    setSelectedId(data.id);
    setSelectedData(data);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    if (selectedId) {
      handleAccept(selectedId);
      setVisible(false);
    }
  };

  // useEffect(() => {
  //   console.log(selectedData, "=======================");
  //   console.log(JSON.stringify(selectedData?.data?.location.lat, null, 2));
  // }, [selectedData]);

  return (
    <Block flex center style={tw`w-full`}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>Confirm Acceptance</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to accept this request?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Accept" onPress={handleConfirm} />
      </Dialog.Container>
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
        style={tw`z-1000 absolute z-10 top-0 right-0 bg-violet-600 rounded-full p-5 m-2 py-4.5`}
      >
        <FontAwesome6 name="user-doctor" size={20} color="white" />
      </TouchableOpacity>
      <Animated.View style={[styles.sidebar, sidebarStyle, { zIndex: 1000 }]}>
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
          {/* 3D Custom Layer for Dynamic Effects */}
          <FillExtrusionLayer
            id="3d-dynamic"
            sourceLayerID="building"
            style={{
              fillExtrusionColor: [
                "case",
                ["==", ["get", "type"], "skyscraper"],
                "#000", // Highlight skyscrapers with a bright color
                "#d6e0f0", // Default color for other buildings
              ],
              fillExtrusionHeight: [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                0,
                120,
                500, // Dynamic height for specific types
              ],
              fillExtrusionOpacity: 0.5,
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
            {/* <View /> */}
            {role === "driver" ? (
              <View />
            ) : (
              <View style={tw`h-10 w-10`}>
                <Icon
                  name={"squared-plus"}
                  size={30}
                  family="Entypo"
                  style={tw`text-red-500`}
                />
              </View>
            )}
          </PointAnnotation>

          {socketData?.type === "order_accepted_event" &&
            "driver" in socketData && (
              // console.log(socketData?.location)
              <PointAnnotation
                id="driver"
                style={tw`h-10 w-10`}
                coordinate={[
                  socketData?.location?.lon,
                  socketData?.location?.lat,
                ]}
              >
                <View />
              </PointAnnotation>
            )}
          {console.log(selectedData)}
          {selectedData?.data?.location?.lat &&
            selectedData?.data?.location?.lon && (
              <PointAnnotation
                id="driver2"
                style={tw`h-10 w-10`}
                coordinate={[
                  selectedData?.data?.location?.lon,
                  selectedData?.data?.location?.lat,
                ]}
              >
                <View style={tw`h-10 w-10`}>
                  <Icon
                    name={"squared-plus"}
                    size={30}
                    family="Entypo"
                    style={tw`text-red-500`}
                  />
                </View>
              </PointAnnotation>
            )}
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
          containerStyle={{ zIndex: 10 }}
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
          {requestAccepted ? (
            <BottomSheetScrollView
              style={tw`flex-1 px-4`}
              contentContainerStyle={tw`pb-10`}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              <TouchableOpacity
                onPress={() => {
                  setRequestAccepted(false);
                  setSelectedData(null);
                }}
                style={tw`bg-violet-600 p-3 py-3 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-center items-center`}
              >
                <Text style={tw`text-white`}>Cancle Request</Text>
              </TouchableOpacity>
              <View
                style={tw`bg-white p-4 h-fit rounded-lg mb-3 shadow-md flex items-center`}
              >
                <View
                  style={tw`w-full flex flex-row justify-between items-center pr-2`}
                >
                  <View style={tw`flex flex-row items-center `}>
                    <View
                      style={[
                        { flexShrink: 1 },
                        tw`flex w-full overflow-hidden`,
                      ]}
                    >
                      <Text style={tw`text-sm text-gray-500`}>
                        {parseAdditionalData(selectedData)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={tw`bg-white p-4 h-fit rounded-lg mb-3 shadow-md flex items-center`}
              >
                <View
                  style={tw`w-full flex flex-row justify-between items-center pr-2`}
                >
                  <View style={tw`w-[90%] flex flex-row items-center`}>
                    <View style={tw`flex w-full overflow-hidden`}>
                      <Text style={tw`text-lg text-gray-500`}>
                        {selectedData?.data?.user?.phone}
                      </Text>
                    </View>
                  </View>
                  <Icon
                    onTouchStart={() => {
                      call(selectedData?.data?.user?.phone);
                    }}
                    name="phone"
                    family="FontAwesome"
                    size={40}
                    style={tw`text-green-500 mr-2`}
                  />
                </View>
              </View>
            </BottomSheetScrollView>
          ) : (
            <BottomSheetScrollView
              style={tw`flex-1 px-4`}
              contentContainerStyle={tw`pb-10`}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {socketData?.length > 0 ? (
                socketData?.map((data, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => showDialog(data)}
                    style={tw`bg-white p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row items-center`}
                  >
                    <View
                      style={tw`w-full flex flex-row justify-between w-full items-center pr-2`}
                    >
                      <View style={tw`flex flex-row items-center `}>
                        <Image
                          source={returnImageSource(data.data?.request_type)}
                          style={tw`w-20 h-20 mr-3`}
                        />
                        <View
                          style={[
                            { flexShrink: 1 },
                            tw`flex w-full overflow-hidden`,
                          ]}
                        >
                          <Text style={tw`text-lg font-bold`}>
                            {data.data?.request_type} Needed
                          </Text>
                          <Text style={tw`text-sm text-gray-500`}>
                            {parseAdditionalData(data)}
                          </Text>
                        </View>
                      </View>
                      {/* <Icon
                      onTouchStart={() => call(data.data?.user?.phone)}
                      name="phone"
                      family="FontAwesome"
                      size={40}
                      style={tw`text-green-500 mr-2 w-[10%]`}
                    /> */}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View
                  style={tw`bg-white p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-between items-center`}
                >
                  <View
                    style={tw`flex flex-row justify-between w-full items-center`}
                  >
                    <View style={tw`flex flex-row items-center gap-3 py-2`}>
                      <Icon
                        name={"coffee"}
                        size={35}
                        family="FontAwesome"
                        style={tw`text-orange-700`}
                      />
                      <View style={tw`flex`}>
                        <Text style={tw`text-lg font-bold`}>
                          No requests for now
                        </Text>
                        <Text style={tw`text-sm text-gray-500 w-fit`}>
                          Relax but hang tight, a request might come in any
                          moment!
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      )}
      {console.log(socketData, "data")}
      {role === "customer" && (
        <BottomSheet
          containerStyle={{ zIndex: 100 }}
          ref={bottomSheetRef}
          enableDynamicSizing
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
          {isRequested ? (
            <BottomSheetScrollView style={tw`flex-1 px-4`}>
              {socketData?.type === "order_accepted_event" &&
              "driver" in socketData ? (
                <>
                  <View
                    style={tw`bg-white p-4 h-fit rounded-lg mb-3 shadow-md flex items-center`}
                  >
                    <View
                      style={tw`w-full flex flex-row justify-between items-center pr-2`}
                    >
                      <View style={tw`flex flex-row items-center `}>
                        <View
                          style={[
                            { flexShrink: 1 },
                            tw`flex w-full overflow-hidden`,
                          ]}
                        >
                          <Text style={tw`text-sm text-gray-500`}>
                            {socketData?.driver?.name}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    style={tw`bg-white p-4 h-fit rounded-lg mb-3 shadow-md flex items-center`}
                  >
                    <View
                      style={tw`w-full flex flex-row justify-between items-center pr-2`}
                    >
                      <View style={tw`w-[90%] flex flex-row items-center`}>
                        <View style={tw`flex w-full overflow-hidden`}>
                          <Text style={tw`text-lg text-gray-500`}>
                            {socketData?.driver?.phone}
                          </Text>
                        </View>
                      </View>
                      <Icon
                        onTouchStart={() => {
                          call(socketData?.driver?.phone);
                        }}
                        name="phone"
                        family="FontAwesome"
                        size={40}
                        style={tw`text-green-500 mr-2`}
                      />
                    </View>
                  </View>
                </>
              ) : (
                <ScrollView
                  style={tw`flex-1`}
                  contentContainerStyle={tw`pb-10`}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={tw`text-lg font-medium text-center mb-2`}>
                    Finding the nearest driver
                  </Text>
                  <View
                    style={tw`bg-white active:bg-red-400 p-3 py-2 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-center items-center overflow-hidden`}
                  >
                    <View
                      style={tw`flex flex-row justify-between items-center`}
                    >
                      <View style={tw`w-1/3 bg-violet-600 h-[2px]`} />
                      <RadarPing />
                      <View style={tw`w-1/3 bg-violet-600 h-[2px]`} />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsRequested(false)}
                    style={tw`bg-violet-600 p-3 py-3 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-center items-center`}
                  >
                    <Text style={tw`text-white`}>Cancle Request</Text>
                  </TouchableOpacity>
                  <View style={tw`flex gap-3 text-md`}>
                    <View
                      style={tw`bg-white p-3 rounded-lg h-fit shadow-md flex flex-row justify-between items-center`}
                    >
                      <View style={tw`flex flex-row items-center`}>
                        <View style={tw`flex`}>
                          <Text style={tw`text-lg font-bold`}>
                            How this works
                          </Text>
                          <Text style={tw`text-sm text-gray-500`}>
                            This sends your request to all the available drivers
                            and when they accept the request you both can be
                            with each other as soon as possible
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={tw`bg-white p-3 rounded-lg mb-3 h-fit shadow-md flex flex-row justify-between items-center`}
                    >
                      <View style={tw`flex flex-row items-center`}>
                        <View style={tw`flex`}>
                          <Text style={tw`text-lg font-bold`}>Note</Text>
                          <Text style={tw`text-sm text-gray-500`}>
                            We don't know how much time this could take
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetScrollView style={tw`flex-1 px-4`}>
              <ScrollView
                style={tw`flex-1`}
                contentContainerStyle={tw`pb-10`}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => call("108")}
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
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRequest(0)}
                  style={tw`bg-white p-3 py-1 h-fit rounded-lg mb-3 shadow-md flex flex-row justify-between items-center`}
                >
                  <View style={tw`flex flex-row items-center`}>
                    <Image source={Ambulance} style={tw`w-16 h-20 mr-5`} />
                    <View style={tw`flex`}>
                      <Text style={tw`text-lg font-bold`}>Ambulance</Text>
                      <Text style={tw`text-sm text-gray-500`}>
                        Notify nearest ambulances
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRequest(1)}
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
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleRequest(2)}
                  style={tw`bg-white p-3 rounded-lg h-fit shadow-md flex flex-row justify-between items-center`}
                >
                  <View style={tw`flex flex-row items-center`}>
                    <Image source={Police} style={tw`w-14 h-16 mr-5`} />
                    <View style={tw`flex`}>
                      <Text style={tw`text-lg font-bold`}>Police</Text>
                      <Text style={tw`text-sm text-gray-500`}>
                        Notify nearest police
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </BottomSheetScrollView>
          )}
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
