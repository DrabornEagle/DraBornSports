import React, { useMemo, useRef, useEffect } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import SportFilter from '../components/SportFilter';
import SectionHeader from '../components/SectionHeader';
import MatchCard from '../components/MatchCard';
import FadeInView from '../components/FadeInView';
import AnimatedPressable from '../components/AnimatedPressable';
import LivePill from '../components/LivePill';
import { matches, news } from '../data/demoData';
import { colors, gradients, radii } from '../theme';

function ScoreTicker({ item, index, onPress }) {
  return (
    <FadeInView delay={80 + index * 70}>
      <AnimatedPressable onPress={() => onPress(item)} style={styles.tickerCard}>
        <View style={styles.tickerTop}>
          {item.status === 'live' ? <LivePill compact /> : <Text style={styles.tickerTime}>{item.startTime}</Text>}
          <Text style={styles.tickerLeague} numberOfLines={1}>{item.competition}</Text>
        </View>
        <View style={styles.tickerTeams}>
          <Text style={styles.tickerTeam} numberOfLines={1}>{item.home.short}</Text>
          <Text style={styles.tickerScore}>{item.homeScore == null ? 'VS' : `${item.homeScore}-${item.awayScore}`}</Text>
          <Text style={styles.tickerTeam} numberOfLines={1}>{item.away.short}</Text>
        </View>
      </AnimatedPressable>
    </FadeInView>
  );
}

function HeroCard({ onPress }) {
  const shine = useRef(new Animated.Value(-120)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(shine, { toValue: 420, duration: 1700, useNativeDriver: true }),
        Animated.timing(shine, { toValue: -120, duration: 0, useNativeDriver: true }),
        Animated.delay(1900),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shine]);

  return (
    <FadeInView delay={120}>
      <AnimatedPressable onPress={onPress} style={styles.heroOuter} haptic="medium">
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroOrbOne} />
          <View style={styles.heroOrbTwo} />
          <Animated.View style={[styles.shine, { transform: [{ translateX: shine }, { rotate: '18deg' }] }]} />
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroEyebrow}>GECENİN MAÇI</Text>
              <Text style={styles.heroTitle}>Derbi Ateşi</Text>
              <Text style={styles.heroSubtitle}>Fenerbahçe · Galatasaray</Text>
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="flash" size={20} color={colors.black} />
            </View>
          </View>
          <View style={styles.heroScoreRow}>
            <Text style={styles.heroClub}>FB</Text>
            <View style={styles.heroScoreCenter}>
              <LivePill />
              <Text style={styles.heroScore}>2  -  1</Text>
              <Text style={styles.heroMinute}>67. dakika</Text>
            </View>
            <Text style={styles.heroClub}>GS</Text>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroMeta}>
              <Ionicons name="people-outline" size={15} color={colors.textMuted} />
              <Text style={styles.heroMetaText}>842B takip ediyor</Text>
            </View>
            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Maç Merkezi</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.black} />
            </View>
          </View>
        </LinearGradient>
      </AnimatedPressable>
    </FadeInView>
  );
}

function QuickAction({ icon, label, color, onPress, delay }) {
  return (
    <FadeInView delay={delay} style={styles.quickActionWrap}>
      <AnimatedPressable onPress={onPress} style={styles.quickAction}>
        <View style={[styles.quickIcon, { backgroundColor: `${color}20`, borderColor: `${color}55` }]}>
          <Ionicons name={icon} size={21} color={color} />
        </View>
        <Text style={styles.quickLabel}>{label}</Text>
      </AnimatedPressable>
    </FadeInView>
  );
}

export default function HomeScreen({ selectedSport, onSportChange, appMatches, onMatchPress, onToggleFavorite, onSearch, onNotifications, onGoMatches, onGoLeagues, onGoNews, onFavoriteFilter }) {
  const liveMatches = useMemo(() => appMatches.filter((m) => m.status === 'live' && (selectedSport === 'all' || m.sport === selectedSport)), [appMatches, selectedSport]);
  const firstLive = appMatches.find((m) => m.id === 'm1') || matches[0];

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="DraBornSports · v0.1"
        title="Sporun Nabzı"
        rightActions={[
          { icon: 'search', onPress: onSearch },
          { icon: 'notifications', badge: 3, onPress: onNotifications },
        ]}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SportFilter selected={selectedSport} onSelect={onSportChange} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerContent}>
          {appMatches.slice(0, 5).map((item, index) => <ScoreTicker key={item.id} item={item} index={index} onPress={onMatchPress} />)}
        </ScrollView>

        <View style={styles.sectionPadding}>
          <HeroCard onPress={() => onMatchPress(firstLive)} />

          <View style={styles.quickGrid}>
            <QuickAction icon="radio" label="Canlı" color={colors.live} onPress={onGoMatches} delay={180} />
            <QuickAction icon="heart" label="Favoriler" color={colors.primary} onPress={onFavoriteFilter} delay={220} />
            <QuickAction icon="trophy" label="Puan Durumu" color={colors.accent} onPress={onGoLeagues} delay={260} />
            <QuickAction icon="newspaper" label="Son Haberler" color={colors.purple} on@ress={onGoNews} delay={300} />
          </View>

          <FadeInView delay={340}>
            <SectionHeader title="Şu An Canlı" subtitle={`${liveMatches.length} karşılaşma devam ediyor`} action="Tümünü gör" onAction={onGoMatches} />
            {liveMatches.length ? liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} onPress={onMatchPress} onToggleFavorite={onToggleFavorite} />
            )) : (
              <View style={styles.emptyCard}>
                <Ionicons name="moon-outline" size={26} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Bu branşta canlı maç yok</Text>
                <Text style={styles.emptyText}>Yaklaşan karşılaşmalar için Maçlar sekmesine göz at.</Text>
              </View>
            )}
          </FadeInView>

          <FadeInView delay={400}>
            <SectionHeader title="Gündem" subtitle="Spor dünyasından öne çıkanlar" action="Haberler" onAction={onGoNews} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newsRow}>
              {news.slice(0, 3).map((item) => (
                <AnimatedPressable key={item.id} onPress={onGoNews} style={styles.newsMiniCard}>
                  <LinearGradient colors={item.gradient} style={styles.newsMiniVisual}>
                    <Ionicons name={item.icon} size={36} color="rgba(255,255,255,0.9)" />
                    <View style={styles.newsCategory}><Text style={styles.newsCategoryText}>{item.category}</Text></View>
                  </LinearGradient>
                  <Text style={styles.newsMiniTitle} numberOfLines={3}>{item.title}</Text>
                  <Text style={styles.newsMiniTime}>{item.time}</Text>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 24 },
  tickerContent: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 2, gap: 10 },
  tickerCard: { width: 142, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, padding: 11 },
  tickerTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  tickerLeague: { color: colors.textMuted, fontSize: 9, fontWeight: '700', flex: 1 },
  tickerTime: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  tickerTeams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tickerTeam: { color: colors.text, fontSize: 12, fontWeight: '900', width: 35, textAlign: 'center' },
  tickerScore: { color: colors.text, fontSize: 17, fontWeight: '900' },
  sectionPadding: { paddingHorizontal: 18 },
  heroOuter: { marginTop: 17, marginBottom: 18, borderRadius: radii.xl, overflow: 'hidden' },
  hero: { minHeight: 255, borderRadius: radii.xl, padding: 19, borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)', overflow: 'hidden' },
  heroOrbOne: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(50,230,161,0.11)', right: -50, top: -70 },
  heroOrbTwo: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(109,123,255,0.14)', left: -45, bottom: -55 },
  shine: { position: 'absolute', width: 52, height: 360, backgroundColor: 'rgba(255,255,255,0.05)', top: -60 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroEyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  heroTitle: { color: colors.text, fontSize: 27, fontWeight: '900', letterSpacing: -1, marginTop: 4 },
  heroSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  heroBadge: { width: 44, height: 44, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  heroScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, paddingHorizontal: 6 },
  heroClub: { color: colors.text, fontSize: 32, fontWeight: '900', width: 60, textAlign: 'center' },
  heroScoreCenter: { alignItems: 'center', gap: 5 },
  heroScore: { color: colors.text, fontSize: 29, fontWeight: '900', letterSpacing: -1 },
  heroMinute: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroMetaText: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  heroButton: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.primary, paddingHorizontal: 13, height: 38, borderRadius: radii.medium },
  heroButtonText: { color: colors.black, fontSize: 11, fontWeight: '900' },
  quickGrid: { flexDirection: 'row', gap: 9, marginBottom: 24 },
  quickActionWrap: { flex: 1 },
  quickAction: { alignItems: 'center', gap: 8 },
  quickIcon: { width: 49, height: 49, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  quickLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', textAlign: 'center' },
  emptyCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, padding: 24, alignItems: 'center', marginBottom: 20 },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 10 },
  emptyText: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 5 },
  newsRow: { gap: 12, paddingBottom: 4 },
  newsMiniCard: { width: 205, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  newsMiniVisual: { height: 105, padding: 14, justifyContent: 'space-between', alignItems: 'flex-start' },
  newsCategory: { backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 4 },
  newsCategoryText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  newsMiniTitle: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: '900', paddingHorizontal: 13, paddingTop: 12 },
  newsMiniTime: { color: colors.textMuted, fontSize: 9, paddingHorizontal: 13, paddingVertical: 12 },
});
