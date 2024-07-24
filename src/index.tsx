import React from 'react'
import { type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import TeethSelectionBase from './teethSelector'

export const TeethSelection: FC = () => {
  const [value, setValue] = Retool.useStateString({ name: 'value' })

  return (
    <TeethSelectionBase value={value} setValue={setValue} onChange={() => {}} />
  )
}
