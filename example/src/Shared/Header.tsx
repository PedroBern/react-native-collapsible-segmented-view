import React from 'react'
import { Platform, StyleSheet, View, Text } from 'react-native'

type Props = {
  title: string
  height?: number
}

export const HEADER_HEIGHT = 250

export const Header = ({ title, height = HEADER_HEIGHT }: Props) => {
  return (
    <View style={[styles.root, { height }]} pointerEvents="none">
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

function buildHeader(title: string) {
  const NewHeader = () => {
    return <Header title={title} />
  }

  return NewHeader
}

export { buildHeader }

const styles = StyleSheet.create({
  root: {
    backgroundColor: Platform.select({
      ios: '#2196f3',
      android: '#58b0f5',
    }),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
})

export default Header
