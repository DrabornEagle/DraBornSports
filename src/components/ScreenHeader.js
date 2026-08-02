import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, radii } from '../theme';

export default function ScreenHeader({ eyebrow, title, rightActions = [] }) {
  return (
    <View style={styles.header}>
      <View style={styles.titleWrap}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.actions}>
        {rightActions.map((action) => (
          <AnimatedPressable key={action.icon} onPress={action.onPress} style={styles.iconButton}>
            <Ionicons name={action.icon} size={21} color={colors.text} />
            {action.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{action.badge}</Text></View> : null}
          </AnimatedPressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flex: 1 },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.8, marginBottom: 3 },
  title: { color: colors.text, fontSize: 27, fontWeight: '900', letterSpacing: -0.9 },
  actions: { flexDirection: 'row', gap: 9 },
  iconButton: { width: 42, height: 42, borderRadius: radii.medium, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, position: 'relative' },
  badge: { position: 'absolute', right: -2, top: -3, minWidth: 17, height: 17, paddingHorizontal: 4, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.live, borderWidth: 2, borderColor: colors.background },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});
