import Control, {
  SegmentedControlProps,
  NativeSegmentedControlIOSChangeEvent,
} from '@react-native-community/segmented-control'
import React from 'react'
import { NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native'

import { IS_IOS } from './helpers'
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
 *  control={(props) => <SegmentedControl {...props} appearence='dark' />}
 * >
 *  ...
 * ```
 */
export const SegmentedControl: React.FC<Props> = ({
  initialIndex,
  setIndex,
  labels,
  containerStyle,
  ...rest
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex)

  const onChange = React.useCallback(
    (event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
      setIndex(event.nativeEvent.selectedSegmentIndex)
    },
    [setIndex]
  )

  const onValueChange = React.useCallback(
    (label: string) => {
      const nextIndex = labels.findIndex((l) => l === label)
      setIndex(nextIndex)
      setSelectedIndex(nextIndex)
    },
    [setIndex, labels]
  )

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
  },
})
