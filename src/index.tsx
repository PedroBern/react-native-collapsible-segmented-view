import {
  MaterialTabBar,
  Props as MaterialTabBarProps,
} from './ControlComponents/MaterialTabBar'
import {
  SegmentedControl,
  Props as SegmentedControlProps,
} from './ControlComponents/SegmentedControl'
import { FlatList } from './ScrollComponents/FlatList'
import { ScrollView } from './ScrollComponents/ScrollView'
import { Segment } from './Segment'
import { SegmentedView, Props as SegmentedViewProps } from './SegmentedView'
import { CONTROL_HEIGHT } from './helpers'
import { useHeaderMeasurements } from './hooks/useHeaderMeasurements'
import { useIsFocused } from './hooks/useIsFocused'
import { useSelectedIndex } from './hooks/useSelectedIndex'
import { ControlProps } from './types'

export type {
  SegmentedViewProps,
  ControlProps,
  MaterialTabBarProps,
  SegmentedControlProps,
}

export {
  SegmentedView,
  Segment,
  ScrollView,
  FlatList,
  MaterialTabBar,
  SegmentedControl,
  useIsFocused,
  useSelectedIndex,
  useHeaderMeasurements,
  CONTROL_HEIGHT,
}

export const Segmented = {
  View: SegmentedView,
  Segment,
  ScrollView,
  FlatList,
}
