import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import AnimatedPressable from '../components/AnimatedPressable';
import FadeInView from '../components/FadeInView';
import TeamBadge from '../components/TeamBadge';
import { teams } from '../data/demoData';
import { colors, gradients, radii } from '../theme';

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({ icon, color, title, subtitle, onPress, right, delay = 0 }) {
  return (
    <FadeInView delay={delay}>
      <AnimatedPressable onPress={onPress} style={styles.settingRow}>
        <View style={[styles.settingIcon, { backgroundColor: `${color}18`, borderColor: `${color}35` }]}>
          <Ionicons name={icon} size={19} color={color} />
        </View>
        <View style={styles.settingTextWrap}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle ? <Text style={styles.settingSub}>{subtitle}</Text> : null}
        </View>
        {right || <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
      </AnimatedPressable>
    </FadeInView>
  );
}

export default function ProfileScreen({ favoriteCount, onNotifications, onGoFavorites }) {
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  return (
    <View style={styles.container}>
      <ScreenHeader eyebrow="HESABIM & TERCİHLER" title="Profil" rightActions={[{ icon: 'settings', onPress: () => {} }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentPadding}>
          <FadeInView delay={50}>
            <LinearGradient colors={gradients.cardBlue} style={styles.profileCard}>
              <View style={styles.profileTop}>
                <LinearGradient colors={gradients.primary} style={styles.avatar}><Text style={styles.avatarText}>DE</Text></LinearGradient>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>DrabornEagle</Text>
                  <Text style={styles.profileHandle}>@draborneagle · Spor Tutkunu</Text>
                  <View style={styles.levelPill}><Ionicons name="analytics" size={12} color={colors.black} /><Text style={styles.levelText}>ANALİZ SEVİYESİ 8</Text></View>
                </View>
                <AnimatedPressable style={styles.editButton}><Ionicons name="create-outline" size={19} color={colors.text} /></AnimatedPressable>
              </View>
              <View style={styles.statsRow}>
                <Stat value={favoriteCount} label="Favori" />
                <View style={styles.statDivider} />
                <Stat value="27" label="Takip" />
                <View style={styles.statDivider} />
                <Stat value="12" label="Demo Rapor" />
              </View>
              <View style={styles.progressHeader}><Text style={styles.progressLabel}>Spor Takip Seviyesi</Text><Text style={styles.progressValue}>72%</Text></View>
              <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
            </LinearGradient>
          </FadeInView>

          <FadeInView delay={110}>
            <View style={styles.responsibleCard}>
              <View style={styles.responsibleIcon}><Ionicons name="shield-checkmark" size={22} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.responsibleTitle}>Sorumlu Analiz Modu</Text>
                <Text style={styles.responsibleText}>18+ · Eğitim amaçlı demo · Kesin sonuç veya kazanç garantisi yok · Bahis işlemi ve bahis sitesi bağlantısı yok.</Text>
              </View>
            </View>
          </FadeInView>

          <FadeInView delay={140}>
            <View style={styles.favoriteHeader}>
              <View><Text style={styles.sectionTitle}>Favori Takımlar</Text><Text style={styles.sectionSub}>Bildirimlerini kişiselleştir</Text></View>
              <AnimatedPressable onPress={onGoFavorites} style={styles.manageButton}><Text style={styles.manageText}>Yönet</Text></AnimatedPressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamRow}>
              {[teams.fenerbahce, teams.city, teams.lakers, teams.vakifbank].map((team) => (
                <AnimatedPressable key={team.id} style={styles.teamCard}>
                  <TeamBadge team={team} size={45} />
                  <Text style={styles.teamCardName} numberOfLines={1}>{team.name}</Text>
                  <View style={styles.followingDot}><Ionicons name="checkmark" size={10} color={colors.black} /></View>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </FadeInView>

          <Text style={styles.groupTitle}>BİLDİRİMLER</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="football" color={colors.live} title="Gol Bildirimleri" subtitle="Favori takımlarındaki goller" delay={170} right={<Switch value={goalAlerts} onValueChange={setGoalAlerts} trackColor={{ false: colors.surfaceSoft, true: colors.primaryDark }} thumbColor={goalAlerts ? colors.primary : '#8FA0B5'} />} />
            <SettingRow icon="alarm" color={colors.info} title="Maç Hatırlatmaları" subtitle="Maçtan 30 dakika önce" delay={200} right={<Switch value={matchAlerts} onValueChange={setMatchAlerts} trackColor={{ false: colors.surfaceSoft, true: colors.primaryDark }} thumbColor={matchAlerts ? colors.primary : '#8FA0B5'} />} />
            <SettingRow icon="analytics" color={colors.purple} title="Analiz Güncellemeleri" subtitle="Demo veri kalitesi ve model değişiklikleri" delay={230} right={<Switch value={analysisAlerts} onValueChange={setAnalysisAlerts} trackColor={{ false: colors.surfaceSoft, true: colors.primaryDark }} thumbColor={analysisAlerts ? colors.primary : '#8FA0B5'} />} />
          </View>

          <Text style={styles.groupTitle}>UYGULAMA</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="notifications" color={colors.accent} title="Bildirim Merkezi" subtitle="3 okunmamış bildirim" onPress={onNotifications} delay={260} />
            <SettingRow icon="color-palette" color={colors.secondary} title="Görünüm" subtitle="Koyu spor teması" delay={290} />
            <SettingRow icon="speedometer" color={colors.primary} title="Veri Tasarrufu" subtitle="Düşük bağlantıda daha az veri kullan" delay={320} right={<Switch value={dataSaver} onValueChange={setDataSaver} trackColor={{ false: colors.surfaceSoft, true: colors.primaryDark }} thumbColor={dataSaver ? colors.primary : '#8FA0B5'} />} />
            <SettingRow icon="language" color={colors.info} title="Dil" subtitle="Türkçe" delay={350} />
          </View>

          <Text style={styles.groupTitle}>YASAL & DESTEK</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="shield-checkmark" color={colors.primary} title="Sorumlu Analiz İlkeleri" subtitle="Risk ve belirsizlik açıklamaları" delay={380} />
            <SettingRow icon="lock-closed" color={colors.info} title="Gizlilik Politikası" subtitle="v0.2 yerel demo veri kullanımı" delay={410} />
            <SettingRow icon="help-circle" color={colors.accent} title="Yardım Merkezi" subtitle="Sık sorulan sorular" delay={440} />
          </View>

          <View style={styles.versionCard}>
            <View><Text style={styles.versionBrand}>DraBornSports</Text><Text style={styles.versionText}>v0.2.0 · Expo SDK 57 · Yerel demo · versionCode 1</Text></View>
            <View style={styles.demoPill}><Text style={styles.demoText}>DEMO</Text></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 30 },
  contentPadding: { paddingHorizontal: 18 },
  profileCard: { borderRadius: radii.xl, padding: 18, borderWidth: 1, borderColor: colors.borderStrong },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 62, height: 62, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.black, fontSize: 21, fontWeight: '900' },
  profileInfo: { flex: 1 },
  profileName: { color: colors.text, fontSize: 19, fontWeight: '900' },
  profileHandle: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  levelPill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  levelText: { color: colors.black, fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  editButton: { width: 39, height: 39, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.08)' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 17, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  statDivider: { width: 1, height: 26, backgroundColor: colors.borderStrong },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  progressLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
  progressValue: { color: colors.primary, fontSize: 9, fontWeight: '900' },
  progressTrack: { height: 7, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.08)', marginTop: 7, overflow: 'hidden' },
  progressFill: { width: '72%', height: '100%', borderRadius: radii.pill, backgroundColor: colors.primary },
  responsibleCard: { marginTop: 14, flexDirection: 'row', gap: 11, backgroundColor: 'rgba(50,230,161,0.06)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.22)', borderRadius: radii.large, padding: 14 },
  responsibleIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: 'rgba(50,230,161,0.11)', alignItems: 'center', justifyContent: 'center' },
  responsibleTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  responsibleText: { color: colors.textMuted, fontSize: 9, lineHeight: 14, marginTop: 4 },
  favoriteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  sectionSub: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  manageButton: { paddingHorizontal: 12, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(50,230,161,0.1)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.24)' },
  manageText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  teamRow: { gap: 10, paddingBottom: 3 },
  teamCard: { width: 112, height: 115, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, position: 'relative', paddingHorizontal: 8 },
  teamCardName: { color: colors.text, fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  followingDot: { position: 'absolute', right: 8, top: 8, width: 18, height: 18, borderRadius: 7, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  groupTitle: { color: colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginTop: 24, marginBottom: 8 },
  settingsCard: { backgroundColor: colors.surface, borderRadius: radii.large, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  settingRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 11 },
  settingIcon: { width: 39, height: 39, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  settingTextWrap: { flex: 1 },
  settingTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  settingSub: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  versionCard: { marginTop: 20, backgroundColor: colors.surfaceAlt, borderRadius: radii.large, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: colors.border },
  versionBrand: { color: colors.text, fontSize: 13, fontWeight: '900' },
  versionText: { color: colors.textMuted, fontSize: 8, marginTop: 4 },
  demoPill: { backgroundColor: 'rgba(50,230,161,0.12)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.28)', borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  demoText: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
});
