import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Switch,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTheme} from '../contexts/ThemeContext';
import {useUser} from '../contexts/UserContext';

const COURSES = [
  'Computer Science',
  'Mathematics & Statistics',
  'Biology & Medical Sciences',
  'Physics & Applied Sciences',
  'Chemistry',
  'History & Literature',
  'Business & Economics',
];

const GENDERS = ['Male', 'Female', 'Other'];

export default function RegisterScreen({goToLogin, goToHome, goToWelcome}) {
  const {theme, isDark} = useTheme();
  const {register} = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('Male');
  const [course, setCourse] = useState('Computer Science');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must agree to the Terms and Conditions');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        gender,
        course,
        notificationsEnabled,
      });
      goToHome();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create your account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>✨</Text>
          <Text style={[styles.title, {color: theme.text}]}>Create Account</Text>
          <Text style={styles.subtitle}>Join Note2Flash and master your studies</Text>
        </View>

        {/* Form Card */}
        <View style={[styles.card, {backgroundColor: theme.card}]}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* 1. Full Name */}
          <Text style={[styles.label, {color: theme.text}]}>Full Name *</Text>
          <TextInput
            style={[styles.input, {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'}]}
            placeholder="e.g. John Doe"
            placeholderTextColor="#98A2B3"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* 2. Email Address */}
          <Text style={[styles.label, {color: theme.text}]}>Email Address *</Text>
          <TextInput
            style={[styles.input, {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'}]}
            placeholder="e.g. john@example.com"
            placeholderTextColor="#98A2B3"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* 3. Password */}
          <Text style={[styles.label, {color: theme.text}]}>Password *</Text>
          <TextInput
            style={[styles.input, {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'}]}
            placeholder="At least 8 characters"
            placeholderTextColor="#98A2B3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* 4. Confirm Password */}
          <Text style={[styles.label, {color: theme.text}]}>Confirm Password *</Text>
          <TextInput
            style={[styles.input, {color: theme.text, borderColor: isDark ? '#4A5D78' : '#D0D5DD'}]}
            placeholder="Re-enter your password"
            placeholderTextColor="#98A2B3"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* 5. Gender Selection (Radio Buttons) */}
          <Text style={[styles.label, {color: theme.text}]}>Gender</Text>
          <View style={styles.radioGroup}>
            {GENDERS.map(item => {
              const isSelected = gender === item;
              return (
                <Pressable
                  key={item}
                  style={styles.radioButtonContainer}
                  onPress={() => setGender(item)}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}>
                    {isSelected ? <View style={styles.radioInnerDot} /> : null}
                  </View>
                  <Text style={[styles.radioLabel, {color: theme.text}]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* 6. Course / Subject Selection (Dropdown / Picker) */}
          <Text style={[styles.label, {color: theme.text}]}>Course / Field of Study</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, {borderColor: isDark ? '#4A5D78' : '#D0D5DD'}]}
            onPress={() => setIsPickerVisible(true)}>
            <Text style={[styles.dropdownButtonText, {color: theme.text}]}>
              📚 {course}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          {/* Course Picker Modal */}
          <Modal
            visible={isPickerVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsPickerVisible(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setIsPickerVisible(false)}>
              <View style={[styles.modalCard, {backgroundColor: theme.card}]}>
                <Text style={[styles.modalTitle, {color: theme.text}]}>
                  Select Course / Subject
                </Text>
                <Picker
                  selectedValue={course}
                  onValueChange={value => {
                    setCourse(value);
                    setIsPickerVisible(false);
                  }}
                  style={[styles.picker, {color: theme.text}]}
                  dropdownIconColor={theme.text}>
                  {COURSES.map(item => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
                {/* Course choices are supplied by the native Picker above.
                {COURSES.map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.modalItem,
                      course === c && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setCourse(c);
                      setIsPickerVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.modalItemText,
                        {color: theme.text},
                        course === c && styles.modalItemTextSelected,
                      ]}>
                      {c}
                    </Text>
                    {course === c && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                ))} */}
              </View>
            </Pressable>
          </Modal>

          {/* 7. Notification Preference (Switch) */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchTitle, {color: theme.text}]}>
                Study Notifications & Reminders
              </Text>
              <Text style={styles.switchSubtitle}>
                Get daily flashcard reminders and review alerts
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{false: '#D0D5DD', true: '#5F42E8'}}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#F4F5F7'}
            />
          </View>

          {/* 8. Terms and Conditions (Checkbox) */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setTermsAccepted(!termsAccepted)}>
            <View
              style={[
                styles.checkbox,
                termsAccepted && styles.checkboxChecked,
                {borderColor: termsAccepted ? '#5F42E8' : '#98A2B3'},
              ]}>
              {termsAccepted ? <Text style={styles.checkboxCheck}>✓</Text> : null}
            </View>
            <Text style={[styles.checkboxLabel, {color: theme.text}]}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text> *
            </Text>
          </Pressable>

          {/* 9. Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            <Text style={styles.registerButtonText}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          {/* 10. Links to Login and Welcome */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.footerLink}>Log In</Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#667085',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  errorBox: {
    backgroundColor: '#FEE4E2',
    borderColor: '#FDA29B',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B42318',
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#98A2B3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: '#5F42E8',
  },
  radioInnerDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#5F42E8',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  dropdownArrow: {
    color: '#667085',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  picker: {
    marginHorizontal: -8,
    marginTop: -12,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalItemSelected: {
    backgroundColor: '#F0EDFF',
  },
  modalItemText: {
    fontSize: 15,
  },
  modalItemTextSelected: {
    color: '#5F42E8',
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#5F42E8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
    paddingVertical: 6,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#5F42E8',
  },
  checkboxCheck: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  linkText: {
    color: '#5F42E8',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#5F42E8',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#5F42E8',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
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
  footerLink: {
    color: '#5F42E8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#667085',
    fontSize: 13,
  },
});
