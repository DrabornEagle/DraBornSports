import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../components/ScreenHeader';
import SportFilter from '../components/SportFilter';
import MatchCard from '../components/MatchCard';
import FadeInView from '../components/FadeInView';
import AnimatedPressable from '../components/AnimatedPressable';
import { dateFilters } from '../data/demoData';
import { colors, radii } from '../theme';

const statusFilters = [
  { id: 'all', label: 'Tümü' },
  { id: 'live', label: 'Canlı' },
  { id: 'upcoming', label: 'Yaklaşan' },
  { id: 'finished', label: 'Biten' },
  { id: 'favorites', label: 'Favoriler' },
];

export default function MatchesScreen({ selectedSport, onSportChange, appMatches, onMatchPress, onToggleFavorite, initialStatus = 'all', onSearch }) {
  const [selectedDate, setSelectedDate] = useState('today');
  const [status, setStatus] = useState(initialStatus);

  React.useEffect(() => setStatus(initialStatus), [initialStatus]);

  const filtered = useMemo(() => appMatches.filter((match) => {
    const sportOk = selectedSport === 'all' || match.sport === selectedSport;
    const statusOk = status === 'all' || (status === 'favorites' ? match.favorite : match.status === status);
    const dateOk = selectedDate === 'today' || (selectedDate === 'yesterday' ? match.status === 'finished' : match.status === 'upcoming');
    return sportOk && statusOk && dateOk;
  }), [appMatches, selectedSport, status, selectedDate]);

  const grouped = filtered.reduce((acc, match) => {
    if (!acc[match.competition]) acc[match.competition] = [];
    acc[match.competition].push(match);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="FİKSTÜR & SONUÇLAR" title="Maçlar" rightActions={[{ icon: 'search', onPress: onSearch }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SportFilter selected={selectedSport} onSelect={onSportChange} compact />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
          {dateFilters.map((item) => {
            const active = item.id === selectedDate;
            return (
              <AnimatedPressable key={item.id} onPress={() => setSelectedDate(item.id)} style={[styles.dateCard, active && styles.activeDateCard]}>
                <Text style={[styles.dateDay, active && styles.activeDateText]}>{item.day}</Text>
                <Text style={[styles.dateValue, active && styles.activeDateValue]}>{item.date}</Text>
                {active ? <View style={styles.dateDot} /> : null}
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusRow}>
          {statusFilters.map((item) => {
            const active = status === item.id;
            return (
              <AnimatedPressable key={item.id} onPress={() => setStatus(item.id)} style={[styles.statusChip, active && styles.activeStatusChip]}>
                {item.id === 'live' ? <View style={styles.liveDot} /> : null}
                {item.id === 'favorites' ? <Ionicons name="heart" size={13} color={active ? colors.black : colors.live} /> : null}
                <Text style={[styles.statusLabel, active && styles.activeStatusLabel]}>{item.label}</Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        <View style={styles.contentPadding}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>{selectedDate === 'today' ? '2 Ağustos 2026' : dateFilters.find((d) => d.id === selectedDate)?.date}</Text>
            <Text style={styles.summaryCount}>{filtered.length} maç</Text>
          </View>

          {Object.keys(grouped).length ? Object.entries(grouped).map(([competition, list], sectionIndex) => (
            <FadeInView key={competition} delay={sectionIndex * 80}>
              <View style={styles.competitionHeader}>
                <View style={styles.competitionIcon}><Ionicons name="trophy-outline" size={16} color={colors.accent} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.competitionName}>{competition}</Text>
                  <Text style={styles.competitionCountry}>Demo karşılaşmaları</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
              </View>
              {list.map((match) => <MatchCard key={match.id} match={match} onPress={onMatchPress} onToggleFavorite={onToggleFavorite} compact />)}
            </FadeInView>
          )) : (
            <FadeInView>
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}><Ionicons name="calendar-clear-outline" size={30} color={colors.primary} /></View>
                <Text style={styles.emptyTitle}>Eşleşen maç bulunamadı</Text>
                <Text style={styles.emptyText}>Branş, tarih veya durum filtresini değiştirerek diğer demo karşılaşmalarını görebilirsin.</Text>
              </View>
            </FadeInView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 28 },
  datesRow: { paddingHorizontal: 18, paddingTop: 17, gap: 9 },
  dateCard: { width: 68, height: 70, backgroundColor: colors.surface, borderRadius: radii.medium, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  activeDateCard: { backgroundColor: colors.primary, borderColor: colors.primary },
  dateDay: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  dateValue: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 4 },
  activeDateText: { color: colors.black },
  activeDateValue: { color: colors.black },
  dateDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.black, position: 'absolute', bottom: 6 },
  statusRow: { paddingHorizontal: 18, paddingVertical: 15, gap: 8 },
  statusChip: { height: 36, paddingHorizontal: 13, borderRadius: radii.pill, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeStatusChip: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  activeStatusLabel: { color: colors.black },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.live },
  contentPadding: { paddingHorizontal: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  summaryCount: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  competitionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 7, marginBottom: 11 },
  competitionIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: 'rgba(255,176,46,0.12)', alignItems: 'center', justifyContent: 'center' },
  competitionName: { color: colors.text, fontSize: 13, fontWeight: '900' },
  competitionCountry: { color: colors.textMuted, fontSize: 9, marginTop: 2 },
  emptyCard: { marginTop: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, padding: 27, alignItems: 'center' },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: 'rgba(50,230,161,0.12)', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 14 },
  emptyText: { color: colors.textMuted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 6 },
});
