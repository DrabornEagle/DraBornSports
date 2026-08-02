import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

export default function TeamBadge({ team, size = 44, fontSize, showBorder = true }) {
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }, !showBorder && styles.noBorder]}>
      <LinearGradient colors={team?.colors || ['#334', '#667']} style={[styles.inner, { borderRadius: size / 2 }]}>
        <Text style={[styles.text, { fontSize: fontSize || Math.max(10, size * 0.25) }]}>{team?.short || '?'}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { padding: 2, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.borderStrong },
  noBorder: { borderWidth: 0, padding: 0 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.text, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.45)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
});
