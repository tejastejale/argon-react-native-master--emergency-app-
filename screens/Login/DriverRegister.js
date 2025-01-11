import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Button } from "galio-framework";
import Carousel from "react-native-reanimated-carousel";
import tw from "twrnc";
import ArInput from "../../components/Input";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function DriverLogin({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    organizationName: "",
    license: null,
    passportPhoto: null,
    carPhoto: [],
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "A valid 10-digit Phone Number is required.";
    if (!formData.license) newErrors.license = "License is required.";
    if (!formData.passportPhoto)
      newErrors.passportPhoto = "Passport Photo is required.";
    if (!formData.carPhoto) {
      newErrors.carPhoto = "Car Photos are required.";
    } else if (formData.carPhoto.length < 3)
      newErrors.carPhoto = "Upload atleast 3 car photos.";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      console.log("Form Submitted================================");
      // Add your registration logic here
    }
  };

  const handleFileUpload = async (field) => {
    const per = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (per.status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        allowsMultipleSelection: field === "carPhoto" ? true : false, // Enable multiple selections
        selectionLimit: field === "carPhoto" ? 6 : 1,
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUris = result.assets.map((asset) => asset.uri); // Extract URIs
        saveImage(imageUris, field);
      }
    } else {
      alert("You must upload all required documents.");
    }
  };

  const saveImage = (images, field) => {
    if (field === "carPhoto") {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] ? [...prev[field], ...images] : images, // Append or initialize the array
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: images[0] })); // Save single image for other fields
    }
  };

  React.useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <ScrollView style={tw`h-full w-full bg-white`}>
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

      {/* Registration Form Section */}
      <LinearGradient
        colors={["#e5e7eb", "#FFFFFF"]}
        style={tw`bg-gray-200 -mt-40 w-full h-full rounded-t-[50px] p-10 pb-24 flex flex-col elevation-20`}
      >
        <Text
          style={tw`text-2xl font-semibold text-violet-600 text-center mb-5`}
        >
          Register
        </Text>
        <View style={tw`mb-1`}>
          <Text style={tw`mb-0`}>Full Name *</Text>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Enter Full Name"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />
          {errors.fullName && (
            <Text style={tw`text-red-500`}>{errors.fullName}</Text>
          )}
        </View>

        <View style={tw`mb-1`}>
          <Text style={tw`mb-0`}>Phone Number *</Text>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Enter Phone Number"
            keyboardType="numeric"
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
          />
          {errors.phoneNumber && (
            <Text style={tw`text-red-500`}>{errors.phoneNumber}</Text>
          )}
        </View>

        <View style={tw`mb-1`}>
          <Text style={tw`mb-0`}>Organization Name</Text>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Enter Organization Name"
            value={formData.organizationName}
            onChangeText={(text) =>
              setFormData({ ...formData, organizationName: text })
            }
          />
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-2`}>License *</Text>
          {formData.license && (
            <View style={tw`relative ml-2`}>
              <Icon
                family="Entypo"
                size={15}
                name="cross"
                color={"black"}
                style={tw`bg-gray-400 text-white rounded-full p-[1px] w-4 h-4 -mb-2 z-10 -ml-2`}
                onPress={() => setFormData({ ...formData, license: null })}
              />
              <Image
                src={formData.license}
                alt="license"
                style={tw`mb-2 bg-red-400 w-10 h-10 rounded-md`}
              />
            </View>
          )}
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("license")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.license ? "File Selected" : "Upload License"}
            </Text>
          </TouchableOpacity>
          {errors.license && (
            <Text style={tw`text-red-500 mt-2`}>{errors.license}</Text>
          )}
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-1`}>Car Photos *</Text>
          {formData.carPhoto && (
            <ScrollView horizontal style={tw`mb-2`}>
              {formData.carPhoto.map((uri, index) => (
                <View key={index} style={tw`relative ml-2`}>
                  <Icon
                    family="Entypo"
                    size={15}
                    name="cross"
                    color={"black"}
                    style={tw`-mb-2 -ml-2 bg-gray-400 text-white rounded-full p-[1px] w-4 h-4 z-10`}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        carPhoto: prev.carPhoto.filter((_, i) => i !== index),
                      }))
                    }
                  />
                  <Image
                    source={{ uri }}
                    style={tw`w-10 h-10 rounded-lg mr-2 z-0`}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          )}
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("carPhoto")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.carPhoto?.length > 0
                ? "Add More Photos"
                : "Upload Car Photos"}
            </Text>
          </TouchableOpacity>
          {errors.carPhoto && (
            <Text style={tw`text-red-500 mt-2`}>{errors.carPhoto}</Text>
          )}
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-2`}>Your Photo *</Text>
          {formData.passportPhoto && (
            <View style={tw`relative ml-2 mb-2`}>
              <Icon
                family="Entypo"
                size={15}
                name="cross"
                color={"black"}
                style={tw`-mb-2 -ml-2 bg-gray-400 text-white rounded-full p-[1px] w-4 h-4 z-10`}
                onPress={() =>
                  setFormData({ ...formData, passportPhoto: null })
                }
              />
              <Image
                source={{ uri: formData.passportPhoto }}
                style={tw`w-10 h-10 rounded-lg`}
                resizeMode="cover"
              />
            </View>
          )}
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("passportPhoto")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.passportPhoto ? "File Selected" : "Upload Your Photo"}
            </Text>
          </TouchableOpacity>
          {errors.passportPhoto && (
            <Text style={tw`text-red-500 mt-2`}>{errors.passportPhoto}</Text>
          )}
        </View>

        <View style={tw`mb-1`}>
          <Text style={tw`mb-0`}>Password *</Text>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Enter Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
          {errors.password && (
            <Text style={tw`text-red-500`}>{errors.password}</Text>
          )}
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-0`}>Confirm Password *</Text>
          <ArInput
            style={tw`border p-2 rounded-lg`}
            placeholder="Confirm Password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
          />
          {errors.confirmPassword && (
            <Text style={tw`text-red-500`}>{errors.confirmPassword}</Text>
          )}
        </View>

        <Button
          style={tw`w-full bg-violet-600 rounded-2xl elevation-10 m-0 mb-0`}
          onPress={handleFormSubmit}
        >
          Register
        </Button>
      </LinearGradient>
    </ScrollView>
  );
}
