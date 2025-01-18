import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { Button } from "galio-framework";
import tw from "twrnc";
import ArInput from "../../components/Input";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { driverRegister } from "../API/actions/register";
import DropDownPicker from "react-native-dropdown-picker";

export default function DriverLogin({ navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Ambulance", value: 1 },
    { label: "Fire Brigade", value: 2 },
    { label: "Police", value: 3 },
  ]);
  const [formData, setFormData] = useState({
    firstName: "tejas",
    lastName: "tejale",
    phoneNumber: "7350692966",
    email: "tejastejale13@gmail.com",
    type: 1,
    license: null,
    passportPhoto: null,
    carPhoto: [],
    password: "Tejas@1324",
    confirmPassword: "Tejas@1324",
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, type: value }));
  }, [value]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "A valid 10-digit Phone Number is required.";
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.license) newErrors.license = "License is required.";
    if (!formData.passportPhoto)
      newErrors.passportPhoto = "Your Photo is required.";
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

  const handleFormSubmit = async () => {
    if (validateForm()) {
      try {
        const formDataa = new FormData();

        formDataa.append("first_name", formData.firstName);
        formDataa.append("last_name", formData.lastName);
        formDataa.append("phone_number", formData.phoneNumber);
        formDataa.append("driver_pic", formData.license);
        formDataa.append("car_pics", formData.passportPhoto);

        // formData.car_pics.forEach((uri, index) => {
        //   formData.append(`car_pics[${index}]`, {
        //     uri,
        //     type: "image/jpeg",
        //     name: `car_pic_${index + 1}.jpg`,
        //   });
        // });

        formDataa.append("email", formData.email);
        formDataa.append("license", formData.license);
        formDataa.append("type", formData.type);
        formDataa.append("password", formData.password);
        formDataa.append("confirm_password", formData.password);

        const res = await driverRegister(formDataa);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
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

  const renderDownIcon = () => (
    <Icon
      size={16}
      style={tw`text-gray-400 -ml-6`}
      name="down"
      family="AntDesign"
    />
  );

  const renderUpIcon = () => (
    <Icon
      size={16}
      style={tw`text-gray-400 -ml-6`}
      name="up"
      family="AntDesign"
    />
  );

  return (
    <ScrollView style={tw`h-full w-full bg-white`}>
      <ScrollView style={tw` max-h-[200rem] h-full w-full`}>
        {/* Registration Form Section */}
        <LinearGradient
          colors={["#e5e7eb", "#FFFFFF"]}
          style={tw`bg-gray-200 w-full h-fit p-10 pb-24 flex flex-col elevation-20`}
        >
          <Text
            style={tw`text-2xl font-semibold text-violet-600 text-center mb-5`}
          >
            Register
          </Text>
          <View style={tw`mb-1`}>
            <Text style={tw`mb-0`}>First Name *</Text>
            <ArInput
              style={tw`border p-2 rounded-lg`}
              placeholder="Enter First Name"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
            />
            {errors.firstName && (
              <Text style={tw`text-red-500`}>{errors.firstName}</Text>
            )}
          </View>

          <View style={tw`mb-1`}>
            <Text style={tw`mb-0`}>Last Name *</Text>
            <ArInput
              style={tw`border p-2 rounded-lg`}
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
            />
            {errors.lastName && (
              <Text style={tw`text-red-500`}>{errors.lastName}</Text>
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
            <Text style={tw`mb-0`}>Email *</Text>
            <ArInput
              style={tw`border p-2 rounded-lg`}
              placeholder="Enter Email Number"
              keyboardType="numeric"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && (
              <Text style={tw`text-red-500`}>{errors.email}</Text>
            )}
          </View>

          <View style={tw`mb-1 w-full`}>
            <Text style={tw`mb-0`}>Organization Type *</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select..."
              style={tw`border border-gray-300 bg-white my-2 rounded-lg`}
              textStyle={tw`text-gray-400`}
              dropDownContainerStyle={tw`border border-gray-300`}
              listItemContainerStyle={tw`border-b border-gray-200`}
              listItemLabelStyle={tw`text-gray-400`}
              listMode="SCROLLVIEW"
              nestedScrollEnabled={true}
              ArrowUpIconComponent={renderUpIcon}
              ArrowDownIconComponent={renderDownIcon}
            />
            {errors.type && <Text style={tw`text-red-500`}>{errors.type}</Text>}
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
    </ScrollView>
  );
}
