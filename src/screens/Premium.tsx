import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../styles/colors';
import { useAppStore } from '../state/store';
import { PremiumFeatureCard } from '../components/PremiumFeatureCard';
import { hapticFeedback } from '../utils/haptics';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PremiumScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const setPremium = useAppStore((state) => state.setPremium);

  const handleUpgrade = () => {
    // In a real app, this would integrate with payment processing
    // For now, just set premium status
    hapticFeedback.success();
    setPremium(true);
    navigation.goBack();
  };

  const handleRestorePurchases = () => {
    // In a real app, this would restore previous purchases
    hapticFeedback.light();
    // For demo purposes, just show a message
    console.log('Restore Purchases');
  };

  const handleContinueFree = () => {
    hapticFeedback.light();
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Circular Background Element */}
        <View style={styles.circleContainer}>
          <Svg width={SCREEN_WIDTH * 0.8} height={SCREEN_WIDTH * 0.8} viewBox="0 0 300 300">
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
          <Text style={[styles.title, { color: '#1e40af' }]}>Unlock Premium</Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Access all breathing techniques, premium sounds, and themes.
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
            <Text style={styles.upgradeText}>Upgrade Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Links */}
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={handleRestorePurchases} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
              Restore Purchases
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContinueFree} activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
              Continue with Free Version
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
    marginTop: 20,
    marginBottom: -SCREEN_WIDTH * 0.3,
    opacity: 0.3,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: SCREEN_WIDTH * 0.2,
    paddingBottom: 32,
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
    marginBottom: 32,
  },
  pricingButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
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
    marginBottom: 24,
    borderRadius: 16,
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
