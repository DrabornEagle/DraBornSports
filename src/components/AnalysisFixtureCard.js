import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import FadeInView from './FadeInView';
import { analyseFixture } from '../services/analysisEngine';
import { colors, radii } from '../theme';

function FormDots({ form = [] }) {
  const safeForm = Array.isArray(form) ? form : [];
  return (
    <View style={styles.formRow}>
      {safeForm.map((result, index) => {
        const color = result === 'W'
          ? colors.success
          : result === 'D' ? colors.accent : colors.live;
        return (
          <View
            key={`${result}-${index}`}
            style={[
              styles.formDot,
              { borderColor: `${color}66`, backgroundColor: `${color}22` },
            ]}
          >
            <Text style={[styles.formText, { color }]}>{result}</Text>
          </View>
        );
      })}
      {!safeForm.length ? <Text style={styles.noForm}>Form yok</Text> : null}
    </View>
  );
}

export default function AnalysisFixtureCard({
  fixture = {},
  selected,
  disabled,
  onToggle,
  index,
}) {
  const preview = useMemo(() => analyseFixture(fixture), [fixture]);
  const selection = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const safeFixture = preview.fixture;

  useEffect(() => {
    Animated.spring(selection, {
      toValue: selected ? 1 : 0,
      speed: 18,
      bounciness: 5,
      useNativeDriver: false,
    }).start();
  }, [selected, selection]);

  const indicatorWidth = selection.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const selectionOpacity = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <FadeInView delay={index * 45}>
      <AnimatedPressable
        onPress={() => onToggle?.(safeFixture.id)}
        disabled={disabled && !selected}
        style={[
          styles.card,
          selected && styles.selected,
          disabled && !selected && styles.disabled,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.selectedGlow, { opacity: selectionOpacity }]}
        />
        <Animated.View style={[styles.topIndicator, { width: indicatorWidth }]} />

        <View style={styles.top}>
          <View style={styles.date}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary} />
            <Text style={styles.dateText}>{safeFixture.day} · {safeFixture.kickoff}</Text>
          </View>
          <View style={[styles.check, selected && styles.checkSelected]}>
            {selected ? (
              <Ionicons name="checkmark" size={16} color={colors.black} />
            ) : (
              <Text style={styles.addText}>+</Text>
            )}
          </View>
        </View>

        <View style={styles.competitionRow}>
          <Text style={styles.competition}>{safeFixture.competition || 'Demo Lig'}</Text>
          <View style={styles.demoPill}><Text style={styles.demoPillText}>DEMO</Text></View>
        </View>

        <View style={styles.teams}>
          <View style={styles.team}>
            <Text style={styles.teamName}>{safeFixture.home}</Text>
            <FormDots form={safeFixture.homeStats.form} />
          </View>
          <View style={styles.vs}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <View style={[styles.team, styles.away]}>
            <Text style={[styles.teamName, styles.awayText]}>{safeFixture.away}</Text>
            <FormDots form={safeFixture.awayStats.form} />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.detail}>
            <Ionicons name="location-outline" size={14} color={colors.info} />
            <Text style={styles.detailText} numberOfLines={1}>{safeFixture.venue}</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons
              name={safeFixture.weather.condition.includes('Yağmur')
                ? 'rainy-outline'
                : 'partly-sunny-outline'}
              size={14}
              color={colors.accent}
            />
            <Text style={styles.detailText}>
              {safeFixture.weather.condition} · {safeFixture.weather.temperature}°C
            </Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="people-outline" size={14} color={colors.purple} />
            <Text style={styles.detailText}>
              Eksikler {safeFixture.homeStats.injuries}-{safeFixture.awayStats.injuries}
            </Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="hourglass-outline" size={14} color={colors.primary} />
            <Text style={styles.detailText}>
              Dinlenme {safeFixture.homeStats.restDays}-{safeFixture.awayStats.restDays} gün
            </Text>
          </View>
        </View>

        <View style={styles.preview}>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewLabel}>MODELİN ÖNE ÇIKARDIĞI SEÇİM</Text>
            <Text style={styles.market}>{preview.recommended.label}</Text>
            <View style={styles.probabilityRow}>
              <Text style={styles.probabilityText}>
                Model %{(preview.recommended.probability * 100).toFixed(1)}
              </Text>
              <View style={styles.smallDot} />
              <Text style={styles.probabilityText}>
                Veri %{preview.dataQuality}
              </Text>
            </View>
          </View>
          <View style={styles.confidence}>
            <Ionicons name="speedometer" size={14} color={colors.primary} />
            <Text style={styles.confidenceValue}>%{preview.confidence}</Text>
            <Text style={styles.confidenceLabel}>güven</Text>
          </View>
        </View>

        <View style={styles.odds}>
          <View style={styles.oddsItem}><Text style={styles.oddsKey}>1</Text><Text style={styles.oddsValue}>{safeFixture.odds.home.toFixed(2)}</Text></View>
          <View style={styles.oddsItem}><Text style={styles.oddsKey}>X</Text><Text style={styles.oddsValue}>{safeFixture.odds.draw.toFixed(2)}</Text></View>
          <View style={styles.oddsItem}><Text style={styles.oddsKey}>2</Text><Text style={styles.oddsValue}>{safeFixture.odds.away.toFixed(2)}</Text></View>
          <View style={styles.oddsItem}><Text style={styles.oddsKey}>2.5 Ü</Text><Text style={styles.oddsValue}>{safeFixture.odds.over25.toFixed(2)}</Text></View>
        </View>
      </AnimatedPressable>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.large,
    padding: 15,
    marginBottom: 11,
    overflow: 'hidden',
  },
  selected: { borderColor: colors.primary, backgroundColor: 'rgba(50,230,161,0.055)' },
  disabled: { opacity: 0.48 },
  selectedGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(50,230,161,0.07)',
    right: -45,
    top: -50,
  },
  topIndicator: {
    position: 'absolute',
    height: 3,
    left: 0,
    top: 0,
    backgroundColor: colors.primary,
  },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dateText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  check: {
    width: 29,
    height: 29,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  addText: { color: colors.textMuted, fontSize: 17, fontWeight: '700', lineHeight: 19 },
  competitionRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 6 },
  competition: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
  demoPill: {
    backgroundColor: 'rgba(255,176,46,0.10)',
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  demoPillText: { color: colors.accent, fontSize: 6, fontWeight: '900', letterSpacing: 0.8 },
  teams: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 8 },
  team: { flex: 1 },
  away: { alignItems: 'flex-end' },
  teamName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  awayText: { textAlign: 'right' },
  vs: {
    width: 36,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { color: colors.textMuted, fontSize: 9, fontWeight: '900' },
  formRow: { flexDirection: 'row', gap: 3, marginTop: 7, minHeight: 17 },
  formDot: { width: 17, height: 17, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  formText: { fontSize: 7, fontWeight: '900' },
  noForm: { color: colors.textMuted, fontSize: 7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  detail: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 9,
    height: 32,
    borderRadius: 10,
  },
  detailText: { color: colors.textMuted, fontSize: 8, fontWeight: '700', flex: 1 },
  preview: {
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between",
    alignItems: 'center',
    gap: 10,
  },
  previewLabel: { color: colors.textMuted, fontSize: 7, fontWeight: '900', letterSpacing: 0.7 },
  market: { color: colors.text, fontSize: 11, fontWeight: '900', marginTop: 4 },
  probabilityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  probabilityText: { color: colors.textMuted, fontSize: 7, fontWeight: '700' },
  smallDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textMuted },
  confidence: {
    minWidth: 61,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 13,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    gap: 1,
  },
  confidenceValue: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  confidenceLabel: { color: colors.textMuted, fontSize: 7 },
  odds: { flexDirection: 'row', gap: 7, marginTop: 12 },
  oddsItem: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oddsKey: { color: colors.textMuted, fontSize: 7, fontWeight: '800' },
  oddsValue: { color: colors.accent, fontSize: 10, fontWeight: '900', marginTop: 2 },
});
