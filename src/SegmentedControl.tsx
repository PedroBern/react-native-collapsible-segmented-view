import Control, {
  SegmentedControlProps,
  NativeSegmentedControlIOSChangeEvent,
} from '@react-native-community/segmented-control'
import React from 'react'
import { NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native'

import { CONTROL_HEIGHT, IS_IOS } from './helpers'
import { ControlProps } from './types'

export type Props = ControlProps &
  SegmentedControlProps & {
    containerStyle?: ViewStyle
  }

/**
 * Default iOS control. Props are passed down to the original [SegmentedControl](https://github.com/react-native-segmented-control/segmented-control#react-native-segmented-controlsegmented-control).
 *
 * Example usage:
 *
 * ```tsx
 * import {
 *  Segmented,
 *  SegmentedControl
 * } from 'react-native-collapsible-segmented-view
 *
 * ...
 *
 * <Segmented.View
 *  control={(props) => <SegmentedControl {...props} appearance='dark' />}
 * >
 *  ...
 * ```
 */
export const SegmentedControl: React.FC<Props> = ({
  initialIndex,
  onTabPress,
  labels,
  index,
  containerStyle,
  position,
  ...rest
}) => {
  const trackSelectedIndex = React.useRef(initialIndex)
  const [selectedIndex, setSelectedIndex] = React.useState(
    trackSelectedIndex.current
  )

  const onChange = React.useCallback(
    (event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
      trackSelectedIndex.current = event.nativeEvent.selectedSegmentIndex
      onTabPress(event.nativeEvent.selectedSegmentIndex)
    },
    [onTabPress]
  )

  const onValueChange = React.useCallback(
    (label: string) => {
      const nextIndex = labels.findIndex((l) => l === label)
      trackSelectedIndex.current = nextIndex
      onTabPress(nextIndex)
      setSelectedIndex(nextIndex)
    },
    [onTabPress, labels]
  )

  React.useEffect(() => {
    const listener = index.addListener(({ value }) => {
      if (value !== trackSelectedIndex.current) {
        trackSelectedIndex.current = value
        setSelectedIndex(value)
      }
    })
    return () => {
      index.removeListener(listener)
    }
  }, [index])

  return (
    <View style={[styles.container, containerStyle]}>
      <Control
        values={labels}
        onChange={IS_IOS ? onChange : undefined}
        onValueChange={IS_IOS ? undefined : onValueChange}
        selectedIndex={selectedIndex}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    height: CONTROL_HEIGHT,
  },
})
