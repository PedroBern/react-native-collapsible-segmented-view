import React from 'react'
import {
  Segmented,
  SegmentedViewProps,
} from 'react-native-collapsible-segmented-view'

import Albums from './Albums'
import Article from './Article'
import Contacts from './Contacts'

type Props = Partial<SegmentedViewProps>

export const ExampleComponent: React.FC<Props> = (props) => {
  return (
    <Segmented.View {...props}>
      <Segmented.Segment label="Article" component={Article} />
      <Segmented.Segment label="Albums" component={Albums} />
      <Segmented.Segment label="Contacts" component={Contacts} />
    </Segmented.View>
  )
}
