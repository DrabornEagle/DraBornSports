import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import LivePill from './LivePill';
import TeamBadge from './TeamBadge';
import { colors, radii } from '../theme';

export default function MatchCard({ match, onPress, onToggleFavorite, compact = false }) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const score = match.homeScore == null ? match.startTime : `${match.homeScore}  -  ${match.awayScore}`;

  return (
    <AnimatedPressable onPress={() => onPress?.(match)} style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.topRow}>
        <View style={styles.competitionWrap}>
          <Text style={styles.competition}>{match.competition}</Text>
          <Text style={styles.venue} numberOfLines={1}>{match.venue}</Text>
        </View>
        <AnimatedPressable onPress={() => onToggleFavorite?.(match.id)} style={styles.heart} haptic="light">
          <Ionicons name={match.favorite ? 'heart' : 'heart-outline'} size={20} color={match.favorite ? colors.live : colors.textMuted} />
        </AnimatedPressable>
      </View>

      <View style={styles.matchRow}>
        <View style={styles.teamColumn}>
          <TeamBadge team={match.home} size={compact ? 38 : 46} />
          <Text style={styles.teamName} numberOfLines={1}>{match.home.name}</Text>
        </View>

        <View style={styles.centerColumn}>
          {isLive ? <LivePill compact /> : <Text style={styles.statusText}>{isFinished ? 'MAÇ SONU' : 'BUGÜN'}</Text>}
          <Text style={[styles.score, !isLive && !isFinished && styles.timeScore]}>{score}</Text>
          <Text style={[styles.minute, isLive && styles.liveMinute]}>{isLive ? match.minute : isFinished ? 'MS' : 'Başlama'}</Text>
        </View>

        <View style={styles.teamColumn}>
          <TeamBadge team={match.away} size={compact ? 38 : 46} />
          <Text style={styles.teamName} numberOfLines={1}>{match.away.name}</Text>
        </View>
      </View>

      {match.setScores ? <Text style={styles.setScores}>{match.setScores}</Text> : null}

      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <Ionicons name="stats-chart" size={14} color={colors.info} />
          <Text style={styles.metaText}>{isLive ? 'Anlık istatistikler' : isFinished ? 'Maç özeti' : 'Maç merkezi'}</Text>
        </View>
        {match.viewers ? (
          <View style={styles.metaItem}>
            <Ionicons name="eye-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{match.viewers}</Text>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={17} color={colors.textMuted} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.large, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  compactCard: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  competitionWrap: { flex: 1, paddingRight: 8 },
  competition: { color: colors.text, fontSize: 12, fontWeight: '900' },
  venue: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  heart: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  matchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamColumn: { flex: 1, alignItems: 'center', gap: 8, minWidth: 0 },
  teamName: { color: colors.text, fontSize: 12, fontWeight: '800', maxWidth: 110, textAlign: 'center' },
  centerColumn: { width: 105, alignItems: 'center', gap: 5 },
  statusText: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  score: { color: colors.text, fontSize: 25, fontWeight: '900', letterSpacing: -0.8 },
  timeScore: { fontSize: 20, color: colors.primary },
  minute: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  liveMinute: { color: '#FF8A9A' },
  setScores: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: 10 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
});
