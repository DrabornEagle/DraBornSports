import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedPressable from './AnimatedPressable';
import FadeInView from './FadeInView';
import { analyseFixture } from '../services/analysisEngine';
import { colors, gradients, radii } from '../theme';

function FormDots({ form = [], align = 'left' }) {
  const safeForm = Array.isArray(form) ? form : [];

  return (
    <View style={[styles.formRow, align === 'right' && styles.formRowRight]}>
      {safeForm.map((result, index) => {
        const color = result === 'W'
          ? colors.success
          : result === 'D'
            ? colors.accent
            : colors.live;

        return (
          <View
            key={`${result}-${index}`}
            style={[
              styles.formDot,
              { borderColor: `${color}70`, backgroundColor: `${color}18` },
            ]}
          >
            <Text style={[styles.formText, { color }]}>{result}</Text>
          </View>
        );
      })}
      {!safeForm.length ? <Text style={styles.noForm}>Form verisi yok</Text> : null}
    </View>
  );
}

function DetailChip({ icon, color, text }) {
  return (
    <View style={styles.detail}>
      <View style={[styles.detailIcon, { backgroundColor: `${color}16` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.detailText} numberOfLines={2}>{text}</Text>
    </View>
  );
}

function OddBox({ label, value }) {
  return (
    <View style={styles.oddsItem}>
      <Text style={styles.oddsKey}>{label}</Text>
      <Text style={styles.oddsValue}>{value}</Text>
    </View>
  );
}

export default function AnalysisFixtureCardV023({
  fixture = {},
  selected,
  disabled,
  onToggle,
  index = 0,
}) {
  const { width } = useWindowDimensions();
  const compact = width < 370;
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
  const glowOpacity = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const checkScale = selection.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  const weatherIcon = String(safeFixture.weather.condition || '').includes('Yağmur')
    ? 'rainy-outline'
    : 'partly-sunny-outline';

  return (
    <FadeInView delay={index * 55}>
      <AnimatedPressable
        onPress={() => onToggle?.(safeFixture.id)}
        disabled={disabled && !selected}
        style={[
          styles.card,
          selected && styles.selected,
          disabled && !selected && styles.disabled,
        ]}
        haptic="medium"
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.selectedGlow, { opacity: glowOpacity }]}
        />
        <Animated.View style={[styles.topIndicator, { width: indicatorWidth }]} />

        <View style={styles.top}>
          <View style={styles.dateWrap}>
            <View style={styles.dateIcon}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.dateText}>{safeFixture.day} · {safeFixture.kickoff}</Text>
              <Text style={styles.dateSub}>{safeFixture.date}</Text>
            </View>
          </View>

          <Animated.View
            style={[
              styles.check,
              selected && styles.checkSelected,
              { transform: [{ scale: checkScale }] },
            ]}
          >
            {selected ? (
              <Ionicons name="checkmark" size={22} color={colors.black} />
            ) : (
              <Ionicons name="add" size={22} color={colors.textMuted} />
            )}
          </Animated.View>
        </View>

        <View style={styles.competitionRow}>
          <Text style={styles.competition} numberOfLines={1}>
            {safeFixture.competition || 'Demo Lig'}
          </Text>
          <View style={styles.demoPill}>
            <Text style={styles.demoPillText}>DEMO</Text>
          </View>
        </View>

        <View style={styles.teams}>
          <View style={styles.team}>
            <Text style={[styles.teamName, compact && styles.teamNameCompact]} numberOfLines={2}>
              {safeFixture.home}
            </Text>
            <FormDots form={safeFixture.homeStats.form} />
          </View>

          <LinearGradient colors={gradients.cardBlue} style={styles.vs}>
            <Text style={styles.vsText}>VS</Text>
          </LinearGradient>

          <View style={[styles.team, styles.away]}>
            <Text
              style={[styles.teamName, styles.awayText, compact && styles.teamNameCompact]}
              numberOfLines={2}
            >
              {safeFixture.away}
            </Text>
            <FormDots form={safeFixture.awayStats.form} align="right" />
          </View>
        </View>

        <View style={styles.grid}>
          <DetailChip
            icon="location-outline"
            color={colors.info}
            text={safeFixture.venue}
          />
          <DetailChip
            icon={weatherIcon}
            color={colors.accent}
            text={`${safeFixture.weather.condition} · ${safeFixture.weather.temperature}°C`}
          />
          <DetailChip
            icon="people-outline"
            color={colors.purple}
            text={`Eksikler ${safeFixture.homeStats.injuries}-${safeFixture.awayStats.injuries}`}
          />
          <DetailChip
            icon="hourglass-outline"
            color={colors.primary}
            text={`Dinlenme ${safeFixture.homeStats.restDays}-${safeFixture.awayStats.restDays} gün`}
          />
        </View>

        <View style={styles.preview}>
          <View style={styles.previewCopy}>
            <Text style={styles.previewLabel}>MODELİN ÖNE ÇIKARDIĞI SEÇİM</Text>
            <Text style={styles.market}>{preview.recommended.label}</Text>
            <View style={styles.probabilityRow}>
              <View style={styles.probabilityPill}>
                <Text style={styles.probabilityText}>
                  Model %{(preview.recommended.probability * 100).toFixed(1)}
                </Text>
              </View>
              <View style={styles.probabilityPill}>
                <Text style={styles.probabilityText}>Veri %{preview.dataQuality}</Text>
              </View>
            </View>
          </View>

          <View style={styles.confidence}>
            <Ionicons name="speedometer" size={18} color={colors.primary} />
            <Text style={styles.confidenceValue}>%{preview.confidence}</Text>
            <Text style={styles.confidenceLabel}>güven</Text>
          </View>
        </View>

        <View style={styles.odds}>
          <OddBox label="1" value={safeFixture.odds.home.toFixed(2)} />
          <OddBox label="X" value={safeFixture.odds.draw.toFixed(2)} />
          <OddBox label="2" value={safeFixture.odds.away.toFixed(2)} />
          <OddBox label="2.5 Ü" value={safeFixture.odds.over25.toFixed(2)} />
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
    borderRadius: radii.xl,
    padding: 17,
    marginBottom: 14,
    overflow: 'hidden',
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(50,230,161,0.055)',
  },
  disabled: { opacity: 0.46 },
  selectedGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(50,230,161,0.08)',
    right: -65,
    top: -72,
  },
  topIndicator: {
    position: 'absolute',
    height: 4,
    left: 0,
    top: 0,
    backgroundColor: colors.primary,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateWrap: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dateIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  dateSub: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  check: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  competitionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 13,
  },
  competition: { color: colors.textMuted, fontSize: 11, fontWeight: '800', flexShrink: 1 },
  demoPill: {
    backgroundColor: 'rgba(255,176,46,0.10)',
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  demoPillText: { color: colors.accent, fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  team: { flex: 1, minWidth: 0 },
  away: { alignItems: 'flex-end' },
  teamName: { color: colors.text, fontSize: 18, lineHeight: 22, fontWeight: '900' },
  teamNameCompact: { fontSize: 16, lineHeight: 20 },
  awayText: { textAlign: 'right' },
  vs: {
    width: 48,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { color: colors.textMuted, fontSize: 12, fontWeight: '900' },
  formRow: { flexDirection: 'row', gap: 4, marginTop: 9, minHeight: 23, flexWrap: 'wrap' },
  formRowRight: { justifyContent: 'flex-end' },
  formDot: {
    width: 23,
    height: 23,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: { fontSize: 10, fontWeight: '900' },
  noForm: { color: colors.textMuted, fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18 },
  detail: {
    width: '48.5%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 13,
  },
  detailIcon: {
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: { color: colors.textMuted, fontSize: 10, lineHeight: 14, fontWeight: '700', flex: 1 },
  preview: {
    marginTop: 17,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  previewCopy: { flex: 1 },
  previewLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  market: { color: colors.text, fontSize: 14, lineHeight: 19, fontWeight: '900', marginTop: 6 },
  probabilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  probabilityPill: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  probabilityText: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  confidence: {
    minWidth: 78,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderRadius: 17,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    gap: 2,
  },
  confidenceValue: { color: colors.primary, fontSize: 17, fontWeight: '900' },
  confidenceLabel: { color: colors.textMuted, fontSize: 9 },
  odds: { flexDirection: 'row', gap: 8, marginTop: 15 },
  oddsItem: {
    flex: 1,
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oddsKey: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
  oddsValue: { color: colors.accent, fontSize: 13, fontWeight: '900', marginTop: 3 },
});
