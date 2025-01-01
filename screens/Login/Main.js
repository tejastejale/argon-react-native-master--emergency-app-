import { Text, Button, Image, Platform, StyleSheet, View } from "react-native";
import { Block } from "galio-framework";
import tw from "twrnc";

export default function MainScreen({ navigation }) {
  return (
    <View style={tw`h-full w-full bg-white`}>
      <View style={tw`bg-white w-full h-[35%] z-5`}>
        <Image
          source={require("../../assets/imgs/Login/tp.png")}
          style={tw`h-full w-full`}
        />
      </View>
      <View
        style={[
          tw`bg-gray-200 w-full h-[65%] rounded-t-[50px] p-10 flex flex-col justify-between`,
        ]}
      >
        <View>
          <Text style={[tw`font-semibold italic text-xl mb-2`]}>
            Welcome to{" "}
            <Text style={tw`text-orange-500 text-xl`}>Rapid Rescue</Text>
          </Text>
          <Text style={[tw`font-normal italic text-md`]}>
            We provide solutions to fulfill your emergency needs with just one
            click!!!
          </Text>
        </View>
        {/* <Button
          title="Login Option 1"
          onPress={() => navigation.navigate("FirstLoginOption")}
        />
        <Button
          title="Login Option 2"
          onPress={() => navigation.navigate("SecondLoginOption")}
        /> */}
      </View>
    </View>
  );
}
