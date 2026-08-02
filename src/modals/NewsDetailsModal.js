import React, { useEffect, useRef } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedPressable from '../components/AnimatedPressable';
import { colors, radii } from '../theme';

export default function NewsDetailsModal({ article, visible, onClose }) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(50);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 4 }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, translateY, opacity]);

  if (!article) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.sheet, { opacity, transform: [{ translateY }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <LinearGradient colors={article.gradient} style={styles.hero}>
              <View style={styles.topRow}>
                <AnimatedPressable onPress={onClose} style={styles.iconButton}><Ionicons name="close" size={23} color="#fff" /></AnimatedPressable>
                <View style={styles.actions}>
                  <AnimatedPressable style={styles.iconButton}><Ionicons name="bookmark-outline" size={20} color="#fff" /></AnimatedPressable>
                  <AnimatedPressable style={styles.iconButton}><Ionicons name="share-social-outline" size={20} color="#fff" /></AnimatedPressable>
                </View>
              </View>
              <Ionicons name={article.icon} size={82} color="rgba(255,255,255,0.22)" />
              <View>
                <View style={styles.category}><Text style={styles.categoryText}>{article.category}</Text></View>
                <Text style={styles.title}>{article.title}</Text>
                <View style={styles.metaRow}><Text style={styles.metaText}>{article.time}</Text><View style={styles.dot} /><Text style={styles.metaText}>{article.readTime} okuma</Text></View>
              </View>
            </LinearGradient>

            <View style={styles.content}>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatar}><Text style={styles.authorInitial}>DS</Text></View>
                <View style={{ flex: 1 }}><Text style={styles.authorName}>DraBornSports Editör</Text><Text style={styles.authorSub}>Demo haber merkezi</Text></View>
                <View style={styles.verified}><Ionicons name="checkmark" size={12} color={colors.black} /></View>
              </View>

              <Text style={styles.lead}>{article.summary}</Text>
              <Text style={styles.paragraph}>Karşılaşmanın ilk bölümünde iki taraf da kontrollü bir oyun tercih ederken, ilerleyen dakikalarda tempo belirgin biçimde yükseldi. Teknik ekiplerin hamleleri, oyunun merkezindeki dengeyi sürekli değiştirdi.</Text>
              <Text style={styles.paragraph}>Özellikle kritik anlarda verilen kararlar ve bireysel performanslar sonucu doğrudan etkiledi. Tribün atmosferi de sahadaki enerjiyi yukarı taşıdı ve mücadeleyi son ana kadar canlı tuttu.</Text>

              <View style={styles.quoteCard}>
                <Ionicons name="chatbox-ellipses" size={22} color={colors.primary} />
                <Text style={styles.quote}>“Bu içerik v0.1 demo deneyimi için hazırlanmıştır. Gerçek haber verisi Supabase ve lisanslı sağlayıcı entegrasyonunda bağlanacaktır.”</Text>
              </View>

              <Text style={styles.subheading}>Maçın öne çıkan noktaları</Text>
              {['Yüksek tempo ve geçiş hücumları', 'Kritik anlarda etkili oyuncu değişiklikleri', 'Son bölümde artan baskı ve pozisyon sayısı'].map((item, index) => (
                <View key={item} style={styles.bulletRow}><View style={styles.bullet}><Text style={styles.bulletText}>{index + 1}</Text></View><Text style={styles.bulletContent}>{item}</Text></View>
              ))}

              <View style={styles.tagsRow}>
                {['DraBornSports', article.category, 'Demo Haber'].map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>#{tag.replace(/\s/g, '')}</Text></View>)}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(1,5,10,0.78)' },
  sheet: { height: '94%', backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  scrollContent: { paddingBottom: 36 },
  hero: { minHeight: 390, padding: 18, paddingTop: 14, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: 8 },
  iconButton: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.26)' },
  category: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.32)', borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10 },
  categoryText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#fff', fontSize: 27, lineHeight: 33, fontWeight: '900', letterSpacing: -0.7 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12 },
  metaText: { color: 'rgba(255,255,255,0.72)', fontSize: 10, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  content: { padding: 18 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: colors.border },
  authorAvatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  authorInitial: { color: colors.black, fontSize: 13, fontWeight: '900' },
  authorName: { color: colors.text, fontSize: 12, fontWeight: '900' },
  authorSub: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  verified: { width: 22, height: 22, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  lead: { color: colors.text, fontSize: 16, lineHeight: 24, fontWeight: '800', marginTop: 20 },
  paragraph: { color: colors.textMuted, fontSize: 13, lineHeight: 22, marginTop: 16 },
  quoteCard: { flexDirection: 'row', gap: 12, backgroundColor: 'rgba(50,230,161,0.07)', borderWidth: 1, borderColor: 'rgba(50,230,161,0.2)', borderRadius: radii.large, padding: 16, marginTop: 20 },
  quote: { color: colors.text, fontSize: 12, lineHeight: 19, fontWeight: '700', flex: 1 },
  subheading: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: 24, marginBottom: 12 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 10 },
  bullet: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  bulletText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  bulletContent: { color: colors.textMuted, fontSize: 12, flex: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  tag: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 7 },
  tagText: { color: colors.textMuted, fontSize: 9, fontWeight: '800' },
});
