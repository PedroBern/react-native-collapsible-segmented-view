import React from 'react'
import { useWindowDimensions } from 'react-native'
import {
  NavigationState,
  TabBar,
  TabBarProps,
  SceneRendererProps,
  Route,
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
  > & {
    routes?: Route[]
  }

/**
 * Default android control. Props are passed to the original [TabBar](https://github.com/satya164/react-native-tab-view#tabbar).
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
 *  control={(props) => <MaterialTabBar {...props} />}
 * >
 *  ...
 * ```
 *
 * You can optionally pass custom routes in the same format of [the routes in the navigationState](https://github.com/satya164/react-native-tab-view#navigationstate-required):
 *
 * ```tsx
 * const routes = [
 *    { key: 'A', title: 'A', icon: 'home' }
 * ]
 *
 *
 * const renderIcon={({ route, focused, color }) => (
 *  <Icon
 *    name={route.icon}
 *    color={color}
 *  />
 * )}
 *
 *
 * <Segmented.View
 *  control={(props) => (
 *    <MaterialTabBar routes={routes} renderIcon={renderIcon} {...props} />
 *  )}
 * >
 *  ...
 * ```
 *
 */
export const MaterialTabBar: React.FC<Props> = ({
  onTabPress,
  labels,
  position,
  initialIndex,
  index,
  routes,
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
      routes: routes ? routes : labels.map((l) => ({ key: l, title: l })),
    }
  }, [initialIndex, labels, routes])

  return (
    <TabBar
      {...sceneRendererProps}
      navigationState={navigationState}
      {...rest}
    />
  )
}
