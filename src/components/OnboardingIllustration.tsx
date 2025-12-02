import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Ellipse } from 'react-native-svg';

interface OnboardingIllustrationProps {
  step: number;
  width?: number;
  height?: number;
}

export const OnboardingIllustration: React.FC<OnboardingIllustrationProps> = ({
  step,
  width = 300,
  height = 300,
}) => {
  if (step === 0) {
    // Screen 1: Person meditating with leaf
    return (
      <View style={[styles.container, { width, height, backgroundColor: '#F5F1E8' }]}>
        <Svg width={width} height={height} viewBox="0 0 300 300">
          {/* Large leaf background */}
          <Path
            d="M150 50 Q100 100 80 150 Q70 200 100 250 Q130 280 150 280 Q170 280 200 250 Q230 200 220 150 Q200 100 150 50 Z"
            fill="#2D5F3F"
            opacity={0.3}
          />
          <Path
            d="M150 60 Q110 100 95 140 Q85 180 105 230 Q125 270 150 270 Q175 270 195 230 Q215 180 205 140 Q190 100 150 60 Z"
            fill="#3A7A5A"
            opacity={0.5}
          />
          
          {/* Leaf veins */}
          <Path
            d="M150 60 L150 270"
            stroke="#2D5F3F"
            strokeWidth="2"
            opacity={0.4}
          />
          <Path
            d="M150 100 Q120 120 110 150"
            stroke="#2D5F3F"
            strokeWidth="1.5"
            opacity={0.3}
            fill="none"
          />
          <Path
            d="M150 100 Q180 120 190 150"
            stroke="#2D5F3F"
            strokeWidth="1.5"
            opacity={0.3}
            fill="none"
          />
          
          {/* Person meditating */}
          <Circle cx="150" cy="180" r="35" fill="#D4A574" />
          <Path
            d="M150 215 Q130 250 120 280 L180 280 Q170 250 150 215 Z"
            fill="#1B4D3E"
          />
          <Path
            d="M130 200 Q110 220 100 240 L120 250 Q125 230 140 215 Z"
            fill="#1B4D3E"
          />
          <Path
            d="M170 200 Q190 220 200 240 L180 250 Q175 230 160 215 Z"
            fill="#1B4D3E"
          />
          <Ellipse cx="150" cy="175" rx="25" ry="20" fill="#1B4D3E" />
          <Circle cx="150" cy="180" r="8" fill="#1B4D3E" />
        </Svg>
      </View>
    );
  }

  if (step === 1) {
    // Screen 2: Person meditating with icons
    return (
      <View style={[styles.container, { width, height, backgroundColor: '#E8F4F0' }]}>
        <Svg width={width} height={height} viewBox="0 0 300 300">
          {/* Person meditating */}
          <Circle cx="150" cy="180" r="35" fill="#D4A574" />
          <Path
            d="M150 215 Q130 250 120 280 L180 280 Q170 250 150 215 Z"
            fill="#1B4D3E"
          />
          <Path
            d="M130 200 Q110 220 100 240 L120 250 Q125 230 140 215 Z"
            fill="#1B4D3E"
          />
          <Path
            d="M170 200 Q190 220 200 240 L180 250 Q175 230 160 215 Z"
            fill="#1B4D3E"
          />
          <Ellipse cx="150" cy="175" rx="25" ry="20" fill="#1B4D3E" />
          
          {/* Icons around person */}
          {/* Checkmark icon */}
          <G transform="translate(80, 80)">
            <Path
              d="M0 0 L20 0 L20 20 L0 20 Z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            />
            <Path
              d="M5 10 L9 14 L15 6"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </G>
          
          {/* People icon */}
          <G transform="translate(70, 130)">
            <Circle cx="8" cy="8" r="5" fill="none" stroke="#6B7280" strokeWidth="2" />
            <Circle cx="22" cy="8" r="5" fill="none" stroke="#6B7280" strokeWidth="2" />
            <Path
              d="M5 15 Q8 20 13 20 Q18 20 21 15"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M19 15 Q22 20 27 20 Q32 20 35 15"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
            />
          </G>
          
          {/* Heart icon */}
          <G transform="translate(70, 200)">
            <Path
              d="M12 8 C12 6 10 4 8 4 C6 4 4 6 4 8 C4 10 8 14 12 18 C16 14 20 10 20 8 C20 6 18 4 16 4 C14 4 12 6 12 8 Z"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            />
          </G>
          
          {/* Arrows icon */}
          <G transform="translate(220, 80)">
            <Path
              d="M0 10 L20 10 M15 5 L20 10 L15 15"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M20 10 L40 10 M25 5 L20 10 L25 15"
              stroke="#6B7280"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </G>
          
          {/* Circular arrow */}
          <G transform="translate(220, 140)">
            <Circle cx="15" cy="15" r="12" fill="none" stroke="#6B7280" strokeWidth="2" />
            <Path
              d="M15 3 L15 10 M15 20 L15 27 M20 15 L27 15"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>
          
          {/* Clock icon */}
          <G transform="translate(220, 200)">
            <Circle cx="15" cy="15" r="12" fill="none" stroke="#6B7280" strokeWidth="2" />
            <Path
              d="M15 15 L15 8 M15 15 L20 15"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </View>
    );
  }

  if (step === 2) {
    // Screen 3: Nature scene with meditating person
    return (
      <View style={[styles.container, { width, height }]}>
        <Svg width={width} height={height} viewBox="0 0 300 300">
          {/* Sky gradient background */}
          <Path
            d="M0 0 L300 0 L300 150 L0 150 Z"
            fill="#FFE5B4"
          />
          
          {/* Sun */}
          <Circle cx="250" cy="60" r="30" fill="#FFD700" opacity={0.8} />
          
          {/* Mountains */}
          <Path
            d="M0 150 L80 100 L160 120 L240 90 L300 110 L300 150 Z"
            fill="#D4A574"
          />
          <Path
            d="M0 150 L60 110 L140 130 L220 100 L300 120 L300 150 Z"
            fill="#C8965A"
          />
          
          {/* Water/Reflection */}
          <Path
            d="M0 150 L300 150 L300 300 L0 300 Z"
            fill="#87CEEB"
            opacity={0.6}
          />
          
          {/* Trees */}
          <Path
            d="M40 150 L40 200 L35 200 L35 150 Z"
            fill="#2D5F3F"
          />
          <Path
            d="M30 150 Q37.5 130 45 150 Q37.5 130 30 150"
            fill="#3A7A5A"
          />
          <Path
            d="M260 150 L260 200 L255 200 L255 150 Z"
            fill="#2D5F3F"
          />
          <Path
            d="M250 150 Q257.5 130 265 150 Q257.5 130 250 150"
            fill="#3A7A5A"
          />
          
          {/* Foreground foliage */}
          <Path
            d="M0 200 L100 180 L200 190 L300 200 L300 300 L0 300 Z"
            fill="#2D5F3F"
          />
          
          {/* Meditating person silhouette */}
          <Circle cx="150" cy="160" r="12" fill="#1B1B1B" />
          <Path
            d="M150 172 Q140 190 135 210 L165 210 Q160 190 150 172 Z"
            fill="#1B1B1B"
          />
          <Path
            d="M140 165 Q125 175 120 190 L145 195 Q145 180 150 170 Z"
            fill="#1B1B1B"
          />
          <Path
            d="M160 165 Q175 175 180 190 L155 195 Q155 180 150 170 Z"
            fill="#1B1B1B"
          />
        </Svg>
      </View>
    );
  }

  // Screen 4: Features list (no illustration, just the wave circle)
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 300 300">
        {/* Large circle with waves */}
        <Circle cx="150" cy="150" r="100" fill="#E5E7EB" />
        <Path
          d="M50 150 Q75 140 100 150 T150 150 T200 150 T250 150"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M50 160 Q75 150 100 160 T150 160 T200 160 T250 160"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M50 170 Q75 160 100 170 T150 170 T200 170 T250 170"
          stroke="#9CA3AF"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

