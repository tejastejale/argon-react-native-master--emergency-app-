import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet } from "react-native";
import { DrawerItem as DrawerCustomItem } from "../components";
import Images from "../constants/Images";
import React from "react";
import tw from "twrnc";
import { useRoute } from "@react-navigation/native";

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const route = state?.routes[state.index]?.name;
  const screens = ["Home", "Profile"];

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.06} style={styles.header}>
        <Text
          style={tw`text-red-400 italic tracking-widest	font-bold text-2xl -ml-4`}
        >
          Rapid Rescue
        </Text>
        {/* <Image styles={styles.logo} source={Images.Logo} /> */}
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            // console.log(state.index, index);
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={route === item}
              />
            );
          })}
          {/* <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
              DOCUMENTATION
            </Text>
          </Block> 
          <DrawerCustomItem title="Getting Started" navigation={navigation} />*/}
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
  },
});

export default CustomDrawerContent;
