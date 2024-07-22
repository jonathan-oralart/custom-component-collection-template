import { Retool } from '@tryretool/custom-component-support'
import { FC } from 'react'

export const HelloWorldComponent: FC = () => {
  // Allows the builder to specify a "name" property on each component they build with.

  const [showBorder, _setShowBorder] = Retool.useStateBoolean({
    name: 'showBorder',
    initialValue: false,
    label: 'Show Border',
    inspector: 'checkbox'
  })

  return (
    <div style={{ border: showBorder ? '1px solid black' : '' }}> Hello! </div>
  )
}
