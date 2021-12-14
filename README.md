# react-native-collapsible-segmented-view

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![runs with expo][expo-badge]][expo]

- [Expo app](#expo-app)
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API reference](#api-reference)
  - [Core](#core)
    - [Segmented.View](#segmentedview)
    - [Segmented.Segment](#segmentedsegment)
    - [Segmented.FlatList](#segmentedflatlist)
    - [Segmented.ScrollView](#segmentedscrollview)
  - [Controls](#controls)
    - [SegmentedControl](#segmentedcontrol)
    - [MaterialTabBar](#materialtabbar)
  - [Hooks](#hooks)
    - [useIsFocused](#useisfocused)
    - [useSelectedIndex](#useselectedindex)
    - [useHeaderMeasurements](#useheadermeasurements)
- [Alternative libraries](#alternative-libraries)
- [Contributing](#contributing)
  - [Documentation changes](#documentation-changes)

# Expo app

Collapsible Segmented View for React Native

- [View it with Expo](https://expo.io/@pedrobern/react-native-collapsible-segmented-view-demos).
- Checkout the [examples](https://github.com/PedroBern/react-native-collapsible-segmented-view/tree/main/example) for the source code of the Expo app.

<a href="https://expo.io/@pedrobern/react-native-collapsible-segmented-view-demos"><img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=exp://exp.host/@pedrobern/react-native-collapsible-segmented-view-demos" height="200px" width="200px"></a>

**Credits**

The [react-native-tab-view](https://github.com/satya164/react-native-tab-view) example app was used as template for the demos.

# Demo

|                                                        ios                                                         |                                                        android                                                         |
| :----------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/PedroBern/react-native-collapsible-segmented-view/raw/main/demo/ios.gif" width="360"> | <img src="https://github.com/PedroBern/react-native-collapsible-segmented-view/raw/main/demo/android.gif" width="360"> |

# Features

- [Material Tab Bar](https://github.com/satya164/react-native-tab-view#tabbar) for Android
- [SegmentedControl](https://github.com/react-native-segmented-control/segmented-control#react-native-segmented-controlsegmented-control) for iOS
- Lazy support
- Highly customizable
- Fully typed with [TypeScript](https://typescriptlang.org)

# Installation

Open a Terminal in the project root and run:

```sh
yarn add react-native-collapsible-segmented-view

expo install @react-native-community/segmented-control

yarn add react-native-tab-view react-native-pager-view
```

# Quick Start

```tsx
import React from 'react'
import { View, StyleSheet, ListRenderItem, Text } from 'react-native'
import { Segmented } from 'react-native-collapsible-segmented-view'

const Header = () => {
  return (
    <View style={styles.box} pointerEvents="box-none">
      <Text style={styles.text}>Collapsible Header</Text>
    </View>
  )
}

const Example: React.FC = () => {
  return (
    <Segmented.View renderHeader={Header}>
      <Segmented.Segment id="A" title="A" component={SegmentA} />
      <Segmented.Segment id="B" title="B" component={SegmentB} />
      <Segmented.Segment id="C" title="C" component={SegmentC} />
    </Segmented.View>
  )
}

const buildRenderItem = (color0: string, color1: string) => {
  const renderItem: ListRenderItem<number> = (data) => {
    const backgroundColor = data.index % 2 === 0 ? color0 : color1
    const color = data.index % 2 === 0 ? color1 : color0
    return (
      <View style={[styles.box, { backgroundColor }]}>
        <Text style={[{ color }, styles.text]}>{data.index}</Text>
      </View>
    )
  }
  return renderItem
}

const buildSegment = (data: number[], color0: string, color1: string) => {
  const Segment = () => {
    return (
      <Segmented.FlatList
        data={data}
        renderItem={buildRenderItem(color0, color1)}
        keyExtractor={(v) => v + ''}
      />
    )
  }
  return Segment
}

const data0 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const data1 = [0, 1]

const SegmentA = buildSegment(data0, '#FBC02D', '#FFF9C4')
const SegmentB = buildSegment(data0, '#0097A7', '#B2EBF2')
const SegmentC = buildSegment(data1, '#D32F2F', '#FFCDD2')

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: '100%',
  },
  text: {
    fontSize: 32,
  },
})

export default Example

```

# API reference

## Core

### Segmented.View

Basic usage looks like this:

```tsx
import { Segmented } from 'react-native-collapsible-segmented-view'

const Example = () => {
   return (
     <Segmented.View hader={MyHeader}>
       <Segmented.Segment id="A" component={ScreenA} />
       <Segmented.Segment id="B" component={ScreenB} />
        <Segmented.Segment id="C" component={ScreenC} />
     </Tabs.Container>
   )
}
```

#### Props

|name|type|default|
|:----:|:----:|:----:|
|animatedValue|`Value \| undefined`||
|containerHeight|`number \| undefined`|`0`|
|containerStyle|`ViewStyle \| undefined`||
|controlHeight|`number \| undefined`|`48`|
|headerHeight|`number \| undefined`||
|initialIndex|`number \| undefined`|`0`|
|keyboardDismissMode|`"none" \| "on-drag" \| "auto" \| undefined`||
|lazy|`boolean \| undefined`|`false`|
|renderControl|`FC<ControlProps> \| ((props: ControlProps) => ReactElement<any, string \| ((props: any) => ReactElement<any, string \| ... \| (new (props: any) => Component<any, any, any>)> \| null) \| (new (props: any) => Component<...>)>) \| undefined`||
|renderHeader|`FC<{}> \| (() => ReactElement<any, string \| ((props: any) => ReactElement<any, string \| ... \| (new (props: any) => Component<any, any, any>)> \| null) \| (new (props: any) => Component<...>)>) \| undefined`||
|swipeEnabled|`boolean \| undefined`|`true`|
|topStyle|`ViewStyle \| undefined`||

### Segmented.Segment

Wrap your screens with `Segmented.Segment`. Basic usage looks like this:

```tsx
<Segmented.View ...>
  <Segmented.Segment id="A" component={ScreenA} />
  <Segmented.Segment id="B" component={ScreenB} />
  <Segmented.Segment id="C" component={ScreenC} />
</Segmented.Container>
```

#### Props

|name|type|
|:----:|:----:|
|accessibilityLabel|`string \| undefined`|
|accessible|`boolean \| undefined`|
|component|`() => React.ReactElement`|
|icon|`string \| undefined`|
|id|`string`|
|testID|`string \| undefined`|
|title|`string \| undefined`|

### Segmented.FlatList

Use like a regular flatlist.

### Segmented.ScrollView

Use like a regular ScrollView.



## Controls

### SegmentedControl

Default iOS control. Props are passed down to the original [SegmentedControl](https://github.com/react-native-segmented-control/segmented-control#react-native-segmented-controlsegmented-control).

Example usage:

```tsx
import {
  Segmented,
  SegmentedControl
} from 'react-native-collapsible-segmented-view

...

<Segmented.View
  control={(props) => <SegmentedControl {...props} appearance='dark' />}
>
  ...
```

#### Props

|name|type|
|:----:|:----:|
|containerStyle|`ViewStyle \| undefined`|



### MaterialTabBar

Default android control. Props are passed to the original [TabBar](https://github.com/satya164/react-native-tab-view#tabbar).

Example usage:

```tsx
import {
  Segmented,
  MaterialTabBar
} from 'react-native-collapsible-segmented-view

...

<Segmented.View
  control={(props) => <MaterialTabBar {...props} />}
>
  ...
```

Rendering icons:

```tsx
const renderIcon={({ route, focused, color }) => (
  <Icon
    name={route.icon}
    color={color}
  />
)}


<Segmented.View
  control={(props) => (
    <MaterialTabBar renderIcon={renderIcon} {...props} />
  )}
  ...
>
    <Segmented.Segment key='article' title='Article' icon='home' component={Article} />
  ...
```

#### Props

|name|type|
|:----:|:----:|
|activeColor|`string \| undefined`|
|bounces|`boolean \| undefined`|
|contentContainerStyle|`StyleProp<ViewStyle>`|
|getAccessibilityLabel|`((scene: Scene<any>) => string \| undefined) \| undefined`|
|getAccessible|`((scene: Scene<any>) => boolean \| undefined) \| undefined`|
|getLabelText|`((scene: Scene<any>) => string \| undefined) \| undefined`|
|getTestID|`((scene: Scene<any>) => string \| undefined) \| undefined`|
|inactiveColor|`string \| undefined`|
|indicatorContainerStyle|`StyleProp<ViewStyle>`|
|indicatorStyle|`StyleProp<ViewStyle>`|
|labelStyle|`StyleProp<TextStyle>`|
|onTabLongPress|`((scene: Scene<any>) => void) \| undefined`|
|pressColor|`string \| undefined`|
|pressOpacity|`number \| undefined`|
|renderBadge|`((scene: Scene<any>) => ReactNode) \| undefined`|
|renderIcon|`((scene: Scene<any> & { focused: boolean; color: string; }) => ReactNode) \| undefined`|
|renderIndicator|`((props: Props<any>) => ReactNode) \| undefined`|
|renderLabel|`((scene: Scene<any> & { focused: boolean; color: string; }) => ReactNode) \| undefined`|
|renderTabBarItem|`((props: Props<any> & { key: string; }) => ReactElement<any, string \| ((props: any) => ReactElement<any, string \| ... \| (new (props: any) => Component<any, any, any>)> \| null) \| (new (props: any) => Component<...>)>) \| undefined`|
|scrollEnabled|`boolean \| undefined`|
|style|`StyleProp<ViewStyle>`|
|tabStyle|`StyleProp<ViewStyle>`|



## Hooks

### useIsFocused

Returns true if the segment is focused, else returns false.

```tsx
const isFocused = useIsFocused()
```

### useSelectedIndex

Returns the current segment selected index.

```tsx
const selectedIndex = useSelectedIndex()
```

### useHeaderMeasurements

Returns `translateY` interpolation and the height of the header. See the animated header example.

```tsx
const { translateY, height } = useHeaderMeasurements()
```

# Alternative libraries

If you are looking for a full-featured tab bar with swiping, scrollable tabs, dynamic rendering, snapping and diffClamp:

- [react-native-collapsible-tab-view](https://github.com/PedroBern/react-native-collapsible-tab-view)

# Contributing

While developing, you can run the [example app](/example/README.md) to test your changes.

Please follow the [angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typescript
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint -- --fix
```

Remember to add tests for your change if possible.

## Documentation changes

Edit the [README_TEMPLATE](https://github.com/PedroBern/react-native-collapsible-segmented-view/tree/main/documentation/README_TEMPLATE.md), or update the docstrings inside the `src` folder, and run:

```sh
yarn docs
```

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/build/github/PedroBern/react-native-collapsible-segmented-view/main.svg?style=flat-square
[build]: https://app.circleci.com/pipelines/github/PedroBern/react-native-collapsible-segmented-view
[version-badge]: https://img.shields.io/npm/v/react-native-collapsible-segmented-view.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-collapsible-segmented-view
[license-badge]: https://img.shields.io/npm/l/react-native-collapsible-segmented-view.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[expo-badge]: https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000
[expo]: https://github.com/expo/expo
