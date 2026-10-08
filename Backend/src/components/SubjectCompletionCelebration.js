import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PARTICLE_COUNT = 32;
const PARTICLES = Array.from({length: PARTICLE_COUNT}, (_, index) => ({
  id: index,
  left: `${(index * 37) % 96}%`,
  isStar: index % 3 === 0,
  color: ['#5F42E8', '#F59E0B', '#22BFA3', '#E85D75', '#3498DB'][index % 5],
}));

export default function SubjectCompletionCelebration({subject, onDismiss}) {
  const progressValues = useRef(
    PARTICLES.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    if (!subject) return undefined;

    const animations = progressValues.map((value, index) => {
      value.setValue(0);
      return Animated.timing(value, {
        toValue: 1,
        duration: 2100 + (index % 5) * 180,
        delay: (index % 12) * 95,
        useNativeDriver: true,
      });
    });
    const celebration = Animated.parallel(animations);
    celebration.start();

    return () => celebration.stop();
  }, [progressValues, subject]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onDismiss}
      transparent
      visible={Boolean(subject)}>
      <View style={styles.backdrop}>
        {PARTICLES.map((particle, index) => {
          const progress = progressValues[index];
          const translateY = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-48, Dimensions.get('window').height + 48],
          });
          const rotate = progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', `${index % 2 ? 540 : -540}deg`],
          });
          const opacity = progress.interpolate({
            inputRange: [0, 0.08, 0.86, 1],
            outputRange: [0, 1, 1, 0],
          });

          return (
            <Animated.View
              key={particle.id}
              pointerEvents="none"
              style={[
                styles.particle,
                {left: particle.left, opacity, transform: [{translateY}, {rotate}]},
              ]}>
              {particle.isStar ? (
                <Text style={[styles.star, {color: particle.color}]}>★</Text>
              ) : (
                <View style={[styles.confetti, {backgroundColor: particle.color}]} />
              )}
            </Animated.View>
          );
        })}

        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.sparkles}>🎉 ✨ 🎉</Text>
          <Text style={styles.title}>Subject complete!</Text>
          <Text style={styles.subject}>{subject}</Text>
          <Text style={styles.message}>
            Congratulations! You completed every flashcard. Keep up the amazing work!
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onDismiss}
            style={styles.button}
            activeOpacity={0.85}>
            <Text style={styles.buttonText}>Keep it going</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(23, 43, 77, 0.58)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  particle: {
    alignItems: 'center',
    position: 'absolute',
    top: -48,
  },
  star: {
    fontSize: 21,
  },
  confetti: {
    borderRadius: 2,
    height: 14,
    width: 9,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    elevation: 12,
    maxWidth: 420,
    paddingHorizontal: 28,
    paddingVertical: 36,
    width: '100%',
  },
  sparkles: {
    fontSize: 34,
    marginBottom: 14,
  },
  title: {
    color: '#172B4D',
    fontSize: 27,
    fontWeight: '800',
    textAlign: 'center',
  },
  subject: {
    color: '#5F42E8',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  message: {
    color: '#667085',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#5F42E8',
    borderRadius: 16,
    marginTop: 26,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
