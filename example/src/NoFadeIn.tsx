import React from 'react'

import { ExampleComponent } from './Shared/ExampleComponent'
import { buildHeader } from './Shared/Header'
import { ExampleComponentType } from './types'

const title = 'No fade in'

const Header = buildHeader(title)

const Example: ExampleComponentType = () => {
  return <ExampleComponent header={Header} disableFadeIn />
}

Example.title = title

export default Example
