import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from './AnimatedPressable';
import FadeInView from './FadeInView';
import { analyseFixture } from '../services/analysisEngine';
import { colors, radii } from '../theme';

function FormDots({ form }) {
  return (
    <View style={styles.formRow}>
      {form.map((result, index) => {
        const color = result === 'W' ? colors.success : result === 'D' ? colors.accent : colors.live;
        return (
          <View key={`${result}-${index}`} style={[styles.formDot, { borderColor: `${color}66`, backgroundColor: `${color}22` }]}>
            <Text style={[styles.formText, { color }]}>{result}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function AnalysisFixtureCard({ fixture, selected, disabled, onToggle, index }) {
  const preview = useMemo(() => analyseFixture(fixture), [fixture]);

  return (
    <FadeInView delay={index * 45}>
      <AnimatedPressable
        onPress={() => onToggle(fixture.id)}
        disabled={disabled && !selected}
        style={[
          styles.card,
          selected && styles.selected,
          disabled && !selected && styles.disabled,
        ]}
      >
        <View style={styles.top}>
          <View style={styles.date}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary} />
            <Text style={styles.dateText}>{fixture.day} · {fixture.kickoff}</Text>
          </View>
          <View style={[styles.check, selected && styles.checkSelected]}>
            {selected ? <Ionicons name="checkmark" size={16} color={colors.black} /> : null}
          </View>
        </View>

        <Text style={styles.competition}>{fixture.competition}</Text>

        <View style={styles.teams}>
          <View style={styles.team}>
            <Text style={styles.teamName}>{fixture.home}</Text>
            <FormDots form={fixture.homeStats.form} />
          </View>
          <View style={styles.vs}><Text style={styles.vsText}>VS</Text></View>
          <View style={[styles.team, styles.away]}>
            <Text style={[styles.teamName, styles.awayText]}>{fixture.away}</Text>
            <FormDots form={fixture.awayStats.form} />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.detail}><Ionicons name="location-outline" size={14} color={colors.info} /><Text style={styles.detailText} numberOfLines={1}>{fixture.venue}</Text></View>
          <View style={styles.detail}><Ionicons name={fixture.weather.condition.includes('Yağmur') ? 'rainy-outline' : 'partly-sunny-outline'} size={14} color={colors.accent} /><Text style={styles.detailText}>{fixture.weather.condition} · {fixture.weather.temperature}°C</Text></View>
          <View style={styles.detail}><Ionicons name="people-outline" size={14} color={colors.purple} /><Text style={styles.detailText}>Eksikler {fixture.homeStats.injuries}-{fixture.awayStats.injuries}</Text></View>
          <View style={styles.detail}><Ionicons name="hourglass-outline" size={14} color={colors.primary} /><Text style={styles.detailText}>Dinlenme {fixture.homeStats.restDays}-{fixture.awayStats.restDays} gün</Text></View>
        </View>

        <View style={styles.preview}>
          <View>
            <Text style={styles.previewLabel}>Modelin güvenli seçimi</Text>
            <Text style={styles.market}>{preview.recommended.label}</Text>
          </View>
          <View style={styles.confidence}>
            <Text style={styles.confidenceValue}>%{preview.confidence}</Text>
            <Text style={styles.confidenceLabel}>güven</Text>
          </View>
        </View>

        <View style={styles.odds}>
          <Text style={styles.oddsLabel}>1 <Text style={styles.oddsValue}>{fixture.odds.home}</Text></Text>
          <Text style={styles.oddsLabel}>X <Text style={styles.oddsValue}>{fixture.odds.draw}</Text></Text>
          <Text style={styles.oddsLabel}>2 <Text style={styles.oddsValue}>{fixture.odds.away}</Text></Text>
          <Text style={styles.oddsLabel}>2.5 Ü <Text style={styles.oddsValue}>{fixture.odds.over25}</Text></Text>
        </View>
      </AnimatedPressable>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, padding: 15, marginBottom: 11 },
  selected: { borderColor: colors.primary, backgroundColor: 'rgba(50,230,161,0.055)' },
  disabled: { opacity: 0.48 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dateText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  check: { width: 27, height: 27, borderRadius: 10, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  checkSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  competition: { color: colors.textMuted, fontSize: 9, fontWeight: '700', marginTop: 6 },
  teams: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 8 },
  team: { flex: 1 },
  away: { alignItems: 'flex-end' },
  teamName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  awayText: { textAlign: 'right' },
  vs: { width: 34, height: 28, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  vsText: { color: colors.textMuted, fontSize: 9, fontWeight: '900' },
  formRow: { flexDirection: 'row', gap: 3, marginTop: 7 },
  formDot: { width: 17, height: 17, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  formText: { fontSize: 7, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  detail: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceAlt, paddingHorizontal: 9, height: 32, borderRadius: 10 },
  detailText: { color: colors.textMuted, fontSize: 8, fontWeight: '700', flex: 1 },
  preview: { marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewLabel: { color: colors.textMuted, fontSize: 8 },
  market: { color: colors.text, fontSize: 11, fontWeight: '900', marginTop: 3 },
  confidence: { minWidth: 56, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(50,230,161,0.10)', alignItems: 'center' },
  confidenceValue: { color: colors.primary, fontSize: 11, fontWeight: '900' },
  confidenceLabel: { color: colors.textMuted, fontSize: 7, marginTop: 1 },
  odds: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11 },
  oddsLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800' },
  oddsValue: { color: colors.accent, fontWeight: '900' },
});
