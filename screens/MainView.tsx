import React, { useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import WebView from 'react-native-webview';

const uri = 'https://omo-deployment.vercel.app';

export default function TabOneScreen(): JSX.Element {
  const webview = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const onAndroidBackPress = () => {
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
      onLoadStart={() => webview.current?.injectJavaScript(INJECTED_CODE)}
      onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
      onMessage={({ nativeEvent }) => setCanGoBack(nativeEvent.canGoBack)}
    />
  );
}

const INJECTED_CODE = `
(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });
})();

true;
`;
