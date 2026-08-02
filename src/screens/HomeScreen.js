import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import SportFilter from '../components/SportFilter';
import SectionHeader from '../components/SectionHeader';
import MatchCard from '../components/MatchCard';
import FadeInView from '../components/FadeInView';
import AnimatedPressable from '../components/AnimatedPressable';
import LivePill from '../components/LivePill';
import { news } from '../data/demoData';
import { colors, gradients, radii } from '../theme';

function QuickAction({ icon, label, color, onPress, delay }) {
  return (
    <FadeInView delay={delay} style={styles.quickWrap}>
      <AnimatedPressable onPress={onPress} style={styles.quickAction}>
        <View style={[styles.quickIcon, { backgroundColor: `${color}20`, borderColor: `${color}55` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
      </AnimatedPressable>
    </FadeInView>
  );
}

export default function HomeScreen({
  selectedSport,
  onSportChange,
  appMatches,
  onMatchPress,
  onToggleFavorite,
  onSearch,
  onNotifications,
  onGoMatches,
  onGoAnalysis,
  onGoLeagues,
  onGoNews,
}) {
  const liveMatches = useMemo(
    () => appMatches.filter((match) => match.status === 'live' && (selectedSport === 'all' || match.sport === selectedSport)),
    [appMatches, selectedSport],
  );
  const featuredMatch = appMatches.find((match) => match.id === 'm1') || appMatches[0];

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="DraBornSports · v0.2"
        title="Sporun Nabzı"
        rightActions={[
          { icon: 'search', onPress: onSearch },
          { icon: 'notifications', badge: 3, onPress: onNotifications },
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SportFilter selected={selectedSport} onSelect={onSportChange} />

        <View style={styles.padding}>
          <FadeInView delay={70}>
            <AnimatedPressable onPress={() => onMatchPress(featuredMatch)} style={styles.heroOuter} haptic="medium">
              <LinearGradient colors={gradients.hero} style={styles.hero}>
                <View style={styles.heroOrbOne} />
                <View style={styles.heroOrbTwo} />
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroEyebrow}>GECENİN MAÇI</Text>
                    <Text style={styles.heroTitle}>{featuredMatch.home.name} – {featuredMatch.away.name}</Text>
                    <Text style={styles.heroSub}>{featuredMatch.competition} · {featuredMatch.venue}</Text>
                  </View>
                  <View style={styles.heroBadge}><Ionicons name="flash" size={21} color={colors.black} /></View>
                </View>
                <View style={styles.scoreRow}>
                  <Text style={styles.club}>{featuredMatch.home.short}</Text>
                  <View style={styles.scoreCenter}>
                    {featuredMatch.status === 'live' ? <LivePill /> : null}
                    <Text style={styles.score}>
                      {featuredMatch.homeScore == null ? featuredMatch.startTime : `${featuredMatch.homeScore}  -  ${featuredMatch.awayScore}`}
                    </Text>
                    <Text style={styles.minute}>{featuredMatch.minute || 'Maç merkezi'}</Text>
                  </View>
                  <Text style={styles.club}>{featuredMatch.away.short}</Text>
                </View>
                <View style={styles.heroBottom}>
                  <Text style={styles.heroMeta}>Form · xG · geçmiş maçlar · canlı istatistik</Text>
                  <View style={styles.heroButton}>
                    <Text style={styles.heroButtonText}>Detay</Text>
                    <Ionicons name="arrow-forward" size={15} color={colors.black} />
                  </View>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </FadeInView>

          <View style={styles.quickGrid}>
            <QuickAction icon="radio" label="Canlı" color={colors.live} onPress={onGoMatches} delay={120} />
            <QuickAction icon="analytics" label="Kupon Analiz" color={colors.primary} onPress={onGoAnalysis} delay={160} />
            <QuickAction icon="trophy" label="Puan Durumu" color={colors.accent} onPress={onGoLeagues} delay={200} />
            <QuickAction icon="newspaper" label="Haberler" color={colors.purple} onPress={onGoNews} delay={240} />
          </View>

          <FadeInView delay={280}>
            <AnimatedPressable onPress={onGoAnalysis} style={styles.analysisBanner}>
              <View style={styles.analysisIcon}><Ionicons name="sparkles" size={25} color={colors.black} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.analysisEyebrow}>YENİ · v0.2</Text>
                <Text style={styles.analysisTitle}>DraBorn Kupon Analiz Motoru</Text>
                <Text style={styles.analysisText}>Maç sayısını, tarihi ve teorik tutarı seç; detaylı olasılık raporunu saniyeler içinde gör.</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={colors.primary} />
            </AnimatedPressable>
          </FadeInView>

          <FadeInView delay={330}>
            <SectionHeader
              title="Şu An Canlı"
              subtitle={`${liveMatches.length} karşılaşma devam ediyor`}
              action="Tümünü gör"
              onAction={onGoMatches}
            />
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onPress={onMatchPress}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </FadeInView>

          <FadeInView delay={380}>
            <SectionHeader title="Gündem" subtitle="Spor dünyasından demo başlıklar" action="Haberler" onAction={onGoNews} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newsRow}>
              {news.slice(0, 3).map((item) => (
                <AnimatedPressable key={item.id} onPress={onGoNews} style={styles.newsCard}>
                  <LinearGradient colors={item.gradient} style={styles.newsVisual}>
                    <Ionicons name={item.icon} size={34} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.newsCategory}>{item.category}</Text>
                  </LinearGradient>
                  <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
                  <Text style={styles.newsTime}>{item.time}</Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </FadeInView>

          <View style={styles.complianceFooter}>
            <Ionicons name="shield-checkmark-outline" size={17} color={colors.primary} />
            <Text style={styles.complianceText}>18+ · Analizler eğitim amaçlıdır; bahis işlemi ve kazanç garantisi içermez.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 26 },
  padding: { paddingHorizontal: 18 },
  heroOuter: { marginTop: 17, marginBottom: 18, borderRadius: radii.xl, overflow: 'hidden' },
  hero: { minHeight: 245, borderRadius: radii.xl, padding: 18, borderWidth: 1, borderColor: colors.borderStrong, overflow: 'hidden' },
  heroOrbOne: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(50,230,161,0.11)', right: -50, top: -70 },
  heroOrbTwo: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(109,123,255,0.14)', left: -45, bottom: -55 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  heroEyebrow: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: colors.text, fontSize: 21, fontWeight: '900', letterSpacing: -0.6, marginTop: 5 },
  heroSub: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  heroBadge: { width: 43, height: 43, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, paddingHorizontal: 7 },
  club: { color: colors.text, fontSize: 31, fontWeight: '900', width: 55, textAlign: 'center' },
  scoreCenter: { alignItems: 'center', gap: 5 },
  score: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  minute: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 21, gap: 10 },
  heroMeta: { color: colors.textMuted, fontSize: 8, flex: 1 },
  heroButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: 12, height: 36, borderRadius: 12 },
  heroButtonText: { color: colors.black, fontSize: 10, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: 8, marginBottom: 21 },
  quickWrap: { flex: 1 },
  quickAction: { alignItems: 'center', gap: 7 },
  quickIcon: { width: 48, height: 48, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800', textAlign: 'center' },
  analysisBanner: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: 'rgba(50,230,161,0.07)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.22)', borderRadius: radii.large, padding: 14, marginBottom: 23 },
  analysisIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  analysisEyebrow: { color: colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  analysisTitle: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 3 },
  analysisText: { color: colors.textMuted, fontSize: 8, lineHeight: 13, marginTop: 4 },
  newsRow: { gap: 11, paddingBottom: 3 },
  newsCard: { width: 200, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  newsVisual: { height: 100, padding: 13, justifyContent: 'space-between', alignItems: 'flex-start' },
  newsCategory: { color: '#fff', fontSize: 8, fontWeight: '900', backgroundColor: 'rgba(0,0,0,0.34)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  newsTitle: { color: colors.text, fontSize: 12, lineHeight: 17, fontWeight: '900', paddingHorizontal: 12, paddingTop: 11 },
  newsTime: { color: colors.textMuted, fontSize: 8, paddingHorizontal: 12, paddingVertical: 11 },
  complianceFooter: { flexDirection: 'row', gap: 8, padding: 14, marginTop: 16 },
  complianceText: { color: colors.textMuted, fontSize: 8, lineHeight: 13, flex: 1 },
});
