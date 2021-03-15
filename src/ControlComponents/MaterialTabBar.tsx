import React from 'react'
import { useWindowDimensions, StyleSheet } from 'react-native'
import {
  NavigationState,
  TabBar,
  TabBarProps,
  SceneRendererProps,
} from 'react-native-tab-view'

import { CONTROL_HEIGHT } from '../helpers'
import { ControlProps } from '../types'

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
 * Rendering icons:
 *
 * ```tsx
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
 *    <MaterialTabBar renderIcon={renderIcon} {...props} />
 *  )}
 *  ...
 * >
 *    <Segmented.Segment key='article' title='Article' icon='home' component={Article} />
 *  ...
 * ```
 *
 */
export const MaterialTabBar: React.FC<Props> = ({
  onTabPress,
  position,
  initialIndex,
  index,
  routes,
  style,
  ...rest
}) => {
  const windowWidth = useWindowDimensions().width

  const _onTabPress = React.useCallback(
    (id: string) => {
      const index = routes.findIndex((r) => id === r.id)
      onTabPress(index)
    },
    [onTabPress, routes]
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
      routes: routes.map((route) => ({
        ...route,
        key: route.id,
      })),
    }
  }, [initialIndex, routes])

  return (
    <TabBar
      {...sceneRendererProps}
      navigationState={navigationState}
      style={[styles.container, style]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    height: CONTROL_HEIGHT,
  },
})
