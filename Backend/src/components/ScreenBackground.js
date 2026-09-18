import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

export default function ScreenBackground({children}) {
  const {isDark} = useTheme();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {toValue: 1, duration: 5000, useNativeDriver: true}),
        Animated.timing(drift, {toValue: 0, duration: 5000, useNativeDriver: true}),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [drift]);

  const translateY = drift.interpolate({inputRange: [0, 1], outputRange: [0, 28]});
  return (
    <View style={[styles.page, {backgroundColor: isDark ? '#0B1220' : '#EEF4FF'}]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.orb, styles.topOrb, {transform: [{translateY}]}]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.orb,
          styles.bottomOrb,
          {transform: [{translateY: Animated.multiply(translateY, -0.6)}]},
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, overflow: 'hidden'},
  content: {flex: 1, zIndex: 1},
  orb: {backgroundColor: '#7C5CFC', borderRadius: 999, opacity: 0.16, position: 'absolute'},
  topOrb: {height: 260, right: -95, top: -110, width: 260},
  bottomOrb: {backgroundColor: '#21C7A8', bottom: -120, height: 250, left: -100, width: 250},
});
