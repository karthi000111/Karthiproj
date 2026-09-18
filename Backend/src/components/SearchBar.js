import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

export default function SearchBar({value, onChangeText}) {
  return (
    <TextInput
      style={styles.search}
      onChangeText={onChangeText}
      value={value}
      placeholder="🔍 Search notes"
    />
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
});
