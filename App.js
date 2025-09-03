import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>歩数: 0</Text>
      </View>
      <View style={styles.webviewContainer}>
        <WebView source={{ uri: 'https://www.google.com' }} style={styles.webview} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fafafa',
  },
  stepText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


