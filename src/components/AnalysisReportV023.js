import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FadeInView from './FadeInView';
import { colors, gradients, radii } from '../theme';

function Metric({ icon, label, value, accent }) {
  return (
    <View style={styles.metric}>
      <View style={[styles.metricIcon, { backgroundColor: `${accent || colors.info}16` }]}>
        <Ionicons name={icon} size={17} color={accent || colors.info} />
      </View>
      <Text style={[styles.metricValue, accent && { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function StatPill({ children }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statText}>{children}</Text>
    </View>
  );
}

export default function AnalysisReportV023({ report }) {
  const progress = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  const badgePulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    reveal.setValue(0);
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.spring(reveal, {
        toValue: 1,
        speed: 15,
        bounciness: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [progress, report, reveal]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(badgePulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(badgePulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [badgePulse]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.max(4, report.combinedProbability)}%`],
  });
  const reportScale = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });
  const badgeScale = badgePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <FadeInView>
      <Animated.View style={{ transform: [{ scale: reportScale }] }}>
        <LinearGradient colors={gradients.cardBlue} style={styles.card}>
          <View style={styles.glowOne} />
          <View style={styles.glowTwo} />

          <View style={styles.header}>
            <LinearGradient colors={gradients.primary} style={styles.icon}>
              <Ionicons name="sparkles" size={27} color={colors.black} />
            </LinearGradient>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>DRABORN ANALİZ MOTORU</Text>
              <Text style={styles.title}>Kupon Olasılık Raporu</Text>
              <Text style={styles.headerSub}>Seçimlerin veri kalitesi ve risk dengesi birlikte hesaplandı.</Text>
            </View>
            <Animated.View style={[styles.risk, { transform: [{ scale: badgeScale }] }]}>
              <Text style={styles.riskText}>{report.risk}</Text>
            </Animated.View>
          </View>

          <View style={styles.probabilityCard}>
            <View style={styles.probabilityTop}>
              <View>
                <Text style={styles.probabilityLabel}>MODEL KUPON TUTMA OLASILIĞI</Text>
                <Text style={styles.probabilityHint}>Birleşik matematiksel tahmin</Text>
              </View>
              <Text style={styles.probabilityValue}>%{report.combinedProbability}</Text>
            </View>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width }]} />
            </View>
            <View style={styles.qualityRow}>
              <Ionicons name="shield-checkmark-outline" size={15} color={colors.info} />
              <Text style={styles.quality}>Ortalama veri kalitesi %{report.averageQuality}</Text>
            </View>
          </View>

          <View style={styles.metrics}>
            <Metric
              icon="trending-up-outline"
              label="Toplam oran"
              value={report.totalOdds.toFixed(2)}
              accent={colors.accent}
            />
            <Metric
              icon="wallet-outline"
              label="Simüle tutar"
              value={`${report.stake.toFixed(0)} ₺`}
              accent={colors.text}
            />
            <Metric
              icon="cash-outline"
              label="Teorik getiri"
              value={`${report.theoreticalReturn.toFixed(2)} ₺`}
              accent={colors.primary}
            />
          </View>

          <View style={styles.expected}>
            <View style={styles.expectedIcon}>
              <Ionicons
                name="calculator-outline"
                size={20}
                color={report.expectedValue >= 0 ? colors.success : colors.live}
              />
            </View>
            <View style={styles.expectedCopy}>
              <Text style={styles.expectedLabel}>MODEL BEKLENEN DEĞERİ</Text>
              <Text
                style={[
                  styles.expectedValue,
                  { color: report.expectedValue >= 0 ? colors.success : colors.live },
                ]}
              >
                {report.expectedValue >= 0 ? '+' : ''}{report.expectedValue.toFixed(2)} ₺
              </Text>
            </View>
            <Text style={styles.expectedNote}>Garanti değildir</Text>
          </View>

          <View style={styles.selectionHeader}>
            <Text style={styles.selectionHeaderTitle}>MAÇ BAZLI RAPOR</Text>
            <Text style={styles.selectionHeaderCount}>{report.selections.length} seçim</Text>
          </View>

          {report.selections.map((selection, index) => (
            <View key={selection.fixture.id} style={styles.selection}>
              <View style={styles.selectionTop}>
                <View style={styles.number}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <View style={styles.selectionTitleWrap}>
                  <Text style={styles.teams}>
                    {selection.fixture.home} – {selection.fixture.away}
                  </Text>
                  <Text style={styles.meta}>
                    {selection.fixture.day} {selection.fixture.kickoff} · {selection.fixture.venue}
                  </Text>
                </View>
              </View>

              <View style={styles.marketCard}>
                <View style={styles.marketIcon}>
                  <Ionicons name="analytics-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.marketCopy}>
                  <Text style={styles.marketLabel}>ÖNE ÇIKAN SEÇİM</Text>
                  <Text style={styles.market}>{selection.recommended.label}</Text>
                </View>
              </View>

              <View style={styles.stats}>
                <StatPill>Model %{(selection.recommended.probability * 100).toFixed(1)}</StatPill>
                <StatPill>Oran {selection.recommended.odds.toFixed(2)}</StatPill>
                <StatPill>Veri %{selection.dataQuality}</StatPill>
              </View>

              <View style={styles.factorList}>
                {selection.factors.slice(0, 3).map((factor) => (
                  <View key={factor.title} style={styles.factor}>
                    <View style={styles.factorDot} />
                    <Text style={styles.factorText}>
                      <Text style={styles.factorTitle}>{factor.title}: </Text>
                      {factor.detail}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.warning}>
            <View style={styles.warningIcon}>
              <Ionicons name="warning-outline" size={21} color={colors.accent} />
            </View>
            <Text style={styles.warningText}>
              {report.disclaimer} Oranlar demo veridir ve bahis teklifi değildir.
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  glowOne: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(50,230,161,0.07)',
    right: -95,
    top: -80,
  },
  glowTwo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(109,123,255,0.08)',
    left: -85,
    bottom: 120,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: colors.text, fontSize: 20, lineHeight: 25, fontWeight: '900', marginTop: 4 },
  headerSub: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  risk: {
    backgroundColor: 'rgba(255,176,46,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,46,0.24)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  riskText: { color: colors.accent, fontSize: 10, fontWeight: '900' },
  probabilityCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(4,14,28,0.28)',
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.border,
  },
  probabilityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  probabilityLabel: { color: colors.text, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  probabilityHint: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  probabilityValue: { color: colors.primary, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  track: {
    height: 12,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginTop: 13,
  },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
  qualityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 9 },
  quality: { color: colors.textMuted, fontSize: 10 },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 14 },
  metric: {
    flex: 1,
    minHeight: 104,
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricValue: { color: colors.text, fontSize: 16, fontWeight: '900', textAlign: 'center' },
  metricLabel: { color: colors.textMuted, fontSize: 9, marginTop: 5, textAlign: 'center' },
  expected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
    marginTop: 13,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expectedIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expectedCopy: { flex: 1 },
  expectedLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  expectedValue: { fontSize: 16, fontWeight: '900', marginTop: 3 },
  expectedNote: { color: colors.textMuted, fontSize: 9 },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    marginBottom: 10,
  },
  selectionHeaderTitle: { color: colors.text, fontSize: 13, fontWeight: '900', letterSpacing: 0.8 },
  selectionHeaderCount: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  selection: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 12,
  },
  selectionTop: { flexDirection: 'row', gap: 11, alignItems: 'center' },
  number: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { color: colors.black, fontSize: 14, fontWeight: '900' },
  selectionTitleWrap: { flex: 1 },
  teams: { color: colors.text, fontSize: 15, lineHeight: 20, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  marketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(50,230,161,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(50,230,161,0.18)',
    borderRadius: 14,
    padding: 11,
    marginTop: 13,
  },
  marketIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketCopy: { flex: 1 },
  marketLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  market: { color: colors.primary, fontSize: 13, lineHeight: 18, fontWeight: '900', marginTop: 3 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 11 },
  statPill: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  statText: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  factorList: { marginTop: 10, gap: 8 },
  factor: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  factorDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginTop: 5 },
  factorText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, flex: 1 },
  factorTitle: { color: colors.text, fontWeight: '900' },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255,176,46,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,46,0.20)',
    borderRadius: radii.large,
    padding: 14,
    marginTop: 4,
  },
  warningIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(255,176,46,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, flex: 1 },
});
