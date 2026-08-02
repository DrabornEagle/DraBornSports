import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import SportFilter from '../components/SportFilter';
import AnimatedPressable from '../components/AnimatedPressable';
import FadeInView from '../components/FadeInView';
import { news } from '../data/demoData';
import { colors, radii } from '../theme';

export default function NewsScreen({ selectedSport, onSportChange, onNewsPress, onSearch }) {
  const [savedIds, setSavedIds] = useState(['n2']);
  const filtered = useMemo(() => news.filter((item) => selectedSport === 'all' || item.sport === selectedSport), [selectedSport]);
  const featured = filtered[0] || news[0];
  const list = filtered.slice(1);

  const toggleSaved = (id) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="SON DAKİKA & ANALİZ" title="Spor Haberleri" rightActions={[{ icon: 'search', onPress: onSearch }, { icon: 'bookmark', badge: savedIds.length || null, onPress: () => {} }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SportFilter selected={selectedSport} onSelect={onSportChange} compact />
        <View style={styles.contentPadding}>
          <FadeInView delay={80}>
            <AnimatedPressable onPress={() => onNewsPress(featured)} style={styles.featuredCard} haptic="medium">
              <LinearGradient colors={featured.gradient} style={styles.featuredVisual}>
                <View style={styles.featuredTop}>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{featured.category}</Text></View>
                  <AnimatedPressable onPress={() => toggleSaved(featured.id)} style={styles.bookmarkButton}>
                    <Ionicons name={savedIds.includes(featured.id) ? 'bookmark' : 'bookmark-outline'} size={19} color="#fff" />
                  </AnimatedPressable>
                </View>
                <Ionicons name={featured.icon} size={70} color="rgba(255,255,255,0.28)" />
                <View>
                  <Text style={styles.featuredTitle}>{featured.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{featured.time}</Text>
                    <View style={styles.metaDot} />
                    <Text style={styles.metaText}>{featured.readTime} okuma</Text>
                  </View>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </FadeInView>

          <View style={styles.sectionRow}>
            <View>
              <Text style={styles.sectionTitle}>Günün Gündemi</Text>
              <Text style={styles.sectionSub}>{filtered.length} demo haber</Text>
            </View>
            <View style={styles.trendingPill}><Ionicons name="trending-up" size={14} color={colors.primary} /><Text style={styles.trendingText}>Trend</Text></View>
          </View>

          {list.map((item, index) => (
            <FadeInView key={item.id} delay={130 + index * 60}>
              <AnimatedPressable onPress={() => onNewsPress(item)} style={styles.newsCard}>
                <LinearGradient colors={item.gradient} style={styles.newsVisual}>
                  <Ionicons name={item.icon} size={32} color="rgba(255,255,255,0.82)" />
                  <View style={styles.smallCategory}><Text style={styles.smallCategoryText}>{item.category}</Text></View>
                </LinearGradient>
                <View style={styles.newsBody}>
                  <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
                  <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
                  <View style={styles.newsBottom}>
                    <Text style={styles.newsTime}>{item.time} · {item.readTime}</Text>
                    <AnimatedPressable onPress={() => toggleSaved(item.id)} style={styles.smallBookmark}>
                      <Ionicons name={savedIds.includes(item.id) ? 'bookmark' : 'bookmark-outline'} size={17} color={savedIds.includes(item.id) ? colors.primary : colors.textMuted} />
                    </AnimatedPressable>
                  </View>
                </View>
              </AnimatedPressable>
            </FadeInView>
          ))}

          {list.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="newspaper-outline" size={34} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Bu branşta başka demo haber yok</Text>
              <Text style={styles.emptyText}>Tümü filtresine dönerek diğer spor haberlerini görebilirsin.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 28 },
  contentPadding: { paddingHorizontal: 18 },
  featuredCard: { marginTop: 17, borderRadius: radii.xl, overflow: 'hidden' },
  featuredVisual: { minHeight: 300, borderRadius: radii.xl, padding: 18, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  featuredTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  categoryBadge: { backgroundColor: 'rgba(0,0,0,0.34)', paddingHorizontal: 11, paddingVertical: 6, borderRadius: radii.pill },
  categoryText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  bookmarkButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
  featuredTitle: { color: '#fff', fontSize: 24, lineHeight: 30, fontWeight: '900', letterSpacing: -0.6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 },
  metaText: { color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: '700' },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 13 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  sectionSub: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  trendingPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(50,230,161,0.1)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.25)', borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  trendingText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  newsCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 12, minHeight: 150 },
  newsVisual: { width: 108, padding: 12, justifyContent: 'space-between', alignItems: 'flex-start' },
  smallCategory: { backgroundColor: 'rgba(0,0,0,0.32)', paddingHorizontal: 7, paddingVertical: 4, borderRadius: radii.pill },
  smallCategoryText: { color: '#fff', fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  newsBody: { flex: 1, padding: 13 },
  newsTitle: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900' },
  newsSummary: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 6 },
  newsBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 8 },
  newsTime: { color: colors.textMuted, fontSize: 9 },
  smallBookmark: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  emptyCard: { alignItems: 'center', padding: 26, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 11 },
  emptyText: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: 5 },
});
