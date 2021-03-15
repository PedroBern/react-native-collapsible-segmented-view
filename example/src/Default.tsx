import React from 'react'

import { ExampleComponent } from './Shared/ExampleComponent'
import { buildHeader } from './Shared/Header'
import { ExampleComponentType } from './types'

const title = 'Default'

const Header = buildHeader(title)

const Example: ExampleComponentType = () => {
  return <ExampleComponent renderHeader={Header} />
}

Example.title = title

export default Example
