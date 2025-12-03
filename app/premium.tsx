import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/styles/colors';
import { useAppStore } from '../src/state/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PremiumFeatureCard } from '../src/components';
import { hapticFeedback } from '../src/utils/haptics';
import { useTranslation } from '../src/hooks/useTranslation';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PremiumScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const setPremium = useAppStore((state) => state.setPremium);

  const handleUpgrade = () => {
    // In a real app, this would integrate with payment processing
    // For now, just set premium status
    hapticFeedback.success();
    setPremium(true);
    router.back();
  };

  const handleRestorePurchases = () => {
    // In a real app, this would restore previous purchases
    hapticFeedback.light();
    // For demo purposes, just show a message
    console.log('Restore Purchases');
  };

  const handleContinueFree = () => {
    hapticFeedback.light();
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Circular Background Element */}
        <View style={styles.circleContainer}>
          <Svg width={SCREEN_WIDTH * 0.5} height={SCREEN_WIDTH * 0.5} viewBox="0 0 300 300">
            <Circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              opacity={0.2}
            />
          </Svg>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#1e40af' }]}>{t('premium.title')}</Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {t('premium.subtitle')}
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <PremiumFeatureCard
            icon="techniques"
            title="All Breathing Techniques"
            description="Unlock 6 complete rhythms"
          />
          <PremiumFeatureCard
            icon="sounds"
            title="Premium Ambiance Sounds"
            description="Forest, Rain, Ocean & more"
          />
          <PremiumFeatureCard
            icon="stats"
            title="Advanced Stats"
            description="Detailed progress insights"
          />
          <PremiumFeatureCard
            icon="themes"
            title="Premium Themes"
            description="Relaxing blue, forest night"
          />
        </View>

        {/* Premium Access Pricing Button */}
        <TouchableOpacity
          style={styles.pricingButton}
          onPress={handleUpgrade}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#818cf8', '#bfdbfe']}
            style={styles.pricingGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.pricingContent}>
              <View style={styles.pricingLeft}>
                <Text style={styles.pricingTitle}>Premium Access</Text>
                <Text style={styles.pricingSubtitle}>One-time purchase</Text>
              </View>
              <View style={styles.pricingRight}>
                <Text style={styles.pricingPrice}>$12.99</Text>
                <Text style={styles.pricingLifetime}>Lifetime</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Upgrade Now Button */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6366f1', '#818cf8']}
            style={styles.upgradeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.upgradeText}>{t('common.upgrade')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Links */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={handleRestorePurchases} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
              {t('premium.restore')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContinueFree} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
              {t('common.continue')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: -SCREEN_WIDTH * 0.15,
    opacity: 0.3,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: SCREEN_WIDTH * 0.1,
    paddingBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  pricingButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 28,
    overflow: 'hidden',
  },
  pricingGradient: {
    padding: 20,
  },
  pricingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLeft: {
    flex: 1,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  pricingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pricingRight: {
    alignItems: 'flex-end',
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  pricingLifetime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  upgradeButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 28,
    overflow: 'hidden',
  },
  upgradeGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  bottomLinks: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  linkText: {
    fontSize: 14,
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
});

