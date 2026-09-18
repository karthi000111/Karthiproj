import React from 'react';
import {Text, StyleSheet} from 'react-native';

export default function SubjectChip({name}) {
  return (
    <Text style={styles.chip}>
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#D6EEF7',
    padding: 10,
    borderRadius: 20,
    margin: 5,
  },
});