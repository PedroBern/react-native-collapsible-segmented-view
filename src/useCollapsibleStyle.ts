import { useSegmentedViewContext } from './SegmentedViewContext'

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
      minHeight: (containerHeight || 0) + headerHeight,
      paddingTop: headerHeight + controlHeight,
    },
    progressViewOffset: headerHeight + controlHeight,
  }
}
