import { Button } from "galio-framework";
import React, { useEffect, useRef, useState } from "react";
import { Text, Image, Animated, View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import { LinearGradient } from "expo-linear-gradient";
import ArInput from "../../components/Input";

const { width } = Dimensions.get("window");

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const animatedValue = useRef(new Animated.Value(-500)).current; // Start position off-screen to the left
  const animatedValue2 = useRef(new Animated.Value(300)).current; // Start below the screen

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
      Animated.spring(animatedValue2, {
        toValue: 0, // Move to the top position
        friction: 6, // Spring friction
        tension: 50, // Spring tension
        useNativeDriver: true, // For smooth performance
      }).start();
    }, 400);
  }, [animatedValue2]);

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
      <View style={tw`h-[40%] w-full`}>
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
              {/* <Text style={tw`text-xl font-bold mt-4`}>{item.title}</Text>
              <Text style={tw`text-sm text-gray-600`}>{item.description}</Text> */}
            </View>
          )}
        />
      </View>

      {/* Bottom Content Section */}
      <LinearGradient
        colors={["#e5e7eb", "#FFFFFF"]}
        style={tw` w-full h-[60%] rounded-t-[50px] p-10 flex flex-col justify-between elevation-20`}
      >
        <View>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Phone *"
            keyboardType="numeric"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Password *"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
        </View>
        <View>
          <View style={tw`w-full `}>
            <View>
              <Animated.View
                style={[
                  {
                    transform: [{ translateY: animatedValue2 }],
                  },
                ]}
              >
                <Button
                  style={tw`w-full bg-violet-600 rounded-2xl elevation-10 mx-0`}
                  onPress={() => navigation.navigate("Home")}
                >
                  Make a Login
                </Button>
              </Animated.View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
