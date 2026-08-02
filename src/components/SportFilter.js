import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { sports } from '../data/demoData';
import { colors, radii } from '../theme';

export default function SportFilter({ selected, onSelect, compact = false }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
      {sports.map((sport) => {
        const active = selected === sport.id;
        return (
          <AnimatedPressable
            key={sport.id}
            onPress={() => onSelect(sport.id)}
            style={[styles.item, compact && styles.compact, active && styles.active]}
          >
            <Ionicons name={sport.icon} size={compact ? 15 : 17} color={active ? colors.black : colors.textMuted} />
            <Text style={[styles.label, active && styles.activeLabel]}>{sport.label}</Text>
          </AnimatedPressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, gap: 9, paddingBottom: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, height: 42, borderRadius: radii.pill, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  compact: { height: 38, paddingHorizontal: 12 },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  activeLabel: { color: colors.black },
});
