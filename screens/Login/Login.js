import { Button } from "galio-framework";
import React, { useState, useEffect } from "react";
import { Text, Image, Animated, View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import ArInput from "../../components/Input";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function UserLogin({ navigation }) {
  const isFocused = useIsFocused();
  const [InputData, setInputData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    firstNameError: "",
    lastNameError: "",
    phoneError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
    isValid: false, // Initially invalid
  });

  const animatedValue = new Animated.Value(-500);

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

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 0,
      friction: 6,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (name, value) => {
    setInputData({ ...InputData, [name]: value }, validateFields);
  };

  const validateFields = () => {
    let errors = {};

    // First Name validation
    if (InputData.first_name.trim().length === 0) {
      errors.firstNameError = "First name is required";
    }

    // Last Name validation
    if (InputData.last_name.trim().length === 0) {
      errors.lastNameError = "Last name is required";
    }

    // Phone validation
    if (InputData.phone.length !== 10) {
      errors.phoneError = "Enter a valid Phone Number";
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(InputData.email)) {
      errors.emailError = "Enter a valid email address";
    }

    // Password validation
    if (InputData.password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (InputData.confirm_password !== InputData.password) {
      errors.confirmPasswordError = "Passwords do not match";
    }

    // Check validity
    const isValid = Object.keys(errors).length === 0;
    setInputData({ ...InputData, ...errors, isValid });
  };

  return (
    <>
      {isFocused && (
        <View style={tw`h-full w-full bg-white`}>
          <View style={tw`h-[20%] w-full`}>
            {/* Carousel Section */}
            <Carousel
              loop
              width={width}
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

          <LinearGradient
            colors={["#e5e7eb", "#FFFFFF"]}
            style={tw`flex flex-col h-[80%] justify-evenly bg-gray-200 w-full rounded-t-[50px] p-10 elevation-20`}
          >
            <View style={tw`flex flex-row gap-2`}>
              <Text style={tw`font-semibold italic text-2xl mb-2`}>
                Welcome to
              </Text>
              <Animated.Text
                style={[
                  tw`text-violet-600 text-2xl italic font-semibold`,
                  {
                    transform: [{ translateX: animatedValue }],
                  },
                ]}
              >
                Rapid Rescue
              </Animated.Text>
            </View>
            <View>
              <ArInput
                onBlur={validateFields}
                onChangeText={(e) => handleChange("first_name", e)}
                placeholder="First Name *"
                value={InputData.first_name}
              />
              {InputData.firstNameError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.firstNameError}
                </Text>
              )}

              <ArInput
                onBlur={validateFields}
                onChangeText={(e) => handleChange("last_name", e)}
                placeholder="Last Name *"
                value={InputData.last_name}
              />
              {InputData.lastNameError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.lastNameError}
                </Text>
              )}

              <ArInput
                onBlur={validateFields}
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

              <ArInput
                onBlur={validateFields}
                onChangeText={(e) => handleChange("email", e)}
                placeholder="Email *"
                value={InputData.email}
              />
              {InputData.emailError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.emailError}
                </Text>
              )}

              <ArInput
                onBlur={validateFields}
                onChangeText={(e) => handleChange("password", e)}
                placeholder="Password *"
                secureTextEntry
                value={InputData.password}
              />
              {InputData.passwordError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.passwordError}
                </Text>
              )}

              <ArInput
                onBlur={validateFields}
                onChangeText={(e) => handleChange("confirm_password", e)}
                placeholder="Confirm Password *"
                secureTextEntry
                value={InputData.confirm_password}
              />
              {InputData.confirmPasswordError && (
                <Text style={tw`text-red-500 italic text-sm mb-2`}>
                  {InputData.confirmPasswordError}
                </Text>
              )}
            </View>

            <View style={tw`w-full `}>
              <Button
                disabled={!InputData.isValid}
                style={tw`w-full m-0 mt-2 bg-violet-600 rounded-2xl elevation-10 ${
                  !InputData.isValid ? "opacity-50" : ""
                }`}
              >
                Continue
              </Button>
            </View>
          </LinearGradient>
        </View>
      )}
    </>
  );
}
