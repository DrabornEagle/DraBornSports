import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../theme';

export default function LivePill({ label = 'CANLI', compact = false }) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={[styles.pill, compact && styles.compact]}>
      <Animated.View style={[styles.dot, { opacity: pulse }]} />
      <Text style={[styles.text, compact && styles.compactText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,77,103,0.15)', borderWidth: 1, borderColor: 'rgba(255,77,103,0.35)', borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  compact: { paddingHorizontal: 8, paddingVertical: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
  text: { color: '#FF8A9A', fontSize: 11, fontWeight: '800', letterSpacing: 0.7 },
  compactText: { fontSize: 10 },
});
