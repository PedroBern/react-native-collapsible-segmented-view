import React from 'react'
import {
  Segmented,
  SegmentedViewProps,
} from 'react-native-collapsible-segmented-view'

import Albums from './Albums'
import Article from './Article'
import Contacts from './Contacts'
import { HEADER_HEIGHT } from './Header'

type Props = Partial<SegmentedViewProps>

export const ExampleComponent: React.FC<Props> = (props) => {
  return (
    <Segmented.View headerHeight={HEADER_HEIGHT} {...props}>
      <Segmented.Segment id="article" title="Article" component={Article} />
      <Segmented.Segment id="albums" title="Albums" component={Albums} />
      <Segmented.Segment id="contacts" title="Contacts" component={Contacts} />
    </Segmented.View>
  )
}
