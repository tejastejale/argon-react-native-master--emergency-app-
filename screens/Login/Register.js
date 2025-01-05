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

const { width } = Dimensions.get("window");

export default function RegistrationScreen({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    organizationName: "",
    license: null,
    passportPhoto: null,
    carPhoto: null,
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
    if (!formData.carPhoto) newErrors.carPhoto = "Car Photo is required.";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      console.log("Form Submitted", formData);
      // Add your registration logic here
    }
  };

  const handleFileUpload = (field) => {
    // Implement file upload functionality here
    console.log(`Uploading file for ${field}`);
  };

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
      <ScrollView
        contentContainerStyle={tw`pb-20`} // Added padding to the bottom
        style={tw`bg-gray-200 -mt-20 w-full h-full rounded-t-[50px] p-10 flex flex-col elevation-20`}
      >
        <Text
          style={tw`text-2xl font-semibold text-orange-500 text-center mb-5`}
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
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("license")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.license ? "File Selected" : "Upload License"}
            </Text>
          </TouchableOpacity>
          {errors.license && (
            <Text style={tw`text-red-500`}>{errors.license}</Text>
          )}
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-2`}>Passport Photo *</Text>
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("passportPhoto")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.passportPhoto
                ? "File Selected"
                : "Upload Passport Photo"}
            </Text>
          </TouchableOpacity>
          {errors.passportPhoto && (
            <Text style={tw`text-red-500`}>{errors.passportPhoto}</Text>
          )}
        </View>

        <View style={tw`mb-3`}>
          <Text style={tw`mb-2`}>Car Photo *</Text>
          <TouchableOpacity
            style={tw`p-3 px-2 rounded-lg bg-white`}
            onPress={() => handleFileUpload("carPhoto")}
          >
            <Text style={tw`text-gray-400`}>
              {formData.carPhoto ? "File Selected" : "Upload Car Photo"}
            </Text>
          </TouchableOpacity>
          {errors.carPhoto && (
            <Text style={tw`text-red-500`}>{errors.carPhoto}</Text>
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
          style={tw`w-full elevation-10 m-0 mb-00`}
          onPress={handleFormSubmit}
        >
          Register
        </Button>
      </ScrollView>
    </ScrollView>
  );
}
