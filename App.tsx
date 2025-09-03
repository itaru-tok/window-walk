import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { Pedometer } from 'expo-sensors';
import { WebView } from 'react-native-webview';

function buildStreetViewHtml(apiKey: string): string {
  const key = apiKey || 'YOUR_GOOGLE_MAPS_API_KEY';
  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\" />
    <style>
      html, body, #pano { height: 100%; margin: 0; padding: 0; }
      #pano { width: 100%; height: 100%; }
    </style>
    <script src=\"https://maps.googleapis.com/maps/api/js?key=${key}\"></script>
  </head>
  <body>
    <div id=\"pano\"></div>
    <script>
      let panorama;
      function initPano() {
        const position = { lat: 35.681236, lng: 139.767125 };
        panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), {
          position,
          pov: { heading: 34, pitch: 10 },
          visible: true,
        });
      }
      window.onload = initPano;
      function updateStreetView(lat, lng) {
        if (!panorama) return;
        panorama.setPosition({ lat: Number(lat), lng: Number(lng) });
      }
      window.updateStreetView = updateStreetView;
    </script>
  </body>
  </html>`;
}

export default function App(): JSX.Element {
  const [stepCount, setStepCount] = useState<number>(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null);
  const [lastInjectedStep, setLastInjectedStep] = useState<number>(0);
  const webviewRef = useRef<WebView>(null);

  const apiKey = useMemo(() => {
    const fromExpoExtra = (Constants.expoConfig as any)?.extra?.GOOGLE_MAPS_API_KEY;
    return fromExpoExtra ?? '';
  }, []);

  const html = useMemo(() => buildStreetViewHtml(apiKey), [apiKey]);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    (async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);
        if (!available) {
          Alert.alert('歩数計が利用できません', 'この端末ではPedometerがサポートされていません。');
          return;
        }
        subscription = Pedometer.watchStepCount((result) => {
          // result.steps は購読開始以降の累計
          setStepCount(result.steps || 0);
        });
      } catch (e) {
        setIsPedometerAvailable(false);
        Alert.alert('歩数計の初期化に失敗しました');
      }
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    // 10歩ごとに WebView 内の updateStreetView を呼ぶ（ダミー座標）
    if (stepCount - lastInjectedStep >= 10) {
      setLastInjectedStep(stepCount);
      const lat = 35.6813;
      const lng = 139.7672;
      const js = `if (typeof updateStreetView === 'function') { updateStreetView(${lat}, ${lng}); } true;`;
      webviewRef.current?.injectJavaScript(js);
    }
  }, [stepCount, lastInjectedStep]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }}>
      <View className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <Text className="text-lg font-semibold text-neutral-900">{`歩数: ${stepCount}`}</Text>
        {isPedometerAvailable === false ? (
          <Text className="text-sm text-red-600 mt-1">歩数計が利用できません</Text>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html }}
          style={{ flex: 1, backgroundColor: '#fff' }}
        />
      </View>
    </SafeAreaView>
  );
}


