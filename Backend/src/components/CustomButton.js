import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function CustomButton({title, onPress}) {
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#5F42E8',
    borderRadius: 14,
    elevation: 4,
    marginBottom: 12,
    paddingVertical: 15,
    shadowColor: '#4B2FD4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },

  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
