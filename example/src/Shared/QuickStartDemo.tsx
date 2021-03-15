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
