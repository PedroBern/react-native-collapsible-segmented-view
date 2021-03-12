import React from 'react'
import { useWindowDimensions } from 'react-native'
import {
  NavigationState,
  TabBar,
  TabBarProps,
  SceneRendererProps,
} from 'react-native-tab-view'

import { ControlProps } from './types'

export type Props = ControlProps &
  Omit<
    TabBarProps<any>,
    | 'position'
    | 'layout'
    | 'jumpTo'
    | 'navigationState'
    | 'onTabPress'
    | 'getLabelText'
    | 'getAccessible'
    | 'getAccessibilityLabel'
    | 'getTestID'
    | 'renderIndicator'
  > &
  Partial<
    Pick<
      TabBarProps<any>,
      | 'getLabelText'
      | 'getAccessible'
      | 'getAccessibilityLabel'
      | 'getTestID'
      | 'renderIndicator'
    >
  >

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
  onTabPress,
  labels,
  position,
  initialIndex,
  index,
  ...rest
}) => {
  const windowWidth = useWindowDimensions().width

  const _onTabPress = React.useCallback(
    (label: string) => {
      const index = labels.findIndex((l) => l === label)
      onTabPress(index)
    },
    [onTabPress, labels]
  )

  const sceneRendererProps = React.useMemo<SceneRendererProps>(() => {
    return {
      position,
      layout: { width: windowWidth, height: 0 },
      jumpTo: _onTabPress,
    }
  }, [_onTabPress, position, windowWidth])

  const navigationState = React.useMemo<NavigationState<any>>(() => {
    return {
      index: initialIndex,
      routes: labels.map((l) => ({ key: l, title: l })),
    }
  }, [initialIndex, labels])

  return (
    <TabBar
      {...sceneRendererProps}
      navigationState={navigationState}
      {...rest}
    />
  )
}
