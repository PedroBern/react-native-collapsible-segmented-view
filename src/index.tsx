import { MaterialTabBar, Props as MaterialTabBarProps } from './MaterialTabBar'
import { FlatList } from './ScrollComponents/FlatList'
import { ScrollView } from './ScrollComponents/ScrollView'
import { Segment } from './Segment'
import {
  SegmentedControl,
  Props as SegmentedControlProps,
} from './SegmentedControl'
import { SegmentedView, Props as SegmentedViewProps } from './SegmentedView'
import { ControlProps } from './types'
import { useHeaderMeasurements } from './useHeaderMeasurements'
import { useIsFocused } from './useIsFocused'
import { useSelectedIndex } from './useSelectedIndex'

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
}

export const Segmented = {
  View: SegmentedView,
  Segment,
  ScrollView,
  FlatList,
}
