import * as React from "react";

import { BackHandler } from "react-native";
import { RootTabScreenProps } from "../types";
import WebView from "react-native-webview";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRef } from "react";
import { useState } from "react";

const uri = "https://www.inflearn.com/";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const webview = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const onAndroidBackPress = () => {
    if (webview.current && canGoBack) {
      console.log(`cangoBack : ${canGoBack}`);
      webview.current.goBack();
      return true;
    }
    //FIXME: 일단 Android 환경에서 canGoBack이 false일 경우 exitApp을 하도록 했는데,
    // 추후에 문제가 발생할 수 있으니 염두해 둘것
    BackHandler.exitApp();
    return false;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      };
    }, [canGoBack])
  );

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ uri }}
      allowsBackForwardNavigationGestures
      ref={webview}
      onNavigationStateChange={(navState) => {
        console.log(navState.canGoBack);
        setCanGoBack(navState.canGoBack);
      }}
    />
  );
}
