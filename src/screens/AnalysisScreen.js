import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import AnalysisFixtureCard from '../components/AnalysisFixtureCard';
import AnalysisReport from '../components/AnalysisReport';
import { analysisDates, analysisFixtures } from '../data/analysisData';
import { buildCouponReport, pickRandomFixtures, pickStrongestFixtures } from '../services/analysisEngine';
import { colors, gradients, radii } from '../theme';

const counts = [2, 3, 4, 5];

export default function AnalysisScreen({ onSearch }) {
  const [selectedDate, setSelectedDate] = useState('all');
  const [matchCount, setMatchCount] = useState(3);
  const [selectedIds, setSelectedIds] = useState(['a1', 'a2', 'a4']);
  const [stake, setStake] = useState('100');
  const [report, setReport] = useState(null);

  const fixtures = useMemo(
    () => analysisFixtures.filter((fixture) => selectedDate === 'all' || fixture.date === selectedDate),
    [selectedDate],
  );

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => fixtures.some((fixture) => fixture.id === id)).slice(0, matchCount));
    setReport(null);
  }, [fixtures, matchCount]);

  const toggle = (fixtureId) => {
    setReport(null);
    setSelectedIds((current) => {
      if (current.includes(fixtureId)) return current.filter((id) => id !== fixtureId);
      if (current.length >= matchCount) return current;
      return [...current, fixtureId];
    });
  };

  const selectedFixtures = () => selectedIds
    .map((id) => analysisFixtures.find((fixture) => fixture.id === id))
    .filter(Boolean);

  const apply = (items) => {
    setSelectedIds(items.map((item) => item.id));
    setReport(buildCouponReport(items, stake));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="v0.2 · OLASILIK LABORATUVARI" title="Kupon Analiz" rightActions={[{ icon: 'search', onPress: onSearch }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.padding}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.heroIcon}><Ionicons name="analytics" size={27} color={colors.black} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Saatler süren veriyi saniyeler içinde özetle</Text>
              <Text style={styles.heroText}>Form, xG, geçmiş eşleşme, eksikler, dinlenme, saha, hava ve oran verilerini birlikte değerlendirir.</Text>
            </View>
          </LinearGradient>

          <View style={styles.safety}>
            <Ionicons name="shield-checkmark-outline" size={19} color={colors.primary} />
            <Text style={styles.safetyText}>18+ eğitim amaçlı simülasyon. Bahis oynatılmaz; sonuç ve kazanç garantisi verilmez.</Text>
          </View>

          <Text style={styles.sectionTitle}>1. Tarih aralığını seç</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {analysisDates.map((date) => {
            const active = selectedDate === date.id;
            return (
              <AnimatedPressable key={date.id} onPress={() => setSelectedDate(date.id)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{date.label}</Text>
              </AnimatedPressable>
            );
          })}
        </ScrollView>

        <View style={styles.padding}>
          <Text style={styles.sectionTitle}>2. Maç sayısı ve simüle tutar</Text>
          <View style={styles.setup}>
            <Text style={styles.label}>Maç sayısı</Text>
            <View style={styles.row}>
              {counts.map((count) => (
                <AnimatedPressable key={count} onPress={() => setMatchCount(count)} style={[styles.count, matchCount === count && styles.countActive]}>
                  <Text style={[styles.countText, matchCount === count && styles.countTextActive]}>{count}</Text>
                </AnimatedPressable>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 15 }]}>Teorik hesap tutarı</Text>
            <View style={styles.row}>
              <View style={styles.inputWrap}>
                <TextInput value={stake} onChangeText={(value) => setStake(value.replace(/[^0-9]/g, '').slice(0, 7))} keyboardType="number-pad" style={styles.input} />
                <Text style={styles.currency}>₺</Text>
              </View>
              {[50, 100, 250].map((value) => (
                <AnimatedPressable key={value} onPress={() => setStake(String(value))} style={styles.stakeChip}>
                  <Text style={styles.stakeText}>{value}</Text>
                </AnimatedPressable>
              ))}
            </View>

            <View style={styles.autoRow}>
              <AnimatedPressable onPress={() => apply(pickStrongestFixtures(fixtures, matchCount))} style={styles.primaryButton}>
                <Ionicons name="flash" size={17} color={colors.black} />
                <Text style={styles.primaryText}>En güçlüleri seç</Text>
              </AnimatedPressable>
              <AnimatedPressable onPress={() => apply(pickRandomFixtures(fixtures, matchCount))} style={styles.secondaryButton}>
                <Ionicons name="shuffle" size={17} color={colors.text} />
                <Text style={styles.secondaryText}>Rastgele kupon</Text>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.listHeader}>
            <View>
              <Text style={styles.sectionTitle}>3. Maçları seç</Text>
              <Text style={styles.subtitle}>{selectedIds.length}/{matchCount} seçim</Text>
            </View>
            <View style={styles.pill}><Text style={styles.pillText}>{fixtures.length} maç</Text></View>
          </View>

          {fixtures.map((fixture, index) => (
            <AnalysisFixtureCard
              key={fixture.id}
              fixture={fixture}
              index={index}
              selected={selectedIds.includes(fixture.id)}
              disabled={selectedIds.length >= matchCount}
              onToggle={toggle}
            />
          ))}

          <AnimatedPressable
            onPress={() => selectedIds.length && setReport(buildCouponReport(selectedFixtures(), stake))}
            disabled={!selectedIds.length}
            style={[styles.analyse, !selectedIds.length && { opacity: 0.4 }]}
            haptic="heavy"
          >
            <Ionicons name="sparkles" size={19} color={colors.black} />
            <Text style={styles.analyseText}>Detaylı analiz raporu oluştur</Text>
          </AnimatedPressable>

          {report ? <AnalysisReport report={report} /> : null}

          <View style={styles.footer}>
            <Ionicons name="information-circle-outline" size={17} color={colors.textMuted} />
            <Text style={styles.footerText}>DraBornSports gerçek para kabul etmez, bahis işlemi yapmaz ve üçüncü taraf bahis sitesine yönlendirme içermez.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 38 },
  padding: { paddingHorizontal: 18 },
  hero: { borderRadius: radii.large, padding: 16, flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: colors.borderStrong },
  heroIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: colors.text, fontSize: 17, fontWeight: '900', lineHeight: 22 },
  heroText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 5 },
  safety: { flexDirection: 'row', gap: 9, backgroundColor: 'rgba(50,230,161,0.07)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.20)', borderRadius: radii.medium, padding: 12, marginTop: 12 },
  safetyText: { color: colors.textMuted, fontSize: 10, lineHeight: 15, flex: 1 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 21 },
  subtitle: { color: colors.textMuted, fontSize: 9, marginTop: 4 },
  chips: { paddingHorizontal: 18, gap: 8, paddingTop: 11, paddingBottom: 2 },
  chip: { height: 38, paddingHorizontal: 13, borderRadius: radii.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  chipTextActive: { color: colors.black },
  setup: { marginTop: 11, padding: 15, backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 8, marginTop: 9 },
  count: { flex: 1, height: 40, borderRadius: 13, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  countActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  countText: { color: colors.text, fontSize: 13, fontWeight: '900' },
  countTextActive: { color: colors.black },
  inputWrap: { flex: 1.3, height: 42, borderRadius: 13, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '900', paddingVertical: 0 },
  currency: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  stakeChip: { minWidth: 48, height: 42, borderRadius: 13, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  stakeText: { color: colors.textMuted, fontSize: 10, fontWeight: '900' },
  autoRow: { flexDirection: 'row', gap: 9, marginTop: 15 },
  primaryButton: { flex: 1, height: 43, borderRadius: 13, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  primaryText: { color: colors.black, fontSize: 10, fontWeight: '900' },
  secondaryButton: { flex: 1, height: 43, borderRadius: 13, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  secondaryText: { color: colors.text, fontSize: 10, fontWeight: '900' },
  listHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 11 },
  pill: { backgroundColor: colors.surfaceAlt, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { color: colors.primary, fontSize: 9, fontWeight: '900' },
  analyse: { height: 52, borderRadius: radii.medium, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 8, marginBottom: 17 },
  analyseText: { color: colors.black, fontSize: 12, fontWeight: '900' },
  footer: { flexDirection: 'row', gap: 8, padding: 15, marginTop: 15 },
  footerText: { color: colors.textMuted, fontSize: 8, lineHeight: 13, flex: 1 },
});
