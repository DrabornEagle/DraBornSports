import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, radii } from '../theme';

const tabs = [
  { id: 'home', label: 'Ana Sayfa', icon: 'home' },
  { id: 'matches', label: 'Maçlar', icon: 'calendar' },
  { id: 'analysis', label: 'Analiz', icon: 'analytics', featured: true },
  { id: 'leagues', label: 'Ligler', icon: 'trophy' },
  { id: 'profile', label: 'Profil', icon: 'person' },
];

function TabItem({ tab, active, onPress }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: active ? 1 : 0,
      useNativeDriver: false,
      speed: 22,
      bounciness: 6,
    }).start();
  }, [active, progress]);

  const indicatorWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.tab, tab.featured && styles.featuredTab]}
      scaleTo={0.9}
    >
      <View style={[
        styles.iconWrap,
        tab.featured && styles.featuredIcon,
        active && styles.activeIconWrap,
      ]}>
        <Ionicons
          name={active ? tab.icon : `${tab.icon}-outline`}
          size={tab.featured ? 23 : 21}
          color={active || tab.featured ? colors.black : colors.textMuted}
        />
      </View>
      <Text style={[styles.label, (active || tab.featured) && styles.activeLabel]}>{tab.label}</Text>
      <Animated.View style={[styles.indicator, { width: indicatorWidth }]} />
    </AnimatedPressable>
  );
}

export default function BottomNav({ activeTab, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} active={activeTab === tab.id} onPress={() => onChange(tab.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    backgroundColor: '#091626',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 7,
    paddingBottom: 9,
    paddingHorizontal: 3,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 55, position: 'relative' },
  featuredTab: { marginTop: -18 },
  iconWrap: { width: 37, height: 33, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  featuredIcon: {
    width: 52,
    height: 52,
    borderRadius: 19,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: '#091626',
  },
  activeIconWrap: { backgroundColor: colors.primary },
  label: { color: colors.textMuted, fontSize: 9, fontWeight: '800', marginTop: 3 },
  activeLabel: { color: colors.primary },
  indicator: {
    position: 'absolute',
    bottom: -6,
    height: 3,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
});
