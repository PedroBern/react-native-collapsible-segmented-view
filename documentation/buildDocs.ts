import { Prop, OverrideProps } from './types'

const fs = require('fs')
const path = require('path')
const docgen = require('react-docgen-typescript')

const { writeDocs, getComponentPaths } = require('./utils')

const TEMPLATE = path.join(__dirname, 'README_TEMPLATE.md')
const README = path.join(__dirname, '..', 'README.md')
const QUICK_START = path.join(
  __dirname,
  '../example/src/Shared/QuickStartDemo.tsx'
)
const tsconfig = path.join(__dirname, '../tsconfig.json')

const coreComponents = getComponentPaths([
  'SegmentedView',
  'Segment',
  'ScrollComponents/FlatList',
  'ScrollComponents/ScrollView',
])

const segmentedControlComponents = getComponentPaths([
  'ControlComponents/SegmentedControl',
])

const tabBarComponents = getComponentPaths(['ControlComponents/MaterialTabBar'])

const docs = docgen.withCustomConfig(tsconfig, {
  savePropValueAsString: true,
  propFilter: (prop: Prop, component: any) => {
    // skip props from `...rest` or private props
    if (
      prop.parent ||
      component.name === 'Segmented.FlatList' ||
      component.name === 'Segmented.ScrollView' ||
      prop.name.startsWith('_')
    )
      return false
    if (
      component.name === 'SegmentedControl' ||
      component.name === 'MaterialTabBar'
    ) {
      const blackList = [
        'position',
        'onTabPress',
        'index',
        'initialIndex',
        'routes',
      ]
      if (blackList.includes(prop.name)) {
        return false
      }
    }
    return true
  },
  componentNameResolver: (exp: { escapedName: string }, _source: any) => {
    const name = exp.escapedName
    switch (name) {
      case 'SegmentedView':
        return 'Segmented.View'

      case 'Segment':
      case 'FlatList':
      case 'ScrollView':
        return 'Segmented.' + exp.escapedName

      default:
        return name
    }
  },
})

// Some props are resolved very weird, so we manually define some of them here.
const overrideProps: OverrideProps = {
  MaterialTabBar: {},
  SegmentedControl: {},
  'Segmented.View': {
    control: {
      type: {
        name: '(props: ControlProps) => React.ReactElement',
      },
      defaultValue: { value: 'IS_IOS ? SegmentedControl : MaterialTabBar' },
    },
    controlHeight: {
      type: {
        name: 'number | undefined',
      },
      defaultValue: { value: '48' },
    },
    header: {
      type: {
        name: '() => React.ReactElement',
      },
      defaultValue: null,
    },
  },
  'Segmented.Segment': {
    component: {
      type: {
        name: '() => React.ReactElement',
      },
      defaultValue: null,
    },
  },
  'Segmented.FlatList': {},
  'Segmented.ScrollView': {},
}

const getAPI = (paths: string[]) => {
  let md = ''
  paths.forEach((path) => {
    const api = docs.parse(path)
    md += writeDocs(api, overrideProps)
  })
  return md
}

const getQuickStartCode = () => {
  const code = fs.readFileSync(QUICK_START, 'utf-8')
  return code
}

const quickStartCode = getQuickStartCode()
const coreAPI = getAPI(coreComponents)
const segmentedControlAPI = getAPI(segmentedControlComponents)
const tabBarAPI = getAPI(tabBarComponents)

fs.copyFileSync(TEMPLATE, README)
let data = fs.readFileSync(README, 'utf-8')

data = data.replace('$QUICK_START_CODE', quickStartCode)
data = data.replace('$CORE_API', coreAPI)
data = data.replace('$SEGMENTED_CONTROL_API', segmentedControlAPI)
data = data.replace('$MATERIAL_TABBAR_API', tabBarAPI)

fs.writeFileSync(README, data)

export {}
