import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
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
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
      </AnimatedPressable>
    </FadeInView>
  );
}

function AnalysisBanner({ onPress }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scan, {
            toValue: 1,
            duration: 2200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scan, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, scan]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.03] });
  const scanX = scan.interpolate({ inputRange: [0, 1], outputRange: [-70, 390] });

  return (
    <FadeInView delay={280}>
      <AnimatedPressable onPress={onPress} style={styles.analysisBanner} haptic="medium">
        <LinearGradient colors={gradients.cardBlue} style={styles.analysisBannerInner}>
          <View style={styles.analysisOrb} />
          <Animated.View
            pointerEvents="none"
            style={[styles.analysisScan, { transform: [{ translateX: scanX }, { rotate: '16deg' }] }]}
          />

          <View style={styles.analysisIconArea}>
            <Animated.View
              style={[
                styles.analysisRing,
                { opacity: ringOpacity, transform: [{ scale: ringScale }] },
              ]}
            />
            <LinearGradient colors={gradients.primary} style={styles.analysisIcon}>
              <Ionicons name="sparkles" size={28} color={colors.black} />
            </LinearGradient>
          </View>

          <View style={styles.analysisCopy}>
            <View style={styles.analysisTopRow}>
              <Text style={styles.analysisEyebrow}>YENİ · v0.2.3</Text>
              <View style={styles.engineLivePill}>
                <View style={styles.engineLiveDot} />
                <Text style={styles.engineLiveText}>MOTOR AKTİF</Text>
              </View>
            </View>
            <Text style={styles.analysisTitle}>DraBorn Kupon Analiz Motoru</Text>
            <Text style={styles.analysisText}>
              Tarihi, maç sayısını ve teorik tutarı seç; veri kalitesi, risk ve olasılık raporunu saniyeler içinde gör.
            </Text>
            <View style={styles.analysisFooterRow}>
              <Text style={styles.analysisFooterText}>Form · xG · H2H · hava · eksikler</Text>
              <View style={styles.analysisOpenButton}>
                <Text style={styles.analysisOpenText}>Analizi aç</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.black} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </FadeInView>
  );
}

export default function HomeScreenV023({
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
    () => appMatches.filter((match) => (
      match.status === 'live'
      && (selectedSport === 'all' || match.sport === selectedSport)
    )),
    [appMatches, selectedSport],
  );
  const featuredMatch = appMatches.find((match) => match.id === 'm1') || appMatches[0];

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="DraBornSports · v0.2.3"
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
                  <View style={styles.heroTitleWrap}>
                    <Text style={styles.heroEyebrow}>GECENİN MAÇI</Text>
                    <Text style={styles.heroTitle}>{featuredMatch.home.name} – {featuredMatch.away.name}</Text>
                    <Text style={styles.heroSub}>{featuredMatch.competition} · {featuredMatch.venue}</Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Ionicons name="flash" size={22} color={colors.black} />
                  </View>
                </View>

                <View style={styles.scoreRow}>
                  <Text style={styles.club}>{featuredMatch.home.short}</Text>
                  <View style={styles.scoreCenter}>
                    {featuredMatch.status === 'live' ? <LivePill /> : null}
                    <Text style={styles.score}>
                      {featuredMatch.homeScore == null
                        ? featuredMatch.startTime
                        : `${featuredMatch.homeScore}  -  ${featuredMatch.awayScore}`}
                    </Text>
                    <Text style={styles.minute}>{featuredMatch.minute || 'Maç merkezi'}</Text>
                  </View>
                  <Text style={styles.club}>{featuredMatch.away.short}</Text>
                </View>

                <View style={styles.heroBottom}>
                  <Text style={styles.heroMeta}>Form · xG · geçmiş maçlar · canlı istatistik</Text>
                  <View style={styles.heroButton}>
                    <Text style={styles.heroButtonText}>Detay</Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.black} />
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

          <AnalysisBanner onPress={onGoAnalysis} />

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
            <SectionHeader
              title="Gündem"
              subtitle="Spor dünyasından demo başlıklar"
              action="Haberler"
              onAction={onGoNews}
            />
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
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={styles.complianceText}>
              18+ · Analizler eğitim amaçlıdır; bahis işlemi ve kazanç garantisi içermez.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 140 },
  padding: { paddingHorizontal: 18 },
  heroOuter: {
    marginTop: 17,
    marginBottom: 20,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  hero: {
    minHeight: 270,
    borderRadius: radii.xl,
    padding: 19,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  heroOrbOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(50,230,161,0.11)',
    right: -50,
    top: -70,
  },
  heroOrbTwo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(109,123,255,0.14)',
    left: -45,
    bottom: -55,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroTitleWrap: { flex: 1 },
  heroEyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  heroTitle: { color: colors.text, fontSize: 24, lineHeight: 29, fontWeight: '900', letterSpacing: -0.6, marginTop: 7 },
  heroSub: { color: colors.textMuted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  heroBadge: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    paddingHorizontal: 7,
  },
  club: { color: colors.text, fontSize: 34, fontWeight: '900', width: 64, textAlign: 'center' },
  scoreCenter: { alignItems: 'center', gap: 6 },
  score: { color: colors.text, fontSize: 31, fontWeight: '900', letterSpacing: -1 },
  minute: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 11,
  },
  heroMeta: { color: colors.textMuted, fontSize: 10, lineHeight: 15, flex: 1 },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 14,
  },
  heroButtonText: { color: colors.black, fontSize: 12, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: 8, marginBottom: 23 },
  quickWrap: { flex: 1 },
  quickAction: { alignItems: 'center', gap: 9 },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { color: colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '800', textAlign: 'center' },
  analysisBanner: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: 25,
  },
  analysisBannerInner: {
    minHeight: 190,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(50,230,161,0.25)',
    borderRadius: radii.xl,
    padding: 17,
    overflow: 'hidden',
  },
  analysisOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(50,230,161,0.08)',
    right: -70,
    top: -80,
  },
  analysisScan: {
    position: 'absolute',
    width: 42,
    height: 260,
    top: -35,
    backgroundColor: 'rgba(255,255,255,0.045)',
  },
  analysisIconArea: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisRing: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  analysisIcon: {
    width: 62,
    height: 62,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisCopy: { flex: 1 },
  analysisTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  analysisEyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  engineLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(50,230,161,0.10)',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  engineLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  engineLiveText: { color: colors.primary, fontSize: 8, fontWeight: '900' },
  analysisTitle: { color: colors.text, fontSize: 17, lineHeight: 22, fontWeight: '900', marginTop: 7 },
  analysisText: { color: colors.textMuted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  analysisFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 13,
  },
  analysisFooterText: { color: colors.textMuted, fontSize: 9, flex: 1 },
  analysisOpenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 34,
  },
  analysisOpenText: { color: colors.black, fontSize: 10, fontWeight: '900' },
  newsRow: { gap: 11, paddingBottom: 3 },
  newsCard: {
    width: 210,
    backgroundColor: colors.surface,
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  newsVisual: { height: 105, padding: 13, justifyContent: 'space-between', alignItems: 'flex-start' },
  newsCategory: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.34)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  newsTitle: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', paddingHorizontal: 12, paddingTop: 11 },
  newsTime: { color: colors.textMuted, fontSize: 10, paddingHorizontal: 12, paddingVertical: 11 },
  complianceFooter: { flexDirection: 'row', gap: 9, padding: 14, marginTop: 16 },
  complianceText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, flex: 1 },
});
