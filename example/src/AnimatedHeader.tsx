import React from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useHeaderMeasurements } from 'react-native-collapsible-segmented-view'

import { ExampleComponent } from './Shared/ExampleComponent'
import { ExampleComponentType } from './types'

const title = 'Animated Header'

export const Header = () => {
  const { translateY: translateYHeader } = useHeaderMeasurements()

  const [translateYView, setTranslateyView] = React.useState(
    translateYHeader.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -0.5],
      extrapolateRight: 'clamp',
    })
  )

  React.useEffect(() => {
    setTranslateyView(
      translateYHeader.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -0.5],
        extrapolateRight: 'clamp',
      })
    )
  }, [translateYHeader])

  return (
    <View style={[styles.root]}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: translateYView }] },
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </View>
  )
}

const Example: ExampleComponentType = () => {
  return <ExampleComponent renderHeader={Header} />
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: 250,
  },
  container: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    position: 'absolute',
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
})

Example.title = title

export default Example
