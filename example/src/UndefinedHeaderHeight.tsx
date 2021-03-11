import React from 'react'

import { ExampleComponent } from './Shared/ExampleComponent'
import { buildHeader } from './Shared/Header'
import { ExampleComponentType } from './types'

const title = 'Undefined header height'

const Header = buildHeader(title)

const Example: ExampleComponentType = () => {
  return <ExampleComponent header={Header} headerHeight={undefined} />
}

Example.title = title

export default Example
