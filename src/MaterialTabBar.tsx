import React from 'react'
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native'

import { IS_IOS } from './helpers'
import { ControlProps } from './types'

export type Props = ControlProps & {
  containerStyle?: ViewStyle
  tabStyle?: ViewStyle
  indicatorStyle?: ViewStyle
  pressColor?: string
  pressOpacity?: number
  labelStyle?: ViewStyle
  inactiveOpacity?: number
}

/**
 * Default android control.
 *
 * Example usage:
 *
 * ```tsx
 * import {
 *  Segmented,
 *  MaterialTabBar
 * } from 'react-native-collapsible-segmented-view
 *
 * ...
 *
 * <Segmented.View
 *  control={(props) => <MaterialTabBar {...props} indicatorStyle='red' />}
 * >
 *  ...
 * ```
 */
export const MaterialTabBar: React.FC<Props> = ({
  setIndex,
  labels,
  floatIndex,
  containerStyle,
  tabStyle,
  indicatorStyle,
  pressColor = 'DDDDDD',
  pressOpacity = IS_IOS ? 0.2 : 1,
  labelStyle,
  inactiveOpacity = 0.4,
  // ...rest
}) => {
  const windowWidth = useWindowDimensions().width

  const onTabPress = React.useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex)
    },
    [setIndex]
  )

  const [translateX, setTraslateX] = React.useState(
    floatIndex.interpolate({
      inputRange: labels.map((_, i) => i),
      outputRange: labels.map((_, i) => (windowWidth / labels.length) * i),
    })
  )

  React.useEffect(() => {
    setTraslateX(
      floatIndex.interpolate({
        inputRange: labels.map((_, i) => i),
        outputRange: labels.map((_, i) => (windowWidth / labels.length) * i),
      })
    )
  }, [floatIndex, labels, windowWidth])

  return (
    <View style={[styles.container, containerStyle]}>
      {labels.map((label, index) => {
        return (
          <Pressable
            key={label}
            onPress={() => onTabPress(index)}
            android_ripple={{
              borderless: true,
              color: pressColor,
            }}
            style={({ pressed }) => [
              { opacity: pressed ? pressOpacity : 1 },
              styles.tab,
              tabStyle,
            ]}
          >
            <Animated.Text
              style={[
                styles.label,
                {
                  opacity: floatIndex.interpolate({
                    inputRange: labels.map((_, i) => i),
                    outputRange: labels.map((_, i) =>
                      i === index ? 1 : inactiveOpacity
                    ),
                  }),
                },
                labelStyle,
              ]}
            >
              {label}
            </Animated.Text>
          </Pressable>
        )
      })}
      <Animated.View
        style={[
          styles.indicator,
          indicatorStyle,
          { transform: [{ translateX }], width: windowWidth / labels.length },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 48,
  },
  label: {
    margin: 4,
    color: 'black',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#2196f3',
  },
})
