import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { teethData } from './teethData'

type TeethSelectionProps = {
  onChange: (teeth: string) => void
  value: string
  setValue: (teeth: string) => void
}

function Tooth({
  toothNum,
  textTransform,
  pathTransform,
  d,
  selected,
  onMouseDown,
  onMouseEnter
}: {
  toothNum: number
  textTransform: string
  pathTransform: string
  d: string
  selected: boolean
  onMouseDown: (toothNum: number) => void
  onMouseEnter: (toothNum: number) => void
}) {
  return (
    <g
      style={{ fill: selected ? '#3a88d7' : '#e8e8e8', cursor: 'pointer' }}
      id={`tooth-${toothNum}`}
      onMouseDown={() => onMouseDown(toothNum)}
      onMouseEnter={() => onMouseEnter(toothNum)}
    >
      <path className="tooth_path" d={d} transform={pathTransform} />
      <text
        style={{
          fontSize: '2.3em',
          fill: selected ? 'white' : '#858585',
          fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
          userSelect: 'none'
        }}
        textAnchor="middle"
        transform={textTransform}
      >
        {toothNum}
      </text>
    </g>
  )
}

function TeethSelectionBase({
  onChange,
  value,
  setValue
}: TeethSelectionProps) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const selectedTeeth = useMemo(
    () =>
      new Set(
        value
          .split(/[\s,]+/)
          .map((x) => parseInt(x))
          .filter(Boolean)
      ),
    [value]
  )

  const toggleTooth = useCallback(
    (toothNum: number) => {
      const newSelection = new Set(selectedTeeth)
      if (newSelection.has(toothNum)) {
        newSelection.delete(toothNum)
      } else {
        newSelection.add(toothNum)
      }
      const newValue = Array.from(newSelection).join(', ')
      setValue(newValue)
      onChange(newValue)
    },
    [selectedTeeth, setValue, onChange]
  )

  const handleMouseDown = useCallback(
    (toothNum: number) => {
      setIsDragging(true)
      toggleTooth(toothNum)
    },
    [toggleTooth]
  )

  const handleMouseEnter = useCallback(
    (toothNum: number) => {
      if (isDragging) {
        toggleTooth(toothNum)
      }
    },
    [isDragging, toggleTooth]
  )

  const renderTeeth = useCallback(
    (arch: 'upper' | 'lower') =>
      teethData
        .filter((tooth) => tooth.arch === arch)
        .map((tooth) => (
          <Tooth
            key={tooth.toothNum}
            {...tooth}
            selected={selectedTeeth.has(tooth.toothNum)}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
          />
        )),
    [selectedTeeth, handleMouseDown, handleMouseEnter]
  )

  return (
    <div className="tooth_chart_container">
      <div className="tooth_chart">
        <span className="tooth_arch">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            viewBox="0 0 1305.645 223.836"
            style={{ maxHeight: '70px', maxWidth: '100%' }}
          >
            <title>Teeth Chart</title>
            <g className="upper_arch arch_wrapper">{renderTeeth('upper')}</g>
            <g className="lower_arch arch_wrapper">{renderTeeth('lower')}</g>
          </svg>
        </span>
      </div>
    </div>
  )
}

export default TeethSelectionBase
