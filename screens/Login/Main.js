import { Button } from "galio-framework";
import React, { useEffect, useRef } from "react";
import { Text, Image, Animated, View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";

const { width } = Dimensions.get("window");

export default function MainScreen({ navigation }) {
  const animatedValue = useRef(new Animated.Value(-500)).current; // Start position off-screen to the left

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
    setTimeout(() => {
      Animated.spring(animatedValue, {
        toValue: 0, // Move to the position
        friction: 6, // Spring friction
        tension: 50, // Spring tension
        useNativeDriver: true, // For smooth performance
      }).start();
    }, 400);
  }, [animatedValue]);

  return (
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
              {/* <Text style={tw`text-xl font-bold mt-4`}>{item.title}</Text>
              <Text style={tw`text-sm text-gray-600`}>{item.description}</Text> */}
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
          <Text style={tw`font-normal italic text-md`}>
            We provide solutions to fulfill your emergency needs with just one
            click !!!
          </Text>
        </View>

        <View style={tw`w-full `}>
          <Button
            style={tw`w-full elevation-10`}
            onPress={() => navigation.navigate("UserLogin")}
          >
            Continue as User
          </Button>
          <Button
            style={tw`w-full elevation-10`}
            onPress={() => navigation.navigate("DriverLogin")}
          >
            Continue as Driver
          </Button>
        </View>
      </View>
    </View>
  );
}
