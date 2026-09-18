import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

const items = [
  {key: 'home', label: 'Home', icon: '⌂'},
  {key: 'flashcard', label: 'Study', icon: '▣'},
  {key: 'decks', label: 'Sets', icon: '▤'},
  {key: 'progress', label: 'Progress', icon: '↗'},
  {key: 'profile', label: 'Profile', icon: '○'},
];

export default function NavigationBar({activeScreen, onNavigate}) {
  const {theme} = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.card}]}> 
      {items.map(item => (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{selected: activeScreen === item.key}}
          key={item.key}
          onPress={() => onNavigate(item.key)}
          style={styles.item}>
          <View style={[styles.itemContent, activeScreen === item.key && styles.activeItem]}>
            <Text style={[styles.icon, activeScreen === item.key && styles.activeLabel]}>{item.icon}</Text>
            <Text style={[styles.label, activeScreen === item.key && styles.activeLabel]}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: '#FFFFFF33',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 18,
    elevation: 8,
    paddingVertical: 14,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  itemContent: {
    alignItems: 'center',
    borderRadius: 12,
    minWidth: 54,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  activeItem: {
    backgroundColor: '#F1EEFF',
  },
  icon: {
    color: '#74808C',
    fontSize: 18,
    height: 20,
    lineHeight: 20,
    marginBottom: 2,
  },
  label: {
    color: '#74808C',
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#6C4DFF',
  },
});
