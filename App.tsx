import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { WebView } from 'react-native-webview';

export default function App(): JSX.Element {
  const [stepCount, setStepCount] = useState<number>(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }}>
      <View className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <Text className="text-lg font-semibold text-neutral-900">{`歩数: ${stepCount}`}</Text>
        {isPedometerAvailable === false ? (
          <Text className="text-sm text-red-600 mt-1">歩数計が利用できません</Text>
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: 'https://www.google.com' }} style={{ flex: 1, backgroundColor: '#fff' }} />
      </View>
    </SafeAreaView>
  );
}


