import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.peter_vacho.book_explorer',
  appName: 'Book Explorer',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
