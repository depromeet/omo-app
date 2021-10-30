import React, { useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import WebView from 'react-native-webview';

const uri = 'https://omo-deployment.vercel.app';

export default function TabOneScreen(): JSX.Element {
  const webview = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const onAndroidBackPress = () => {
      console.log('webview: ', webview.current);
      if (webview.current && canGoBack) {
        webview.current.goBack();
        return true;
      }
      //FIXME: 일단 Android 환경에서 canGoBack이 false일 경우 exitApp을 하도록 했는데,
      // 추후에 문제가 발생할 수 있으니 염두해 둘것
      BackHandler.exitApp();
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, [canGoBack]);

  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri }}
      pullToRefreshEnabled
      allowsBackForwardNavigationGestures
      ref={webview}
      onNavigationStateChange={(navState) => {
        console.log('clicked :', navState);
        setCanGoBack(navState.canGoBack);
      }}
    />
  );
}
