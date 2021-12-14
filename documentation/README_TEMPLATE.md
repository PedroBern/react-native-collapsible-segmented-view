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
$QUICK_START_CODE
```

# API reference

## Core

$CORE_API

## Controls

$SEGMENTED_CONTROL_API

$MATERIAL_TABBAR_API

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
