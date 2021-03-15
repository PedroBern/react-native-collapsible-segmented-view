import { useSegmentedViewContext } from '../SegmentedViewContext'
import { IS_IOS } from '../helpers'

type CollapsibleStyle = {
  style: { width: '100%' }
  contentContainerStyle: {
    minHeight: number
    paddingTop: number
  }
  progressViewOffset: number
}

export function useCollapsibleStyle(): CollapsibleStyle {
  const {
    headerHeight,
    controlHeight,
    containerHeight,
  } = useSegmentedViewContext()

  return {
    style: { width: '100%' },
    contentContainerStyle: {
      minHeight: IS_IOS
        ? containerHeight - controlHeight
        : containerHeight + headerHeight,
      paddingTop: IS_IOS ? 0 : headerHeight + controlHeight,
    },
    progressViewOffset: headerHeight + controlHeight,
  }
}
