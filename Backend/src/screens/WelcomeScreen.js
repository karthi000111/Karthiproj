import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Pressable} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

export default function WelcomeScreen({goToRegister, goToLogin}) {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}> 
      <View style={styles.heroSection}>
        <Text style={styles.logo}>📚</Text>
        <Text style={[styles.title, {color: theme.text}]}>
          Note2Flash
        </Text>
        <Text style={styles.tagline}>
          Learn Smart, Remember Better
        </Text>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (goToRegister) goToRegister();
          }}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.primaryButtonText}>Get Started (Register)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            if (goToLogin) goToLogin();
          }}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.secondaryButtonText}>I already have an account (Log In)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 72,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#667085',
    marginTop: 12,
    textAlign: 'center',
  },
  actionSection: {
    width: '100%',
    paddingBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#5F42E8',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#5F42E8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#5F42E8',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#5F42E8',
    fontSize: 15,
    fontWeight: '600',
  },
});
