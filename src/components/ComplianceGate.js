import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedPressable from './AnimatedPressable';
import { colors, gradients, radii } from '../theme';

export default function ComplianceGate({ visible, onAccept }) {
  return (
    <Modal visible={visible} animationType="fade" transparent={false} statusBarTranslucent={false}>
      <LinearGradient colors={gradients.hero} style={styles.container}>
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>18+</Text>
        </View>

        <Text style={styles.eyebrow}>DraBornSports v0.2</Text>
        <Text style={styles.title}>Spor Analizi ve Olasılık Simülasyonu</Text>
        <Text style={styles.description}>
          Bu uygulama bahis oynatmaz, para yatırmaz ve bahis sitesine yönlendirme yapmaz.
          Gösterilen oran, olasılık ve teorik getiri değerleri eğitim amaçlı demo simülasyonudur.
        </Text>

        <View style={styles.rulesCard}>
          <View style={styles.rule}>
            <Ionicons name="shield-checkmark" size={19} color={colors.primary} />
            <Text style={styles.ruleText}>Hiçbir analiz kesin sonuç veya kazanç garantisi değildir.</Text>
          </View>
          <View style={styles.rule}>
            <Ionicons name="hourglass" size={19} color={colors.accent} />
            <Text style={styles.ruleText}>Geçmiş performans gelecekteki sonucu garanti etmez.</Text>
          </View>
          <View style={styles.rule}>
            <Ionicons name="wallet-outline" size={19} color={colors.info} />
            <Text style={styles.ruleText}>Kaybetmeyi göze alamayacağın tutarı riske atma.</Text>
          </View>
        </View>

        <AnimatedPressable onPress={onAccept} style={styles.acceptButton} haptic="medium">
          <Text style={styles.acceptText}>18 yaşından büyüğüm ve anladım</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.black} />
        </AnimatedPressable>

        <Text style={styles.footer}>
          Devam ederek demo analizlerin yalnızca bilgilendirme amaçlı olduğunu kabul edersin.
        </Text>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  orbOne: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: 'rgba(50,230,161,0.08)',
    right: -120,
    top: 40,
  },
  orbTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(109,123,255,0.10)',
    left: -120,
    bottom: 30,
  },
  badge: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeText: { color: colors.black, fontSize: 30, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.7 },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 33,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 7,
  },
  description: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 13,
    maxWidth: 420,
  },
  rulesCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.large,
    padding: 15,
    gap: 13,
    marginTop: 22,
  },
  rule: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  ruleText: { color: colors.text, fontSize: 11, lineHeight: 16, flex: 1, fontWeight: '700' },
  acceptButton: {
    width: '100%',
    height: 52,
    borderRadius: radii.medium,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 20,
  },
  acceptText: { color: colors.black, fontSize: 13, fontWeight: '900' },
  footer: { color: colors.textMuted, fontSize: 9, textAlign: 'center', lineHeight: 14, marginTop: 13 },
});
