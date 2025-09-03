import 'dotenv/config';

export default ({ config }: any) => ({
  ...config,
  name: 'Window Walker',
  slug: 'window-walker',
  extra: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    eas: {
      projectId: 'window-walker-dev',
    },
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
});


