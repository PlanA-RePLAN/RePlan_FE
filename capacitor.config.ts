import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.plana.replan',
  appName: 'RePLAN',
  webDir: 'dist',
  plugins: {
    // 키보드가 올라올 때 웹뷰 전체가 밀려 올라가는 것 방지
    Keyboard: {
      resize: 'none'
    }
  }
};

export default config;
