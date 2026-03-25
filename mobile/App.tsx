import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ChartBar,
  Gear,
  ShieldCheck,
  House,
  ChatTeardropDots,
  Robot,
  Camera,
  Globe,
} from 'phosphor-react-native';
import { colors } from './src/theme/colors';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GuardrailScreen } from './src/screens/GuardrailScreen';
import { FeedbackBottomSheet } from './src/components/FeedbackBottomSheet';
import { useAppStore } from './src/store';
import { t } from './src/i18n';

type ScreenType = 'home' | 'dashboard' | 'settings' | 'guardrail';

const TABS: { key: ScreenType; icon: typeof House; labelKey: string }[] = [
  { key: 'home', icon: House, labelKey: 'nav.home' },
  { key: 'dashboard', icon: ChartBar, labelKey: 'nav.dashboard' },
  { key: 'settings', icon: Gear, labelKey: 'nav.settings' },
  { key: 'guardrail', icon: ShieldCheck, labelKey: 'nav.guardrail' },
];

function HomeScreen() {
  const { language } = useAppStore();

  return (
    <View style={styles.homeWrapper}>
      <ScrollView style={styles.homeContainer} contentContainerStyle={styles.homeContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.title', language)}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle', language)}</Text>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Robot size={32} color={colors.brand[500]} weight="duotone" />
            </View>
            <Text style={styles.cardTitle}>{t('home.feature_ai_title', language)}</Text>
            <Text style={styles.cardText}>{t('home.feature_ai_desc', language)}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Camera size={32} color={colors.brand[500]} weight="duotone" />
            </View>
            <Text style={styles.cardTitle}>{t('home.feature_vision_title', language)}</Text>
            <Text style={styles.cardText}>{t('home.feature_vision_desc', language)}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Globe size={32} color={colors.brand[500]} weight="duotone" />
            </View>
            <Text style={styles.cardTitle}>{t('home.feature_i18n_title', language)}</Text>
            <Text style={styles.cardText}>{t('home.feature_i18n_desc', language)}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>{t('home.quick_start', language)}</Text>
            <Text style={styles.infoText}>{t('home.try_it_desc', language)}</Text>

            <View style={styles.badges}>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.bug[500] }]} />
                <Text style={styles.badgeText}>{t('type.BUG', language)}</Text>
              </View>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.idea[500] }]} />
                <Text style={styles.badgeText}>{t('type.IDEA', language)}</Text>
              </View>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.help[500] }]} />
                <Text style={styles.badgeText}>{t('type.HELP', language)}</Text>
              </View>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.praise[500] }]} />
                <Text style={styles.badgeText}>{t('type.PRAISE', language)}</Text>
              </View>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.question[500] }]} />
                <Text style={styles.badgeText}>{t('type.QUESTION', language)}</Text>
              </View>
              <View style={styles.badge}>
                <View style={[styles.badgeDot, { backgroundColor: colors.other[500] }]} />
                <Text style={styles.badgeText}>{t('type.OTHER', language)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.adminSection}>
            <Text style={styles.adminTitle}>{t('home.tech_stack', language)}</Text>
            <View style={styles.techStack}>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>Expo SDK 55</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>React Native 0.79</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>React 19</Text>
              </View>
              <View style={styles.techBadge}>
                <Text style={styles.techText}>TypeScript</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

function TabBar({ activeScreen, onChange }: { activeScreen: ScreenType; onChange: (screen: ScreenType) => void }) {
  const { language } = useAppStore();

  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeScreen === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(tab.key)}
          >
            <Icon
              size={24}
              color={isActive ? colors.brand[500] : colors.gray[400]}
              weight={isActive ? 'fill' : 'regular'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {t(tab.labelKey as any, language)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const { currentScreen, setCurrentScreen, language } = useAppStore();
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const openFeedback = useCallback(() => {
    setIsSheetVisible(true);
  }, []);

  const closeFeedback = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'dashboard':
        return <DashboardScreen lang={language} />;
      case 'settings':
        return <SettingsScreen lang={language} />;
      case 'guardrail':
        return <GuardrailScreen lang={language} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.brand[500]} />

        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.mainContent}>
            {renderScreen()}
          </View>
          <TabBar activeScreen={currentScreen} onChange={setCurrentScreen} />
        </SafeAreaView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={openFeedback}>
          <ChatTeardropDots size={28} color={colors.white} weight="fill" />
        </TouchableOpacity>

        {/* Custom Bottom Sheet */}
        <FeedbackBottomSheet isVisible={isSheetVisible} onClose={closeFeedback} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  homeWrapper: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
  },
  homeContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: colors.brand[500],
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 20,
  },
  cardsContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: colors.gray[500],
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: colors.gray[800],
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  adminSection: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: colors.brand[100],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  techText: {
    fontSize: 12,
    color: colors.brand[600],
    fontWeight: '500',
  },
  spacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: colors.brand[50],
  },
  tabLabel: {
    fontSize: 11,
    color: colors.gray[400],
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.brand[500],
    fontWeight: '600',
  },
});
