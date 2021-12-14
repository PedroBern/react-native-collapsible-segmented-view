import React from 'react'

import { ExampleComponent } from './Shared/ExampleComponent'
import { buildHeader } from './Shared/Header'
import { ExampleComponentType } from './types'

const title = 'Lazy'

const Header = buildHeader(title)

const Example: ExampleComponentType = () => {
  return <ExampleComponent renderHeader={Header} lazy />
}

Example.title = title

export default Example
