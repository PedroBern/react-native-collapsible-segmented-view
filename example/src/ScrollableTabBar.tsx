import React from 'react'
import {
  ControlProps,
  MaterialTabBar,
} from 'react-native-collapsible-segmented-view'

import { ExampleComponent } from './Shared/ExampleComponent'
import { buildHeader } from './Shared/Header'
import { ExampleComponentType } from './types'

const title = 'Scrollable Tab Bar'

const Header = buildHeader(title)

const renderTab = (props: ControlProps) => {
  return (
    <MaterialTabBar scrollEnabled {...props} tabStyle={{ width: 'auto' }} />
  )
}

const Example: ExampleComponentType = () => {
  return <ExampleComponent renderHeader={Header} renderControl={renderTab} />
}

Example.title = title

export default Example
