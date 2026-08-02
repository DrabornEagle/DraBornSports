import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import AnalysisFixtureCard from '../components/AnalysisFixtureCard';
import AnalysisReport from '../components/AnalysisReport';
import {
  analysisDatasetMeta,
  analysisDates,
  analysisFixtures,
} from '../data/analysisData';
import {
  buildCouponReport,
  pickRandomFixtures,
  pickStrongestFixtures,
} from '../services/analysisEngine';
import { colors, gradients, radii } from '../theme';

const COUNTS = [2, 3, 4, 5];

function EngineMetric({ icon, value, label, color }) {
  return (
    <View style={styles.engineMetric}>
      <View style={[styles.engineMetricIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={styles.engineMetricText}>
        <Text style={styles.engineMetricValue}>{value}</Text>
        <Text style={styles.engineMetricLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function AnalysisScreenV023({ onSearch }) {
  const { width: screenWidth } = useWindowDimensions();
  const compact = screenWidth < 370;
  const scrollRef = useRef(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(0)).current;

  const [date, setDate] = useState('all');
  const [count, setCount] = useState(3);
  const [ids, setIds] = useState(['a1', 'a2', 'a4']);
  const [stake, setStake] = useState('100');
  const [report, setReport] = useState(null);

  const fixtures = useMemo(
    () => analysisFixtures.filter((item) => date === 'all' || item.date === date),
    [date],
  );

  const selected = useMemo(
    () => ids
      .map((id) => analysisFixtures.find((item) => item.id === id))
      .filter(Boolean),
    [ids],
  );

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 1300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 1300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scan, {
            toValue: 1,
            duration: 2600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scan, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse, scan]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [ctaPulse]);

  useEffect(() => {
    setIds((current) => current
      .filter((id) => fixtures.some((item) => item.id === id))
      .slice(0, count));
    setReport(null);
  }, [fixtures, count]);

  useEffect(() => {
    Animated.spring(progress, {
      toValue: count ? ids.length / count : 0,
      speed: 16,
      bounciness: 4,
      useNativeDriver: false,
    }).start();
  }, [count, ids.length, progress]);

  const toggle = (id) => {
    setReport(null);
    setIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= count) return current;
      return [...current, id];
    });
  };

  const createReport = (items = selected) => {
    if (!items.length) return;
    setReport(buildCouponReport(items, stake));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 220);
  };

  const auto = (strong) => {
    const items = strong
      ? pickStrongestFixtures(fixtures, count)
      : pickRandomFixtures(fixtures, count);
    setIds(items.map((item) => item.id));
    createReport(items);
  };

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.32, 0.04],
  });
  const scanX = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, screenWidth + 100],
  });
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const ctaScale = ctaPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, ids.length ? 1.012 : 1],
  });

  return (
    <View style={styles.container}>
      <ScreenHeader
        eyebrow="v0.2.3 · OLASILIK LABORATUVARI"
        title="Spor Analizi"
        rightActions={[{ icon: 'search', onPress: onSearch }]}
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.pad}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.heroOrb} />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.scan,
                { transform: [{ translateX: scanX }, { rotate: '16deg' }] },
              ]}
            />

            <View style={styles.heroTop}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>DEMO MOTOR AKTİF</Text>
              </View>
              <Text style={styles.version}>{analysisDatasetMeta.version}</Text>
            </View>

            <View style={styles.heroMain}>
              <View style={styles.iconArea}>
                <Animated.View
                  style={[
                    styles.ring,
                    { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
                  ]}
                />
                <LinearGradient colors={gradients.primary} style={styles.heroIcon}>
                  <Ionicons name="analytics" size={34} color={colors.black} />
                </LinearGradient>
              </View>

              <View style={styles.heroCopy}>
                <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>
                  Veriyi oku. Riski gör. Bilinçli karar ver.
                </Text>
                <Text style={styles.heroText}>
                  Form, xG, geçmiş maç, eksikler, saha, hava ve demo oranları tek raporda.
                </Text>
              </View>
            </View>

            <View style={styles.engineMetrics}>
              <EngineMetric
                icon="layers-outline"
                value={`${analysisFixtures.length}`}
                label="demo maç"
                color={colors.primary}
              />
              <EngineMetric
                icon="shield-checkmark-outline"
                value="8+"
                label="veri başlığı"
                color={colors.info}
              />
              <EngineMetric
                icon="speedometer-outline"
                value="Anlık"
                label="hesaplama"
                color={colors.accent}
              />
            </View>

            <Text style={styles.updated}>
              Son demo veri güncellemesi · {analysisDatasetMeta.updatedAt}
            </Text>
          </LinearGradient>

          <View style={styles.notice}>
            <View style={styles.noticeIcon}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            </View>
            <Text style={styles.noticeText}>
              Yerel eğitim simülasyonu. Bahis oynatılmaz; oranlar teklif veya kazanç garantisi değildir.
            </Text>
          </View>

          <Text style={styles.step}>1 · TARİHİ SEÇ</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
        >
          {analysisDates.map((item) => (
            <AnimatedPressable
              key={item.id}
              onPress={() => setDate(item.id)}
              style={[styles.date, date === item.id && styles.active]}
            >
              <Text style={[styles.dateText, date === item.id && styles.activeText]}>
                {item.label}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        <View style={styles.pad}>
          <Text style={styles.step}>2 · SENARYOYU YAPILANDIR</Text>
          <View style={styles.panel}>
            <Text style={styles.label}>MAÇ SAYISI</Text>
            <View style={styles.countRow}>
              {COUNTS.map((value) => (
                <AnimatedPressable
                  key={value}
                  onPress={() => setCount(value)}
                  style={[styles.count, count === value && styles.active]}
                >
                  <Text style={[styles.countText, count === value && styles.activeText]}>
                    {value}
                  </Text>
                  <Text style={[styles.countLabel, count === value && styles.activeCountLabel]}>
                    maç
                  </Text>
                </AnimatedPressable>
              ))}
            </View>

            <Text style={styles.label}>TEORİK HESAP TUTARI</Text>
            <View style={styles.input}>
              <View style={styles.inputIcon}>
                <Ionicons name="calculator" size={18} color={colors.primary} />
              </View>
              <TextInput
                value={stake}
                onChangeText={(value) => setStake(value.replace(/[^0-9]/g, '').slice(0, 7))}
                keyboardType="number-pad"
                style={styles.inputText}
                selectionColor={colors.primary}
              />
              <Text style={styles.currency}>₺</Text>
            </View>

            <View style={styles.actions}>
              <AnimatedPressable onPress={() => auto(true)} style={styles.actionPrimary}>
                <LinearGradient colors={gradients.primary} style={styles.actionInner}>
                  <Ionicons name="flash" size={19} color={colors.black} />
                  <View>
                    <Text style={styles.actionTitle}>En güçlüleri seç</Text>
                    <Text style={styles.actionSub}>Model sıralaması</Text>
                  </View>
                </LinearGradient>
              </AnimatedPressable>

              <AnimatedPressable onPress={() => auto(false)} style={styles.actionSecondary}>
                <Ionicons name="shuffle" size={19} color={colors.text} />
                <View>
                  <Text style={styles.randomTitle}>Rastgele</Text>
                  <Text style={styles.randomSub}>Demo kombinasyon</Text>
                </View>
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.selectionHead}>
            <View style={styles.selectionCopy}>
              <Text style={styles.step}>3 · MAÇLARINI SEÇ</Text>
              <Text style={styles.sub}>{fixtures.length} uygun demo karşılaşması</Text>
            </View>
            <View style={styles.counterPill}>
              <Text style={styles.counter}>{ids.length}/{count}</Text>
            </View>
          </View>

          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: progressWidth }]} />
          </View>
          <Text style={styles.help}>
            {ids.length < count
              ? `${count - ids.length} maç daha seçebilirsin`
              : 'Seçim tamamlandı · Rapor oluşturmaya hazır'}
          </Text>

          {fixtures.map((fixture, index) => (
            <AnalysisFixtureCard
              key={fixture.id}
              fixture={fixture}
              index={index}
              selected={ids.includes(fixture.id)}
              disabled={ids.length >= count}
              onToggle={toggle}
            />
          ))}

          <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
            <AnimatedPressable
              onPress={() => createReport()}
              disabled={!ids.length}
              style={[styles.cta, !ids.length && styles.ctaDisabled]}
              haptic="heavy"
            >
              <LinearGradient colors={gradients.primary} style={styles.ctaInner}>
                <View style={styles.ctaIcon}>
                  <Ionicons name="sparkles" size={24} color={colors.black} />
                </View>
                <View style={styles.ctaCopy}>
                  <Text style={styles.ctaTitle}>Detaylı olasılık raporu oluştur</Text>
                  <Text style={styles.ctaSub}>{ids.length} maç · teorik {stake || 0} ₺</Text>
                </View>
                <Ionicons name="arrow-forward" size={23} color={colors.black} />
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {report ? (
            <View style={styles.report}>
              <Text style={styles.step}>4 · ANALİZ RAPORUN HAZIR</Text>
              <AnalysisReport report={report} />
            </View>
          ) : null}

          <Text style={styles.footer}>
            {analysisDatasetMeta.disclaimer} Supabase ve canlı API bağlantıları testlerden sonra eklenecek.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 150 },
  pad: { paddingHorizontal: 18 },
  hero: {
    minHeight: 300,
    borderRadius: radii.xl,
    padding: 19,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  heroOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(50,230,161,0.08)',
    right: -70,
    top: -75,
  },
  scan: {
    position: 'absolute',
    width: 48,
    height: 390,
    top: -55,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(50,230,161,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(50,230,161,0.22)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  liveText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  version: { color: colors.textMuted, fontSize: 10, fontWeight: '900' },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 26,
  },
  iconArea: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 27,
    backgroundColor: colors.primary,
  },
  heroIcon: {
    width: 66,
    height: 66,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: { flex: 1 },
  heroTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  heroTitleCompact: { fontSize: 21, lineHeight: 27 },
  heroText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
  },
  engineMetrics: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  engineMetric: {
    flex: 1,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(4,14,28,0.34)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 9,
  },
  engineMetricIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineMetricText: { flex: 1 },
  engineMetricValue: { color: colors.text, fontSize: 12, fontWeight: '900' },
  engineMetricLabel: { color: colors.textMuted, fontSize: 9, marginTop: 2 },
  updated: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: 'rgba(50,230,161,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(50,230,161,0.20)',
    borderRadius: radii.large,
    padding: 14,
    marginTop: 14,
  },
  noticeIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: { color: colors.textMuted, fontSize: 11, lineHeight: 17, flex: 1 },
  step: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.4,
    marginTop: 27,
    marginBottom: 12,
  },
  dateRow: { paddingHorizontal: 18, paddingRight: 36, gap: 9 },
  date: {
    minWidth: 128,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  activeText: { color: colors.black },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  countRow: { flexDirection: 'row', gap: 9, marginBottom: 21 },
  count: {
    flex: 1,
    minWidth: 54,
    height: 66,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: colors.text, fontSize: 20, fontWeight: '900' },
  countLabel: { color: colors.textMuted, fontSize: 10, marginTop: 1 },
  activeCountLabel: { color: 'rgba(0,0,0,0.58)' },
  input: {
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(50,230,161,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: { flex: 1, color: colors.text, fontSize: 20, fontWeight: '900' },
  currency: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionPrimary: { flex: 1.08, borderRadius: 17, overflow: 'hidden' },
  actionInner: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 11,
  },
  actionTitle: { color: colors.black, fontSize: 12, fontWeight: '900' },
  actionSub: { color: 'rgba(0,0,0,0.58)', fontSize: 9, marginTop: 2 },
  actionSecondary: {
    flex: 0.92,
    minHeight: 62,
    borderRadius: 17,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 9,
  },
  randomTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  randomSub: { color: colors.textMuted, fontSize: 9, marginTop: 2 },
  selectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectionCopy: { flex: 1 },
  sub: { color: colors.textMuted, fontSize: 11, marginTop: -6, marginBottom: 10 },
  counterPill: {
    minWidth: 62,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  track: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceSoft,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary },
  help: { color: colors.textMuted, fontSize: 11, marginTop: 8, marginBottom: 14 },
  cta: { borderRadius: radii.xl, overflow: 'hidden', marginTop: 4 },
  ctaDisabled: { opacity: 0.4 },
  ctaInner: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  ctaIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCopy: { flex: 1 },
  ctaTitle: { color: colors.black, fontSize: 15, fontWeight: '900' },
  ctaSub: { color: 'rgba(0,0,0,0.62)', fontSize: 11, marginTop: 4 },
  report: { gap: 10, marginTop: 8 },
  footer: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 16,
    padding: 17,
    marginTop: 17,
  },
});
