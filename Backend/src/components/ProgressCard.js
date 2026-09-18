import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ProgressCard({title, value}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFFE8',
    padding: 22,
    margin: 10,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 3,
  },

  title: {
    color: '#667085',
    fontSize: 14,
    fontWeight: '600',
  },

  value: {
    color: '#5F42E8',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },
});
