import React from 'react';
import { Image } from 'react-native';

export const PlusIcon = () => (
  <Image
    source={require('../assets/imagePNG/plus.png')}
    style={{ width: 50, height: 50 }}
  />
);

export const HamburgerIcon = () => (
  <Image
    source={require('../assets/imagePNG/hamburger.png')}
    style={{ width: 24, height: 24 }}
  />
);

export const SettingsIcon = () => (
  <Image
    source={require('../assets/imagePNG/settings.png')}
    style={{ width: 24, height: 24 }}
  />
);
