import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import AnalysisFixtureCard from '../components/AnalysisFixtureCard';
import AnalysisReport from '../components/AnalysisReport';
import { analysisDatasetMeta, analysisDates, analysisFixtures } from '../data/analysisData';
import { buildCouponReport, pickRandomFixtures, pickStrongestFixtures } from '../services/analysisEngine';
import { colors, gradients, radii } from '../theme';

const COUNTS = [2, 3, 4, 5];

export default function AnalysisScreen({ onSearch }) {
  const scrollRef = useRef(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const [date, setDate] = useState('all');
  const [count, setCount] = useState(3);
  const [ids, setIds] = useState(['a1', 'a2', 'a4']);
  const [stake, setStake] = useState('100');
  const [report, setReport] = useState(null);

  const fixtures = useMemo(() => analysisFixtures.filter((item) => date === 'all' || item.date === date), [date]);
  const selected = useMemo(() => ids.map((id) => analysisFixtures.find((item) => item.id === id)).filter(Boolean), [ids]);

  useEffect(() => {
    const animation = Animated.loop(Animated.parallel([
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scan, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse, scan]);

  useEffect(() => {
    setIds((current) => current.filter((id) => fixtures.some((item) => item.id === id)).slice(0, count));
    setReport(null);
  }, [fixtures, count]);

  useEffect(() => {
    Animated.spring(progress, { toValue: count ? ids.length / count : 0, speed: 16, bounciness: 4, useNativeDriver: false }).start();
  }, [count, ids.length, progress]);

  const toggle = (id) => {
    setReport(null);
    setIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length >= count ? current : [...current, id]);
  };
  const createReport = (items = selected) => {
    if (!items.length) return;
    setReport(buildCouponReport(items, stake));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 180);
  };
  const auto = (strong) => {
    const items = strong ? pickStrongestFixtures(fixtures, count) : pickRandomFixtures(fixtures, count);
    setIds(items.map((item) => item.id));
    createReport(items);
  };

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.04] });
  const scanX = scan.interpolate({ inputRange: [0, 1], outputRange: [-80, 420] });
  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="v0.2.2 · OLASILIK LABORATUVARI" title="Spor Analizi" rightActions={[{ icon: 'search', onPress: onSearch }]} />
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.pad}>
          <LinearGradient colors={gradients.hero} style={styles.hero}>
            <View style={styles.orb} />
            <Animated.View style={[styles.scan, { transform: [{ translateX: scanX }, { rotate: '16deg' }] }]} />
            <View style={styles.heroTop}><Text style={styles.live}>● DEMO MOTOR AKTİF</Text><Text style={styles.version}>{analysisDatasetMeta.version}</Text></View>
            <View style={styles.heroMain}>
              <View style={styles.iconArea}>
                <Animated.View style={[styles.ring, { opacity: pulseOpacity, transform: [{ scale: pulseScale }] }]} />
                <View style={styles.heroIcon}><Ionicons name="analytics" size={31} color={colors.black} /></View>
              </View>
              <View style={{ flex: 1 }}><Text style={styles.heroTitle}>Veriyi oku. Riski gör. Bilinçli karar ver.</Text><Text style={styles.heroText}>Form, xG, geçmiş maç, eksikler, saha, hava ve demo oranları tek raporda.</Text></View>
            </View>
            <Text style={styles.updated}>↻ Demo veri güncellemesi: {analysisDatasetMeta.updatedAt}</Text>
          </LinearGradient>

          <View style={styles.notice}><Ionicons name="shield-checkmark" size={18} color={colors.primary} /><Text style={styles.noticeText}>Yerel eğitim simülasyonu. Bahis oynatılmaz; oranlar teklif veya kazanç garantisi değildir.</Text></View>

          <Text style={styles.step}>1 · TARİHİ SEÇ</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {analysisDates.map((item) => <AnimatedPressable key={item.id} onPress={() => setDate(item.id)} style={[styles.date, date === item.id && styles.active]}><Text style={[styles.dateText, date === item.id && styles.activeText]}>{item.label}</Text></AnimatedPressable>)}
        </ScrollView>

        <View style={styles.pad}>
          <Text style={styles.step}>2 · SENARYOYU YAPILANDIR</Text>
          <View style={styles.panel}>
            <Text style={styles.label}>MAÇ SAYISI</Text>
            <View style={styles.countRow}>{COUNTS.map((value) => <AnimatedPressable key={value} onPress={() => setCount(value)} style={[styles.count, count === value && styles.active]}><Text style={[styles.countText, count === value && styles.activeText]}>{value}</Text><Text style={[styles.mini, count === value && styles.darkMini]}>maç</Text></AnimatedPressable>)}</View>
            <Text style={styles.label}>TEORİK HESAP TUTARI</Text>
            <View style={styles.input}><Ionicons name="calculator" size={16} color={colors.primary} /><TextInput value={stake} onChangeText={(value) => setStake(value.replace(/[^0-9]/g, '').slice(0, 7))} keyboardType="number-pad" style={styles.inputText} /><Text style={styles.currency}>₺</Text></View>
            <View style={styles.actions}>
              <AnimatedPressable onPress={() => auto(true)} style={styles.action}><LinearGradient colors={gradients.primary} style={styles.actionInner}><Ionicons name="flash" size={17} color={colors.black} /><Text style={styles.actionText}>En güçlüleri seç</Text></LinearGradient></AnimatedPressable>
              <AnimatedPressable onPress={() => auto(false)} style={styles.random}><Ionicons name="shuffle" size={17} color={colors.text} /><Text style={styles.randomText}>Rastgele</Text></AnimatedPressable>
            </View>
          </View>

          <View style={styles.selectionHead}><View><Text style={styles.step}>3 · MAÇLARINI SEÇ</Text><Text style={styles.sub}>{fixtures.length} uygun demo karşılaşması</Text></View><Text style={styles.counter}>{ids.length}/{count}</Text></View>
          <View style={styles.track}><Animated.View style={[styles.fill, { width: progressWidth }]} /></View>
          <Text style={styles.help}>{ids.length < count ? `${count - ids.length} maç daha seçebilirsin` : 'Seçim tamamlandı · Rapor hazır'}</Text>

          {fixtures.map((fixture, index) => <AnalysisFixtureCard key={fixture.id} fixture={fixture} index={index} selected={ids.includes(fixture.id)} disabled={ids.length >= count} onToggle={toggle} />)}

          <AnimatedPressable onPress={() => createReport()} disabled={!ids.length} style={[styles.cta, !ids.length && { opacity: 0.4 }]} haptic="heavy">
            <LinearGradient colors={gradients.primary} style={styles.ctaInner}><Ionicons name="sparkles" size={21} color={colors.black} /><View style={{ flex: 1 }}><Text style={styles.ctaTitle}>Detaylı olasılık raporu oluştur</Text><Text style={styles.ctaSub}>{ids.length} maç · teorik {stake || 0} ₺</Text></View><Ionicons name="arrow-forward" size={22} color={colors.black} /></LinearGradient>
          </AnimatedPressable>

          {report ? <View style={styles.report}><Text style={styles.step}>4 · ANALİZ RAPORUN HAZIR</Text><AnalysisReport report={report} /></View> : null}
          <Text style={styles.footer}>{analysisDatasetMeta.disclaimer} Supabase ve canlı API bağlantıları testlerden sonra eklenecek.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},scroll:{paddingBottom:38},pad:{paddingHorizontal:18},hero:{minHeight:226,borderRadius:radii.xl,padding:17,borderWidth:1,borderColor:colors.borderStrong,overflow:'hidden'},orb:{position:'absolute',width:190,height:190,borderRadius:95,backgroundColor:'rgba(50,230,161,0.08)',right:-55,top:-70},scan:{position:'absolute',width:45,height:320,top:-50,backgroundColor:'rgba(255,255,255,0.045)'},heroTop:{flexDirection:'row',justifyContent:'space-between'},live:{color:colors.primary,fontSize:7,fontWeight:'900',letterSpacing:1},version:{color:colors.textMuted,fontSize:8,fontWeight:'900'},heroMain:{flexDirection:'row',alignItems:'center',gap:14,marginTop:26},iconArea:{width:70,height:70,alignItems:'center',justifyContent:'center'},ring:{position:'absolute',width:70,height:70,borderRadius:24,backgroundColor:colors.primary},heroIcon:{width:58,height:58,borderRadius:20,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},heroTitle:{color:colors.text,fontSize:21,lineHeight:26,fontWeight:'900'},heroText:{color:colors.textMuted,fontSize:9,lineHeight:15,marginTop:7},updated:{color:colors.textMuted,fontSize:8,fontWeight:'700',marginTop:22,paddingTop:12,borderTopWidth:1,borderTopColor:colors.border},notice:{flexDirection:'row',gap:9,backgroundColor:'rgba(50,230,161,0.07)',borderWidth:1,borderColor:'rgba(50,230,161,0.20)',borderRadius:radii.medium,padding:12,marginTop:12},noticeText:{color:colors.textMuted,fontSize:9,lineHeight:14,flex:1},step:{color:colors.text,fontSize:13,fontWeight:'900',letterSpacing:.7,marginTop:22,marginBottom:10},dateRow:{paddingHorizontal:18,gap:8},date:{height:39,paddingHorizontal:13,borderRadius:radii.pill,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,justifyContent:'center'},dateText:{color:colors.textMuted,fontSize:10,fontWeight:'800'},active:{backgroundColor:colors.primary,borderColor:colors.primary},activeText:{color:colors.black},panel:{backgroundColor:colors.surface,borderRadius:radii.large,borderWidth:1,borderColor:colors.border,padding:14},label:{color:colors.textMuted,fontSize:8,fontWeight:'900',letterSpacing:1,marginBottom:9},countRow:{flexDirection:'row',gap:8,marginBottom:15},count:{flex:1,height:47,borderRadius:14,backgroundColor:colors.surfaceAlt,borderWidth:1,borderColor:colors.border,alignItems:'center',justifyContent:'center'},countText:{color:colors.text,fontSize:14,fontWeight:'900'},mini:{color:colors.textMuted,fontSize:7},darkMini:{color:'rgba(0,0,0,.6)'},input:{height:45,borderRadius:14,backgroundColor:colors.surfaceAlt,borderWidth:1,borderColor:colors.borderStrong,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:11},inputText:{flex:1,color:colors.text,fontSize:14,fontWeight:'900'},currency:{color:colors.primary,fontSize:14,fontWeight:'900'},actions:{flexDirection:'row',gap:9,marginTop:13},action:{flex:1,borderRadius:14,overflow:'hidden'},actionInner:{height:49,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},actionText:{color:colors.black,fontSize:10,fontWeight:'900'},random:{flex:1,height:49,borderRadius:14,backgroundColor:colors.surfaceAlt,borderWidth:1,borderColor:colors.borderStrong,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},randomText:{color:colors.text,fontSize:10,fontWeight:'900'},selectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sub:{color:colors.textMuted,fontSize:8,marginTop:-6,marginBottom:9},counter:{color:colors.primary,fontSize:13,fontWeight:'900',backgroundColor:colors.surfaceAlt,paddingHorizontal:10,paddingVertical:7,borderRadius:12},track:{height:7,borderRadius:radii.pill,backgroundColor:colors.surfaceSoft,overflow:'hidden'},fill:{height:'100%',backgroundColor:colors.primary},help:{color:colors.textMuted,fontSize:8,marginTop:6,marginBottom:11},cta:{borderRadius:radii.large,overflow:'hidden'},ctaInner:{minHeight:66,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:15},ctaTitle:{color:colors.black,fontSize:12,fontWeight:'900'},ctaSub:{color:'rgba(0,0,0,.6)',fontSize:8,marginTop:3},report:{gap:10,marginTop:8},footer:{color:colors.textMuted,fontSize:8,lineHeight:13,padding:15,marginTop:15},
});
