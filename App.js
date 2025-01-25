import React, { useCallback, useEffect, useState } from "react";
import { Image, StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
import * as Linking from "expo-linking";

enableScreens();

import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];
// cache product images
articles.map((article) => assetImages.push(article.image));

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // To resolve the reanimated warnings
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  useEffect(() => {
    const handleLink = (e) => {
      let data = Linking.parse(e.url);
    };
    Linking.addEventListener("url", handleLink);
  }, []);

  useEffect(() => {
    async function prepare() {
      let success = false;
      try {
        await _loadResourcesAsync();
        await Font.loadAsync({
          ArgonExtra: require("./assets/font/Nunito.ttf"),
        });
        success = true;
      } catch (e) {
        console.warn("Error loading resources:", e);
      } finally {
        if (success) setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <GalioProvider theme={argonTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Block flex>
            <StatusBar barStyle="dark-content" />
            <Screens />
          </Block>
        </GestureHandlerRootView>
      </GalioProvider>
    </NavigationContainer>
  );
}
