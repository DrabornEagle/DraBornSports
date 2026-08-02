import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FadeInView from './FadeInView';
import { colors, gradients, radii } from '../theme';

function Metric({ label, value, accent }) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, accent && { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function AnalysisReport({ report }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 700, useNativeDriver: false }).start();
  }, [progress, report]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.max(4, report.combinedProbability)}%`],
  });

  return (
    <FadeInView>
      <LinearGradient colors={gradients.cardBlue} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.icon}><Ionicons name="sparkles" size={24} color={colors.black} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>DraBorn Analiz Motoru</Text>
            <Text style={styles.title}>Kupon Olasılık Raporu</Text>
          </View>
          <View style={styles.risk}><Text style={styles.riskText}>{report.risk}</Text></View>
        </View>

        <View style={styles.probability}>
          <View style={styles.probabilityTop}>
            <Text style={styles.probabilityLabel}>Model kupon tutma olasılığı</Text>
            <Text style={styles.probabilityValue}>%{report.combinedProbability}</Text>
          </View>
          <View style={styles.track}><Animated.View style={[styles.fill, { width }]} /></View>
          <Text style={styles.quality}>Ortalama veri kalitesi %{report.averageQuality}</Text>
        </View>

        <View style={styles.metrics}>
          <Metric label="Toplam oran" value={report.totalOdds.toFixed(2)} accent={colors.accent} />
          <View style={styles.divider} />
          <Metric label="Simüle tutar" value={`${report.stake.toFixed(0)} ₺`} />
          <View style={styles.divider} />
          <Metric label="Teorik getiri" value={`${report.theoreticalReturn.toFixed(2)} ₺`} accent={colors.primary} />
        </View>

        <View style={styles.expected}>
          <Ionicons name="calculator-outline" size={18} color={report.expectedValue >= 0 ? colors.success : colors.live} />
          <Text style={styles.expectedText}>
            Model beklenen değer: <Text style={{ color: report.expectedValue >= 0 ? colors.success : colors.live, fontWeight: '900' }}>
              {report.expectedValue >= 0 ? '+' : ''}{report.expectedValue.toFixed(2)} ₺
            </Text>
          </Text>
        </View>

        {report.selections.map((selection, index) => (
          <View key={selection.fixture.id} style={styles.selection}>
            <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teams}>{selection.fixture.home} – {selection.fixture.away}</Text>
              <Text style={styles.market}>{selection.recommended.label}</Text>
              <Text style={styles.meta}>{selection.fixture.day} {selection.fixture.kickoff} · {selection.fixture.venue}</Text>
              <View style={styles.stats}>
                <Text style={styles.stat}>Model %{(selection.recommended.probability * 100).toFixed(1)}</Text>
                <Text style={styles.stat}>Oran {selection.recommended.odds.toFixed(2)}</Text>
                <Text style={styles.stat}>Veri %{selection.dataQuality}</Text>
              </View>
              {selection.factors.slice(0, 3).map((factor) => (
                <View key={factor.title} style={styles.factor}>
                  <View style={styles.factorDot} />
                  <Text style={styles.factorText}><Text style={styles.factorTitle}>{factor.title}: </Text>{factor.detail}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.warning}>
          <Ionicons name="warning-outline" size={20} color={colors.accent} />
          <Text style={styles.warningText}>{report.disclaimer} Oranlar demo veridir ve bahis teklifi değildir.</Text>
        </View>
      </LinearGradient>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.xl, padding: 17, borderWidth: 1, borderColor: colors.borderStrong },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 47, height: 47, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.text, fontSize: 17, fontWeight: '900', marginTop: 3 },
  risk: { backgroundColor: 'rgba(255,176,46,0.14)', borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 6 },
  riskText: { color: colors.accent, fontSize: 8, fontWeight: '900' },
  probability: { marginTop: 19 },
  probabilityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  probabilityLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  probabilityValue: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  track: { height: 9, backgroundColor: colors.surfaceSoft, borderRadius: radii.pill, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
  quality: { color: colors.textMuted, fontSize: 8, marginTop: 6, textAlign: 'right' },
  metrics: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingVertical: 13, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
  metricLabel: { color: colors.textMuted, fontSize: 7, marginTop: 4 },
  divider: { width: 1, height: 27, backgroundColor: colors.borderStrong },
  expected: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 12 },
  expectedText: { color: colors.textMuted, fontSize: 10 },
  selection: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(255,255,255,0.035)', borderRadius: radii.medium, padding: 12, marginBottom: 9 },
  number: { width: 27, height: 27, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: colors.black, fontSize: 10, fontWeight: '900' },
  teams: { color: colors.text, fontSize: 12, fontWeight: '900' },
  market: { color: colors.primary, fontSize: 10, fontWeight: '900', marginTop: 4 },
  meta: { color: colors.textMuted, fontSize: 8, marginTop: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 8 },
  stat: { color: colors.textMuted, fontSize: 7, fontWeight: '800', backgroundColor: colors.surfaceAlt, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7 },
  factor: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 6 },
  factorDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent, marginTop: 5 },
  factorText: { color: colors.textMuted, fontSize: 8, lineHeight: 13, flex: 1 },
  factorTitle: { color: colors.text, fontWeight: '900' },
  warning: { flexDirection: 'row', gap: 9, backgroundColor: 'rgba(255,176,46,0.07)', borderWidth: 1, borderColor: 'rgba(255,176,46,0.20)', borderRadius: radii.medium, padding: 12, marginTop: 4 },
  warningText: { color: colors.textMuted, fontSize: 9, lineHeight: 14, flex: 1 },
});
