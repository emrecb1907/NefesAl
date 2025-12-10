import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../styles/colors';
import { useTranslation } from '../hooks/useTranslation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.7;
// Maximum circle size should not exceed 90% of screen width or height (whichever is smaller)
const MAX_CIRCLE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.9;

interface RippleCircleProps {
  id: number;
  phaseDuration: number;
  maxScale: number;
  onComplete: (id: number) => void;
  borderColor: string;
  outerCircleScale: Animated.SharedValue<number>;
  reverse?: boolean; // true ise dışarıdan içeriye doğru
}

const RippleCircle: React.FC<RippleCircleProps> = ({
  id,
  phaseDuration,
  maxScale,
  onComplete,
  borderColor,
  outerCircleScale,
  reverse = false,
}) => {
  const scale = useSharedValue(reverse ? maxScale * 1.2 : 1);
  const opacity = useSharedValue(0.6);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (reverse) {
      // Nefes verme: en dıştaki mor çemberden içeriye doğru küçül
      // Başlangıç: mor çemberin o anki konumundan (mevcut gerçek zamanlı boyutu)
      // Exhale fazında mor çember maxScale'den başlıyor ve küçülüyor
      // Ripple çemberler mor çemberin mevcut boyutundan başlamalı
      const currentOuterScale = outerCircleScale.value;
      // Mor çemberin mevcut boyutunu kullan, ama maxScale'i kesinlikle geçmemeli
      // Güvenli bir şekilde sınırla - kocaman çember sorununu önle
      const startScale = Math.min(
        Math.max(currentOuterScale, 1), // En az 1, geçersiz değerleri önle
        maxScale // En fazla maxScale, kocaman çemberleri önle
      );
      
      // Scale değerini direkt set et - animasyon başlamadan önce
      scale.value = startScale; // Mor çemberin o anki konumundan başla
      opacity.value = 0.6;
      
      // Ana çemberden 2 kat hızlı olmalı
      // Ana çemberin mesafesi: maxScale'den 1'e kadar (mesafe = maxScale - 1)
      // Ana çemberin süresi: phaseDuration * 1000 ms
      // Ripple çemberin mesafesi: startScale'den 1'e kadar (mesafe = startScale - 1)
      // Hız = mesafe / süre
      // Ripple çember 2 kat hızlı olmalı: hız_ripple = 2 * hız_ana
      // süre_ripple = mesafe_ripple / (2 * hız_ana) = mesafe_ripple / (2 * mesafe_ana / süre_ana)
      // süre_ripple = (mesafe_ripple * süre_ana) / (2 * mesafe_ana)
      const anaMesafe = maxScale - 1;
      const rippleMesafe = startScale - 1;
      const anaSure = phaseDuration * 1000;
      // Eğer mesafe 0 ise veya çok küçükse, minimum süre kullan
      const fasterDuration = anaMesafe > 0.01 
        ? (rippleMesafe * anaSure) / (2 * anaMesafe)
        : anaSure / 2;
      
      // Animasyonu başlat - daha agresif easing ile
      scale.value = withTiming(1, {
        duration: Math.max(fasterDuration, 100), // Minimum 100ms
        easing: Easing.in(Easing.quad), // Daha agresif easing
      });
      opacity.value = withTiming(0, {
        duration: fasterDuration,
        easing: Easing.in(Easing.ease),
      });

      // Her 50ms'de bir iç çemberle çarpışmayı kontrol et
      const checkCollision = () => {
        const currentScale = scale.value;
        
        // Ripple çember iç çembere (beyaz çember) çarptı mı?
        if (currentScale <= 1.02) { // İç çembere yaklaştığında kaybol
          opacity.value = withTiming(0, { duration: 100 });
          setTimeout(() => {
            onComplete(id);
          }, 100);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      };

      checkIntervalRef.current = setInterval(checkCollision, 50);

      // Fallback: animasyon süresi dolduğunda kaldır (hızlı süreye göre)
      const timer = setTimeout(() => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        onComplete(id);
      }, fasterDuration);

      return () => {
        clearTimeout(timer);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    } else {
      // Nefes alma: iç çemberden dışarıya doğru genişle
      scale.value = withTiming(maxScale * 1.2, {
        duration: phaseDuration * 1000,
        easing: Easing.out(Easing.ease),
      });
      opacity.value = withTiming(0, {
        duration: phaseDuration * 1000,
        easing: Easing.out(Easing.ease),
      });

      // Her 50ms'de bir dış çemberle çarpışmayı kontrol et
      const checkCollision = () => {
        const currentScale = scale.value;
        const outerScale = outerCircleScale.value;
        
        // Ripple çember dış çembere (mor çember) çarptı mı?
        if (currentScale >= outerScale * 0.98) {
          opacity.value = withTiming(0, { duration: 100 });
          setTimeout(() => {
            onComplete(id);
          }, 100);
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
        }
      };

      checkIntervalRef.current = setInterval(checkCollision, 50);

      // Fallback: animasyon süresi dolduğunda kaldır
      const timer = setTimeout(() => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        onComplete(id);
      }, phaseDuration * 1000);

      return () => {
        clearTimeout(timer);
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
      };
    }
  }, [reverse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.rippleCircle,
        {
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: CIRCLE_SIZE / 2,
          borderColor: borderColor,
          borderWidth: 2,
        },
        animatedStyle,
      ]}
    />
  );
};

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale' | 'rest';
  isActive: boolean;
  phaseDuration?: number; // Duration in seconds for the current phase
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phase,
  isActive,
  phaseDuration = 4, // Default to 4 seconds if not provided
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  // Mor çember için scale animasyonu
  const outerCircleScale = useSharedValue(1);
  const outerCircleOpacity = useSharedValue(0);
  // Ripple çemberler için state
  const [ripples, setRipples] = useState<number[]>([]);
  const rippleIdCounter = useRef(0);
  const rippleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ripple çemberler - nefes alma ve verme sırasında
  useEffect(() => {
    if ((phase === 'inhale' || phase === 'exhale') && isActive) {
      // İlk çember 1 saniye sonra
      const firstRippleTimer = setTimeout(() => {
        const id = rippleIdCounter.current++;
        setRipples((prev) => [...prev, id]);
      }, 1000);

      // Sonraki çemberler her 0.8 saniyede bir
      rippleIntervalRef.current = setInterval(() => {
        const id = rippleIdCounter.current++;
        setRipples((prev) => [...prev, id]);
      }, 800);

      return () => {
        clearTimeout(firstRippleTimer);
        if (rippleIntervalRef.current) {
          clearInterval(rippleIntervalRef.current);
        }
      };
    } else {
      // Nefes alma/verme bitince ripple'ları durdur
      if (rippleIntervalRef.current) {
        clearInterval(rippleIntervalRef.current);
        rippleIntervalRef.current = null;
      }
      // Mevcut ripple'ları temizle
      setRipples([]);
    }
  }, [phase, isActive]);

  const handleRippleComplete = (id: number) => {
    setRipples((prev) => prev.filter((r) => r !== id));
  };

  useEffect(() => {
    if (!isActive || phase === 'rest') {
      outerCircleScale.value = withTiming(1, { duration: 500 });
      outerCircleOpacity.value = withTiming(0, { duration: 500 });
      return;
    }

    const durationMs = phaseDuration * 1000;
    const maxScale = MAX_CIRCLE_SIZE / CIRCLE_SIZE;

    if (phase === 'inhale') {
      // Nefes alma: mor çember beyaz çemberden dışarıya genişle
      outerCircleScale.value = 1; // Başlangıç: beyaz çember boyutu
      outerCircleOpacity.value = 1; // Görünür
      outerCircleScale.value = withTiming(maxScale, {
        duration: durationMs,
        easing: Easing.out(Easing.ease),
      });
    } else if (phase === 'hold') {
      // Hold fazında: mor çember büyüdüğü noktada kalsın
      outerCircleScale.value = maxScale; // Büyüdüğü boyutta kal
      outerCircleOpacity.value = 1; // Görünür kal
    } else if (phase === 'exhale') {
      // Nefes verme: mor çember tekrar küçülsün (ama kaybolmasın)
      outerCircleScale.value = maxScale; // Başlangıç: büyük boyut
      outerCircleOpacity.value = 1; // Görünür kal
      outerCircleScale.value = withTiming(1, {
        duration: durationMs,
        easing: Easing.in(Easing.ease),
      });
      // Opacity animasyonu kaldırıldı - çember kaybolmayacak
    } else {
      // Diğer fazlarda kaybol
      outerCircleOpacity.value = withTiming(0, { duration: 300 });
      outerCircleScale.value = withTiming(1, { duration: 300 });
    }
  }, [phase, isActive, phaseDuration]);

  const outerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerCircleScale.value }],
    opacity: outerCircleOpacity.value,
  }));

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return t('practice.inhale');
      case 'hold':
        return t('practice.hold');
      case 'exhale':
        return t('practice.exhale');
      case 'holdAfterExhale':
        return t('practice.hold');
      case 'rest':
        return t('practice.rest');
      default:
        return t('practice.ready');
    }
  };

  return (
    <View style={styles.container}>
      {/* Ripple çemberler - nefes alma ve verme sırasında */}
      {ripples.map((rippleId) => (
        <RippleCircle
          key={rippleId}
          id={rippleId}
          phaseDuration={phaseDuration}
          maxScale={MAX_CIRCLE_SIZE / CIRCLE_SIZE}
          onComplete={handleRippleComplete}
          borderColor={theme.colors.primary}
          outerCircleScale={outerCircleScale}
          reverse={phase === 'exhale'}
        />
      ))}

      {/* Mor çember - nefes alma sırasında genişler */}
      <Animated.View
        style={[
          styles.outerCircle,
          {
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
            borderWidth: 2,
          },
          outerCircleStyle,
        ]}
      />
      {/* Beyaz çember */}
      <View
        style={[
          styles.mainCircle,
          {
            backgroundColor: 'transparent',
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            shadowColor: 'transparent',
            borderWidth: 0.8,
            borderColor: '#ffffff',
          },
        ]}
      >
        <Text style={[styles.phaseText, { color: '#FFFFFF' }]}>
          {getPhaseText()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  rippleCircle: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  outerCircle: {
    position: 'absolute',
  },
  mainCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: '600',
  },
});

