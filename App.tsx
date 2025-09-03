import React from 'react';
import { Platform, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App(): JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }}>
      <View className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <Text className="text-lg font-semibold text-neutral-900">歩数: 0</Text>
      </View>
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: 'https://www.google.com' }} style={{ flex: 1, backgroundColor: '#fff' }} />
      </View>
    </SafeAreaView>
  );
}


