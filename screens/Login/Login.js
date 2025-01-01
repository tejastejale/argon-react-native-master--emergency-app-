import { Button } from "galio-framework";
import React, { useState, useEffect } from "react";
import { Text, Image, Animated, View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import ArInput from "../../components/Input";
import ArButton from "../../components/Button";
import { useIsFocused } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function UserLogin({ navigation }) {
  const isFocused = useIsFocused();
  const [InputData, setInputData] = useState({
    name: "",
    phone: "",
    nameError: "",
    phoneError: "",
    isValid: false, // Initially invalid
  });

  const animatedValue = new Animated.Value(-500); // Direct use of Animated value

  const carouselData = [
    {
      id: 1,
      title: "Emergency Support",
      description: "Quick and reliable support during emergencies.",
      image: require("../../assets/imgs/Login/driver.png"),
    },
    {
      id: 2,
      title: "Rapid Assistance",
      description: "Connecting you with nearby helpers.",
      image: require("../../assets/imgs/Login/tp.png"),
    },
    {
      id: 3,
      title: "Safe & Secure",
      description: "Prioritizing your safety in every step.",
      image: require("../../assets/imgs/Login/user.png"),
    },
  ];

  // Animation effect on screen load
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 0, // Move to the position
      friction: 6, // Spring friction
      tension: 50, // Spring tension
      useNativeDriver: true, // For smooth performance
    }).start();
  }, []);

  const handleChange = (name, value) => {
    setInputData({ ...InputData, [name]: value }, () => {
      // Re-run validation after state update
      validateFields();
    });
  };

  const validateFields = () => {
    let errors = {}; // To hold error messages

    // Check if name is empty first
    if (InputData.name.trim().length === 0) {
      errors.nameError = "Name is required";
    } else {
      // Check if name has at least 3 words
      const nameSpaces = InputData.name.trim().split(/\s+/).length;
      if (nameSpaces < 3) {
        errors.nameError = "Enter a valid name with at least 3 words";
      }
    }

    // Validate phone number (should be 10 digits)
    if (InputData.phone.length !== 10) {
      errors.phoneError = "Enter a valid Phone Number";
    }

    // If no errors, clear errors and set validity to true
    const isValid = Object.keys(errors).length === 0;

    // If there are no errors, clear the error messages
    if (isValid) {
      errors.nameError = "";
      errors.phoneError = "";
    }

    // Update state with errors and validity flag
    setInputData({
      ...InputData,
      ...errors, // Merge errors into the state
      isValid, // Update validity
    });
  };

  return (
    <>
      {isFocused && (
        <View style={tw`h-full w-full bg-white`}>
          {/* Carousel Section */}
          <View style={tw`h-[30%] w-full`}>
            <Carousel
              loop
              width={width}
              height={250}
              autoPlay={true}
              autoPlayInterval={3000}
              data={carouselData}
              renderItem={({ item }) => (
                <View style={tw`h-full w-full items-center justify-center`}>
                  <Image
                    source={item.image}
                    style={tw`h-full w-full rounded-lg`}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>

          {/* Bottom Content Section */}
          <View
            style={tw`bg-gray-200 w-full h-[70%] rounded-t-[50px] p-10 flex flex-col justify-between elevation-20`}
          >
            <View>
              <View style={tw`flex flex-row gap-2`}>
                <Text style={tw`font-semibold italic text-2xl mb-2`}>
                  Welcome to
                </Text>
                <Animated.Text
                  style={[
                    tw`text-orange-500 text-2xl italic font-semibold`,
                    {
                      transform: [{ translateX: animatedValue }],
                    },
                  ]}
                >
                  Rapid Rescue
                </Animated.Text>
              </View>
              <ArInput
                onBlur={() => validateFields()}
                onChangeText={(e) => handleChange("name", e)}
                placeholder="Full Name *"
                value={InputData.name}
              />
              {InputData.nameError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.nameError}
                </Text>
              )}
              <ArInput
                onBlur={() => validateFields()}
                maxLength={10}
                keyboardType="numeric"
                onChangeText={(e) => handleChange("phone", e)}
                placeholder="Phone Number *"
                value={InputData.phone}
              />
              {InputData.phoneError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.phoneError}
                </Text>
              )}
            </View>

            <View style={tw`w-full `}>
              <ArButton
                disabled={!InputData.isValid}
                style={tw`w-full elevation-10 cursor-pointer ${
                  !InputData.isValid ? "opacity-50" : ""
                }`}
                // onPress={() => navigation.navigate("UserHome")} // Update navigation as needed
              >
                Continue
              </ArButton>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
