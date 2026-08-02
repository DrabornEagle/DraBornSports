import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import { colors, radii } from '../theme';

const tabs = [
  { id: 'home', label: 'Ana Sayfa', icon: 'home' },
  { id: 'matches', label: 'Maçlar', icon: 'calendar' },
  { id: 'leagues', label: 'Ligler', icon: 'trophy' },
  { id: 'news', label: 'Haberler', icon: 'newspaper' },
  { id: 'profile', label: 'Profil', icon: 'person' },
];

function TabItem({ tab, active, onPress }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(progress, { toValue: active ? 1 : 0, useNativeDriver: false, speed: 22, bounciness: 6 }).start();
  }, [active, progress]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 40] });
  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <AnimatedPressable onPress={onPress} style={styles.tab} scaleTo={0.9}>
      <View style={[styles.iconWrap, active && styles.activeIconWrap]}>
        <Ionicons name={active ? tab.icon : `${tab.icon}-outline`} size={21} color={active ? colors.black : colors.textMuted} />
      </View>
      <Animated.Text style={[styles.label, active && styles.activeLabel, { opacity }]} numberOfLines={1}>{tab.label}</Animated.Text>
      <Animated.View style={[styles.indicator, { width }]} />
    </AnimatedPressable>
  );
}

export default function BottomNav({ activeTab, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => <TabItem key={tab.id} tab={tab} active={activeTab === tab.id} onPress={() => onChange(tab.id)} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: '#091626', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, paddingBottom: 10, paddingHorizontal: 4 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 54, position: 'relative' },
  iconWrap: { width: 36, height: 32, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  activeIconWrap: { backgroundColor: colors.primary },
  label: { color: colors.textMuted, fontSize: 9, fontWeight: '800', marginTop: 2, maxWidth: 62 },
  activeLabel: { color: colors.primary },
  indicator: { position: 'absolute', bottom: -7, height: 3, borderRadius: radii.pill, backgroundColor: colors.primary },
});
