import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '../components/AnimatedPressable';
import MatchCard from '../components/MatchCard';
import { leagues, news } from '../data/demoData';
import { colors, radii } from '../theme';

export default function SearchModal({ visible, onClose, appMatches, onMatchPress, onNewsPress, onToggleFavorite }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase('tr-TR');
  const matchResults = useMemo(() => normalized ? appMatches.filter((match) => `${match.home.name} ${match.away.name} ${match.competition}`.toLocaleLowerCase('tr-TR').includes(normalized)) : appMatches.slice(0, 2), [appMatches, normalized]);
  const newsResults = useMemo(() => normalized ? news.filter((item) => `${item.title} ${item.category}`.toLocaleLowerCase('tr-TR').includes(normalized)) : news.slice(0, 3), [normalized]);
  const leagueResults = useMemo(() => normalized ? leagues.filter((item) => `${item.name} ${item.country}`.toLocaleLowerCase('tr-TR').includes(normalized)) : leagues.slice(0, 2), [normalized]);

  const closeAnd = (callback) => (value) => { onClose(); callback?.(value); };

  return (
    <Modal visible={visible} animationType="fade" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AnimatedPressable onPress={onClose} style={styles.back}><Ionicons name="arrow-back" size={22} color={colors.text} /></AnimatedPressable>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={19} color={colors.textMuted} />
            <TextInput value={query} onChangeText={setQuery} autoFocus placeholder="Takım, lig, maç veya haber ara..." placeholderTextColor={colors.textMuted} style={styles.input} selectionColor={colors.primary} />
            {query ? <AnimatedPressable onPress={() => setQuery('')} style={styles.clear}><Ionicons name="close-circle" size={18} color={colors.textMuted} /></AnimatedPressable> : null}
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          {!normalized ? (
            <View style={styles.trendWrap}>
              <Text style={styles.eyebrow}>POPÜLER ARAMALAR</Text>
              <View style={styles.trends}>{['Fenerbahçe', 'NBA', 'Derbi', 'Premier League', 'F1'].map((item) => <AnimatedPressable key={item} onPress={() => setQuery(item)} style={styles.trendChip}><Ionicons name="trending-up" size={13} color={colors.primary} /><Text style={styles.trendText}>{item}</Text></AnimatedPressable>)}</View>
            </View>
          ) : null}

          <View style={styles.resultHeader}><Text style={styles.resultTitle}>Maçlar</Text><Text style={styles.resultCount}>{matchResults.length}</Text></View>
          {matchResults.map((match) => <MatchCard key={match.id} match={match} compact onPress={closeAnd(onMatchPress)} onToggleFavorite={onToggleFavorite} />)}

          <View style={styles.resultHeader}><Text style={styles.resultTitle}>Ligler</Text><Text style={styles.resultCount}>{leagueResults.length}</Text></View>
          {leagueResults.map((league) => <AnimatedPressable key={league.id} onPress={onClose} style={styles.simpleResult}><View style={[styles.leagueIcon, { backgroundColor: league.color }]}><Text style={styles.leagueIconText}>{league.icon}</Text></View><View style={{ flex: 1 }}><Text style={styles.simpleTitle}>{league.name}</Text><Text style={styles.simpleSub}>{league.country} · {league.sport === 'football' ? 'Futbol' : 'Basketbol'}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textMuted} /></AnimatedPressable>)}

          <View style={styles.resultHeader}><Text style={styles.resultTitle}>Haberler</Text><Text style={styles.resultCount}>{newsResults.length}</Text></View>
          {newsResults.map((item) => <AnimatedPressable key={item.id} onPress={() => closeAnd(onNewsPress)(item)} style={styles.simpleResult}><View style={[styles.newsIcon, { backgroundColor: item.gradient[0] }]}><Ionicons name={item.icon} size={20} color="#fff" /></View><View style={{ flex: 1 }}><Text style={styles.simpleTitle} numberOfLines={2}>{item.title}</Text><Text style={styles.simpleSub}>{item.category} · {item.time}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.textMuted} /></AnimatedPressable>)}

          {normalized && !matchResults.length && !leagueResults.length && !newsResults.length ? <View style={styles.empty}><Ionicons name="search-outline" size={36} color={colors.textMuted} /><Text style={styles.emptyTitle}>Sonuç bulunamadı</Text><Text style={styles.emptyText}>Başka bir takım, lig veya anahtar kelime deneyebilirsin.</Text></View> : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 42 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  searchBox: { flex: 1, height: 46, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13 },
  input: { flex: 1, color: colors.text, fontSize: 12, fontWeight: '700' },
  clear: { padding: 4 },
  content: { padding: 18, paddingBottom: 40 },
  trendWrap: { marginBottom: 20 },
  eyebrow: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginBottom: 10 },
  trends: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, paddingHorizontal: 11, paddingVertical: 8 },
  trendText: { color: colors.text, fontSize: 10, fontWeight: '800' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 10 },
  resultTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  resultCount: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  simpleResult: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, padding: 11, marginBottom: 9 },
  leagueIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  leagueIconText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  newsIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  simpleTitle: { color: colors.text, fontSize: 11, fontWeight: '900' },
  simpleSub: { color: colors.textMuted, fontSize: 9, marginTop: 4 },
  empty: { alignItems: 'center', padding: 30, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, marginTop: 20 },
  emptyTitle: { color: colors.text, fontSize: 15, fontWeight: '900', marginTop: 11 },
  emptyText: { color: colors.textMuted, fontSize: 10, textAlign: 'center', marginTop: 5 },
});
