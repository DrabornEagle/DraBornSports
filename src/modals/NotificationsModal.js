import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '../components/AnimatedPressable';
import FadeInView from '../components/FadeInView';
import { notifications } from '../data/demoData';
import { colors, radii } from '../theme';

export default function NotificationsModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View><Text style={styles.eyebrow}>SON GELİŞMELER</Text><Text style={styles.title}>Bildirimler</Text></View>
            <AnimatedPressable onPress={onClose} style={styles.close}><Ionicons name="close" size={22} color={colors.text} /></AnimatedPressable>
          </View>
          <View style={styles.actionRow}>
            <View style={styles.unreadPill}><View style={styles.unreadDot} /><Text style={styles.unreadText}>3 okunmamış</Text></View>
            <AnimatedPressable style={styles.markButton}><Text style={styles.markText}>Tümünü okundu yap</Text></AnimatedPressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {notifications.map((item, index) => (
              <FadeInView key={item.id} delay={index * 80}>
                <AnimatedPressable style={styles.notificationCard}>
                  <View style={[styles.iconWrap, { backgroundColor: `${item.color}18`, borderColor: `${item.color}40` }]}><Ionicons name={item.icon} size={20} color={item.color} /></View>
                  <View style={styles.textWrap}><Text style={styles.notificationTitle}>{item.title}</Text><Text style={styles.notificationText}>{item.text}</Text><Text style={styles.time}>{item.time}</Text></View>
                  <View style={styles.newDot} />
                </AnimatedPressable>
              </FadeInView>
            ))}
            <View style={styles.infoCard}><Ionicons name="information-circle-outline" size={20} color={colors.info} /><Text style={styles.infoText}>Bildirimler demo verilerle gösteriliyor. Gerçek sistem Supabase ve push bildirim entegrasyonunda aktif olacak.</Text></View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(1,5,10,0.72)' },
  sheet: { height: '75%', backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 8 },
  handle: { width: 45, height: 5, borderRadius: 3, backgroundColor: colors.surfaceSoft, alignSelf: 'center', marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingTop: 8 },
  eyebrow: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 3 },
  close: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  unreadPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
  unreadText: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  markButton: { paddingVertical: 7, paddingLeft: 10 },
  markText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  content: { paddingHorizontal: 18, paddingBottom: 30 },
  notificationCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.large, padding: 14, marginBottom: 10, position: 'relative' },
  iconWrap: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  textWrap: { flex: 1 },
  notificationTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  notificationText: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  time: { color: colors.textMuted, fontSize: 8, marginTop: 7 },
  newDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary, marginTop: 4 },
  infoCard: { flexDirection: 'row', gap: 10, backgroundColor: 'rgba(57,184,255,0.07)', borderWidth: 1, borderColor: 'rgba(57,184,255,0.2)', borderRadius: radii.large, padding: 14, marginTop: 5 },
  infoText: { color: colors.textMuted, fontSize: 10, lineHeight: 16, flex: 1 },
});
