import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import FadeInView from '../components/FadeInView';
import TeamBadge from '../components/TeamBadge';
import { leagues } from '../data/demoData';
import { colors, radii } from '../theme';

function FormDot({ value }) {
  const color = value === 'W' ? colors.success : value === 'D' ? colors.accent : colors.live;
  return <View style={[styles.formDot, { backgroundColor: `${color}22`, borderColor: `${color}66` }]}><Text style={[styles.formText, { color }]}>{value}</Text></View>;
}

export default function LeaguesScreen({ onSearch }) {
  const [sport, setSport] = useState('football');
  const available = useMemo(() => leagues.filter((league) => league.sport === sport), [sport]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('superlig');
  const selected = available.find((league) => league.id === selectedLeagueId) || available[0];

  React.useEffect(() => {
    if (!available.some((item) => item.id === selectedLeagueId)) setSelectedLeagueId(available[0]?.id);
  }, [available, selectedLeagueId]);

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="LİGLER & SIRALAMALAR" title="Puan Durumu" rightActions={[{ icon: 'search', onPress: onSearch }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.segmentWrap}>
          <AnimatedPressable onPress={() => setSport('football')} style={[styles.segment, sport === 'football' && styles.activeSegment]}>
            <Ionicons name="football" size={17} color={sport === 'football' ? colors.black : colors.textMuted} />
            <Text style={[styles.segmentText, sport === 'football' && styles.activeSegmentText]}>Futbol</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => setSport('basketball')} style={[styles.segment, sport === 'basketball' && styles.activeSegment]}>
            <Ionicons name="basketball" size={17} color={sport === 'basketball' ? colors.black : colors.textMuted} />
            <Text style={[styles.segmentText, sport === 'basketball' && styles.activeSegmentText]}>Basketbol</Text>
          </AnimatedPressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leagueChips}>
          {available.map((league) => {
            const active = selected?.id === league.id;
            return (
              <AnimatedPressable key={league.id} onPress={() => setSelectedLeagueId(league.id)} style={[styles.leagueChip, active && styles.activeLeagueChip]}>
                <View style={[styles.flagBadge, { backgroundColor: league.color }]}><Text style={styles.flagText}>{league.icon}</Text></View>
                <View>
                  <Text style={[styles.leagueChipTitle, active && styles.activeLeagueChipTitle]}>{league.name}</Text>
                  <Text style={[styles.leagueChipSub, active && styles.activeLeagueChipSub]}>{league.country}</Text>
                </View>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        {selected ? (
          <View style={styles.contentPadding}>
            <FadeInView>
              <View style={styles.heroCard}>
                <View style={[styles.heroMark, { backgroundColor: selected.color }]}><Text style={styles.heroMarkText}>{selected.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroEyebrow}>{selected.country.toUpperCase()}</Text>
                  <Text style={styles.heroTitle}>{selected.name}</Text>
                  <Text style={styles.heroSub}>2026/27 Sezonu · {selected.played}. Hafta</Text>
                </View>
                <AnimatedPressable style={styles.starButton}>
                  <Ionicons name="star" size={20} color={colors.accent} />
                </AnimatedPressable>
              </View>
            </FadeInView>

            <FadeInView delay={100}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: colors.primary }]} /><Text style={styles.legendText}>Şampiyonlar Ligi</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: colors.info }]} /><Text style={styles.legendText}>Avrupa</Text></View>
                <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: colors.live }]} /><Text style={styles.legendText}>Düşme</Text></View>
              </View>
            </FadeInView>

            <FadeInView delay={160}>
              <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headCell, styles.rankCell]}>#</Text>
                  <Text style={[styles.headCell, styles.teamCell]}>TAKIM</Text>
                  <Text style={styles.headCell}>O</Text>
                  <Text style={styles.headCell}>G</Text>
                  <Text style={styles.headCell}>M</Text>
                  <Text style={styles.headCell}>AV</Text>
                  <Text style={[styles.headCell, styles.pointsCell]}>P</Text>
                </View>
                {selected.table.map((row, index) => (
                  <View key={row.team.id} style={[styles.tableRow, index !== selected.table.length - 1 && styles.rowBorder]}>
                    <View style={styles.rankCellWrap}>
                      <View style={[styles.rankAccent, { backgroundColor: index < 2 ? colors.primary : index === selected.table.length - 1 ? colors.live : colors.info }]} />
                      <Text style={styles.rankText}>{row.rank}</Text>
                    </View>
                    <View style={styles.teamCellWrap}>
                      <TeamBadge team={row.team} size={30} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.teamName} numberOfLines={1}>{row.team.name}</Text>
                        <View style={styles.formRow}>{row.form.slice(-3).map((form, formIndex) => <FormDot key={`${form}-${formIndex}`} value={form} />)}</View>
                      </View>
                    </View>
                    <Text style={styles.bodyCell}>{row.played}</Text>
                    <Text style={styles.bodyCell}>{row.won}</Text>
                    <Text style={styles.bodyCell}>{row.lost}</Text>
                    <Text style={styles.bodyCell}>{row.gd > 0 ? `+${row.gd}` : row.gd}</Text>
                    <View style={styles.pointsCellWrap}><Text style={styles.pointsText}>{row.points}</Text></View>
                  </View>
                ))}
              </View>
            </FadeInView>

            <FadeInView delay={230}>
              <View style={styles.insightCard}>
                <View style={styles.insightIcon}><Ionicons name="analytics" size={22} color={colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightTitle}>Sezon İçgörüsü</Text>
                  <Text style={styles.insightText}>Lider ile ikinci sıra arasındaki puan farkı yalnızca {Math.abs((selected.table[0]?.points || 0) - (selected.table[1]?.points || 0))}. Yarış son haftalara kadar sürebilir.</Text>
                </View>
              </View>
            </FadeInView>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 28 },
  segmentWrap: { marginHorizontal: 18, padding: 4, backgroundColor: colors.surface, borderRadius: radii.medium, borderWidth: 1, borderColor: colors.border, flexDirection: 'row' },
  segment: { flex: 1, height: 42, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  activeSegment: { backgroundColor: colors.primary },
  segmentText: { color: colors.textMuted, fontSize: 12, fontWeight: '900' },
  activeSegmentText: { color: colors.black },
  leagueChips: { paddingHorizontal: 18, paddingVertical: 16, gap: 10 },
  leagueChip: { minWidth: 185, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderRadius: radii.medium, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  activeLeagueChip: { borderColor: colors.primary, backgroundColor: 'rgba(50,230,161,0.08)' },
  flagBadge: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  flagText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  leagueChipTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  activeLeagueChipTitle: { color: colors.primary },
  leagueChipSub: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  activeLeagueChipSub: { color: '#9EEBCF' },
  contentPadding: { paddingHorizontal: 18 },
  heroCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, padding: 16 },
  heroMark: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  heroMarkText: { color: '#fff', fontSize: 14, fontWeight: '900' },
  heroEyebrow: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  heroTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 3 },
  heroSub: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  starButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingVertical: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 3, height: 13, borderRadius: 2 },
  legendText: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
  tableCard: { backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', alignItems: 'center', height: 38, paddingHorizontal: 8, backgroundColor: colors.surfaceAlt },
  headCell: { color: colors.textMuted, fontSize: 8, fontWeight: '900', width: 29, textAlign: 'center' },
  rankCell: { width: 28 },
  teamCell: { flex: 1, textAlign: 'left' },
  pointsCell: { width: 34 },
  tableRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rankCellWrap: { width: 28, flexDirection: 'row', alignItems: 'center', gap: 6 },
  rankAccent: { width: 3, height: 25, borderRadius: 2 },
  rankText: { color: colors.text, fontSize: 12, fontWeight: '900' },
  teamCellWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 4 },
  teamName: { color: colors.text, fontSize: 10, fontWeight: '900' },
  formRow: { flexDirection: 'row', gap: 3, marginTop: 4 },
  formDot: { width: 14, height: 14, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  formText: { fontSize: 7, fontWeight: '900' },
  bodyCell: { color: colors.textMuted, fontSize: 10, fontWeight: '800', width: 29, textAlign: 'center' },
  pointsCellWrap: { width: 34, alignItems: 'center' },
  pointsText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  insightCard: { marginTop: 14, flexDirection: 'row', gap: 12, backgroundColor: 'rgba(50,230,161,0.07)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.2)', borderRadius: radii.large, padding: 15 },
  insightIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: 'rgba(50,230,161,0.12)', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  insightText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 4 },
});
