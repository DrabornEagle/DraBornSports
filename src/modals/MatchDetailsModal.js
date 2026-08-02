import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedPressable from '../components/AnimatedPressable';
import LivePill from '../components/LivePill';
import TeamBadge from '../components/TeamBadge';
import { colors, gradients, radii } from '../theme';

function StatBar({ stat, index }) {
  const progress = useRef(new Animated.Value(0)).current;
  const total = Number(stat.home) + Number(stat.away) || 1;
  const homeWidth = `${Math.max(8, (Number(stat.home) / total) * 100)}%`;
  const awayWidth = `${Math.max(8, (Number(stat.away) / total) * 100)}%`;

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: 600, delay: index * 90, useNativeDriver: false }).start();
  }, [index, progress]);

  return (
    <View style={styles.statBlock}>
      <View style={styles.statValues}>
        <Text style={styles.statValue}>{stat.home}{stat.suffix || ''}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
        <Text style={styles.statValue}>{stat.away}{stat.suffix || ''}</Text>
      </View>
      <View style={styles.barsRow}>
        <View style={styles.leftBarTrack}><Animated.View style={[styles.leftBar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', homeWidth] }) }]} /></View>
        <View style={styles.rightBarTrack}><Animated.View style={[styles.rightBar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', awayWidth] }) }]} /></View>
      </View>
    </View>
  );
}

export default function MatchDetailsModal({ match, visible, onClose, onToggleFavorite }) {
  const [tab, setTab] = useState('overview');
  const slide = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setTab('overview');
      slide.setValue(40);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 4 }),
        Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, slide, opacity]);

  if (!match) return null;
  const live = match.status === 'live';
  const finished = match.status === 'finished';

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.sheet, { opacity, transform: [{ translateY: slide }] }]}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.topRow}>
              <AnimatedPressable onPress={onClose} style={styles.closeButton}><Ionicons name="chevron-down" size={24} color={colors.text} /></AnimatedPressable>
              <View style={styles.leaguePill}><Ionicons name="trophy-outline" size={13} color={colors.accent} /><Text style={styles.leagueText}>{match.competition}</Text></View>
              <AnimatedPressable onPress={() => onToggleFavorite(match.id)} style={styles.closeButton}><Ionicons name={match.favorite ? 'heart' : 'heart-outline'} size={21} color={match.favorite ? colors.live : colors.text} /></AnimatedPressable>
            </View>
            <View style={styles.statusWrap}>{live ? <LivePill /> : <Text style={styles.statusText}>{finished ? 'MAÇ SONU' : `${match.startTime} · BUGÜN`}</Text>}</View>
            <View style={styles.scoreRow}>
              <View style={styles.teamWrap}><TeamBadge team={match.home} size={65} /><Text style={styles.teamName}>{match.home.name}</Text></View>
              <View style={styles.scoreWrap}>
                <Text style={styles.score}>{match.homeScore == null ? 'VS' : `${match.homeScore} - ${match.awayScore}`}</Text>
                <Text style={styles.minute}>{live ? match.minute : finished ? 'MS' : 'Başlama saati'}</Text>
              </View>
              <View style={styles.teamWrap}><TeamBadge team={match.away} size={65} /><Text style={styles.teamName}>{match.away.name}</Text></View>
            </View>
            {match.setScores ? <Text style={styles.setScores}>{match.setScores}</Text> : null}
            <View style={styles.venueRow}><Ionicons name="location-outline" size={14} color={colors.textMuted} /><Text style={styles.venueText}>{match.venue}</Text>{match.viewers ? <><View style={styles.metaDot} /><Ionicons name="eye-outline" size={14} color={colors.textMuted} /><Text style={styles.venueText}>{match.viewers}</Text></> : null}</View>
          </LinearGradient>

          <View style={styles.tabs}>
            {[['overview','Özet'],['stats','İstatistik'],['events','Olaylar']].map(([id, label]) => (
              <AnimatedPressable key={id} onPress={() => setTab(id)} style={[styles.tab, tab === id && styles.activeTab]}>
                <Text style={[styles.tabText, tab === id && styles.activeTabText]}>{label}</Text>
              </AnimatedPressable>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {tab === 'overview' ? (
              <>
                <View style={styles.momentumCard}>
                  <View style={styles.cardTitleRow}><View><Text style={styles.cardTitle}>Maç Akışı</Text><Text style={styles.cardSub}>Demo momentum göstergesi</Text></View><Ionicons name="pulse" size={22} color={colors.primary} /></View>
                  <View style={styles.momentumBars}>
                    {[42,58,35,70,48,84,62,74,51,67,78,59].map((height, index) => <View key={index} style={[styles.momentumBar, { height: height * 0.55, backgroundColor: index < 6 ? colors.primary : colors.secondary }]} />)}
                  </View>
                  <View style={styles.timeline}><Text style={styles.timelineText}>0'</Text><Text style={styles.timelineText}>45'</Text><Text style={styles.timelineText}>90'</Text></View>
                </View>
                <View style={styles.insightCard}><Ionicons name="sparkles" size={22} color={colors.accent} /><View style={{ flex: 1 }}><Text style={styles.insightTitle}>DraBorn İçgörüsü</Text><Text style={styles.insightText}>{live ? 'Ev sahibi son 10 dakikada baskıyı artırdı. Kanat hücumları ve ikinci toplar maçın yönünü belirliyor.' : finished ? 'Yüksek tempolu mücadelede son bölümdeki bitiricilik sonucu belirledi.' : 'Takımların son formuna göre dengeli ve yüksek tempolu bir mücadele bekleniyor.'}</Text></View></View>
              </>
            ) : null}

            {tab === 'stats' ? (
              match.stats.length ? <View style={styles.statsCard}>{match.stats.map((stat, index) => <StatBar key={stat.label} stat={stat} index={index} />)}</View> : <View style={styles.empty}><Ionicons name="stats-chart-outline" size={30} color={colors.textMuted} /><Text style={styles.emptyTitle}>İstatistikler maç başlayınca açılacak</Text></View>
            ) : null}

            {tab === 'events' ? (
              match.events.length ? <View style={styles.eventsCard}>{match.events.map((event, index) => <View key={`${event}-${index}`} style={styles.eventRow}><View style={[styles.eventIcon, { backgroundColor: index % 2 === 0 ? 'rgba(50,230,161,0.12)' : 'rgba(255,176,46,0.12)' }]}><Ionicons name={event.includes('’') ? 'football' : 'flash'} size={17} color={index % 2 === 0 ? colors.primary : colors.accent} /></View><Text style={styles.eventText}>{event}</Text></View>)}</View> : <View style={styles.empty}><Ionicons name="time-outline" size={30} color={colors.textMuted} /><Text style={styles.emptyTitle}>Henüz maç olayı yok</Text></View>
            ) : null}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(1,5,10,0.78)' },
  sheet: { height: '92%', backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  hero: { paddingTop: 12, paddingHorizontal: 18, paddingBottom: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  leaguePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: radii.pill, paddingHorizontal: 11, paddingVertical: 7 },
  leagueText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  statusWrap: { alignItems: 'center', marginTop: 12 },
  statusText: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 },
  teamWrap: { width: 115, alignItems: 'center', gap: 8 },
  teamName: { color: colors.text, fontSize: 12, fontWeight: '900', textAlign: 'center' },
  scoreWrap: { alignItems: 'center' },
  score: { color: colors.text, fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  minute: { color: colors.textMuted, fontSize: 10, fontWeight: '800', marginTop: 4 },
  setScores: { color: colors.textMuted, fontSize: 9, textAlign: 'center', marginTop: 10 },
  venueRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 15 },
  venueText: { color: colors.textMuted, fontSize: 9 },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.textMuted, marginHorizontal: 3 },
  tabs: { flexDirection: 'row', paddingHorizontal: 18, paddingTop: 12, gap: 7 },
  tab: { flex: 1, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 11, fontWeight: '900' },
  activeTabText: { color: colors.black },
  content: { padding: 18, paddingBottom: 40 },
  momentumCard: { backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, padding: 16 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  cardSub: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  momentumBars: { height: 62, marginTop: 20, flexDirection: 'row', alignItems: 'flex-end', gap: 5 },
  momentumBar: { flex: 1, minHeight: 8, borderRadius: 4 },
  timeline: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 7, marginTop: 5 },
  timelineText: { color: colors.textMuted, fontSize: 8 },
  insightCard: { marginTop: 13, backgroundColor: 'rgba(255,176,46,0.08)', borderWidth: 1, borderColor: 'rgba(255,176,46,0.22)', borderRadius: radii.large, padding: 15, flexDirection: 'row', gap: 12 },
  insightTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  insightText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 4 },
  statsCard: { backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, padding: 16 },
  statBlock: { marginBottom: 20 },
  statValues: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statValue: { color: colors.text, fontSize: 12, fontWeight: '900', width: 45, textAlign: 'center' },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  barsRow: { flexDirection: 'row', gap: 5, marginTop: 9 },
  leftBarTrack: { flex: 1, height: 7, borderRadius: radii.pill, backgroundColor: colors.surfaceSoft, alignItems: 'flex-end', overflow: 'hidden' },
  rightBarTrack: { flex: 1, height: 7, borderRadius: radii.pill, backgroundColor: colors.surfaceSoft, overflow: 'hidden' },
  leftBar: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
  rightBar: { height: '100%', backgroundColor: colors.secondary, borderRadius: radii.pill },
  eventsCard: { backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, padding: 14 },
  eventRow: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  eventIcon: { width: 35, height: 35, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  eventText: { color: colors.text, fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', padding: 28, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 10 },
});
