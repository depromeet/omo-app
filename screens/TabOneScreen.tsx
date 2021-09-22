import * as React from "react";

import { BackHandler, Platform } from "react-native";

import { RootTabScreenProps } from "../types";
import WebView from "react-native-webview";
import { useEffect } from "react";
import { useRef } from "react";

const uri = "https://www.inflearn.com/";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const webview = useRef<WebView>(null);
  const onAndroidBackPress = () => {
    if (webview.current) {
      webview.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    return () => {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    };
  }, []);

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri }}
      allowsBackForwardNavigationGestures
      ref={webview}
    />
  );
}
