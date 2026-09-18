import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useUser} from '../contexts/UserContext';

export default function LoginScreen({goToHome, goToRegister, goToWelcome}) {
  const {theme, isDark} = useTheme();
  const {user, setUser} = useUser();

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearFeedback = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLogin = () => {
    clearFeedback();
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (user?.name) {
      setUser({...user, email: email.trim()});
    } else {
      setUser({name: email.split('@')[0], email: email.trim()});
    }

    setEmail('');
    setPassword('');
    setSuccessMessage('Login successful!');

    if (typeof goToHome === 'function') {
      goToHome();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, {backgroundColor: theme.card}]}>
          <Text style={styles.logo}>👋</Text>
          <Text style={[styles.title, {color: theme.text}]}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to Note2Flash</Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <Text style={[styles.label, {color: theme.text}]}>Email Address</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#98A2B3"
            value={email}
            onChangeText={value => {
              clearFeedback();
              setEmail(value);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'},
            ]}
          />

          <Text style={[styles.label, {color: theme.text}]}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#98A2B3"
            secureTextEntry
            value={password}
            onChangeText={value => {
              clearFeedback();
              setPassword(value);
            }}
            style={[
              styles.input,
              {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'},
            ]}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          {successMessage ? (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={goToHome}
              activeOpacity={0.85}>
              <Text style={styles.continueButtonText}>Continue to Home</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.linkText}>Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={goToWelcome} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 28,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  logo: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#667085',
    marginBottom: 20,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: '#FEE4E2',
    borderColor: '#FDA29B',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: '#ECFDF3',
    borderColor: '#6CE9A6',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  successText: {
    color: '#027A48',
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#5F42E8',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#5F42E8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    borderColor: '#5F42E8',
    borderWidth: 1.5,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#5F42E8',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#667085',
    fontSize: 14,
  },
  linkText: {
    color: '#5F42E8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#667085',
    fontSize: 13,
  },
});
