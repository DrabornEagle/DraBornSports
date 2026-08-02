import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import LeaguesScreen from './screens/LeaguesScreen';
import NewsScreen from './screens/NewsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';
import ComplianceGate from './components/ComplianceGate';
import MatchDetailsModal from './modals/MatchDetailsModal';
import NewsDetailsModal from './modals/NewsDetailsModal';
import NotificationsModal from './modals/NotificationsModal';
import SearchModal from './modals/SearchModal';
import { matches as initialMatches } from './data/demoData';
import { colors, gradients } from './theme';

function Intro({ onFinish }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.55)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          speed: 14,
          bounciness: 10,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(barWidth, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(300),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onFinish);
  }, [barWidth, logoRotate, logoScale, onFinish, opacity, titleOpacity]);

  const rotate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-18deg', '0deg'],
  });
  const width = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.intro, { opacity }]}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} />
      <View style={styles.introOrbOne} />
      <View style={styles.introOrbTwo} />
      <Animated.View
        style={[
          styles.introLogo,
          { transform: [{ scale: logoScale }, { rotate }] },
        ]}
      >
        <Ionicons name="analytics" size={45} color={colors.black} />
      </Animated.View>
      <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
        <Text style={styles.introTitle}>DraBornSports</Text>
        <Text style={styles.introSub}>ANALİZ MOTORU · v0.2.3 DEMO</Text>
      </Animated.View>
      <View style={styles.introProgress}>
        <Animated.View style={[styles.introProgressFill, { width }]} />
      </View>
    </Animated.View>
  );
}

function AnimatedScreen({ screenKey, children }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateX.setValue(16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        speed: 20,
        bounciness: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenKey, opacity, translateX]);

  return (
    <Animated.View style={[styles.screen, { opacity, transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

function AppContent() {
  const [introVisible, setIntroVisible] = useState(true);
  const [ageAccepted, setAgeAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSport, setSelectedSport] = useState('all');
  const [appMatches, setAppMatches] = useState(initialMatches);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [matchesInitialStatus, setMatchesInitialStatus] = useState('all');

  const favoriteCount = useMemo(
    () => appMatches.filter((match) => match.favorite).length,
    [appMatches],
  );

  const toggleFavorite = (matchId) => {
    setAppMatches((current) => current.map((match) => (
      match.id === matchId ? { ...match, favorite: !match.favorite } : match
    )));
    setSelectedMatch((current) => (
      current?.id === matchId
        ? { ...current, favorite: !current.favorite }
        : current
    ));
  };

  const goToMatches = (status = 'all') => {
    setMatchesInitialStatus(status);
    setActiveTab('matches');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'matches':
        return (
          <MatchesScreen
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            appMatches={appMatches}
            onMatchPress={setSelectedMatch}
            onToggleFavorite={toggleFavorite}
            initialStatus={matchesInitialStatus}
            onSearch={() => setSearchVisible(true)}
          />
        );
      case 'analysis':
        return <AnalysisScreen onSearch={() => setSearchVisible(true)} />;
      case 'leagues':
        return <LeaguesScreen onSearch={() => setSearchVisible(true)} />;
      case 'news':
        return (
          <NewsScreen
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            onNewsPress={setSelectedArticle}
            onSearch={() => setSearchVisible(true)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            favoriteCount={favoriteCount}
            onNotifications={() => setNotificationsVisible(true)}
            onGoFavorites={() => goToMatches('favorites')}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
            appMatches={appMatches}
            onMatchPress={setSelectedMatch}
            onToggleFavorite={toggleFavorite}
            onSearch={() => setSearchVisible(true)}
            onNotifications={() => setNotificationsVisible(true)}
            onGoMatches={() => goToMatches('live')}
            onGoAnalysis={() => setActiveTab('analysis')}
            onGoLeagues={() => setActiveTab('leagues')}
            onGoNews={() => setActiveTab('news')}
          />
        );
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar style="light" backgroundColor={colors.background} translucent={false} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <AnimatedScreen screenKey={activeTab}>{renderScreen()}</AnimatedScreen>
        <BottomNav
          activeTab={activeTab}
          onChange={(tab) => {
            if (tab === 'matches') setMatchesInitialStatus('all');
            setActiveTab(tab);
          }}
        />
      </SafeAreaView>

      <MatchDetailsModal
        match={selectedMatch}
        visible={Boolean(selectedMatch)}
        onClose={() => setSelectedMatch(null)}
        onToggleFavorite={toggleFavorite}
      />
      <NewsDetailsModal
        article={selectedArticle}
        visible={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
      />
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        appMatches={appMatches}
        onMatchPress={setSelectedMatch}
        onNewsPress={setSelectedArticle}
        onToggleFavorite={toggleFavorite}
      />

      <ComplianceGate
        visible={!introVisible && !ageAccepted}
        onAccept={() => setAgeAccepted(true)}
      />
      {introVisible ? <Intro onFinish={() => setIntroVisible(false)} /> : null}
    </View>
  );
}

export default function AppV023() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.background },
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
  intro: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  introOrbOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(50,230,161,0.09)',
    right: -110,
    top: 70,
  },
  introOrbTwo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(109,123,255,0.11)',
    left: -120,
    bottom: 50,
  },
  introLogo: {
    width: 96,
    height: 96,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginBottom: 24,
  },
  introTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  introSub: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 7,
  },
  introProgress: {
    width: 155,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    marginTop: 26,
  },
  introProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
});
