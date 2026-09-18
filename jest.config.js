module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|@react-native-async-storage|react-redux|@reduxjs/toolkit|immer|react-native-safe-area-context)/)',
  ],
};
