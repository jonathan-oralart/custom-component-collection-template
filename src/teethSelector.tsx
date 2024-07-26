import React, { useState, useEffect } from 'react'
import { teethData } from './teethData'

type TeethSelectionProps = {
  onChange: (teeth: string) => void
  value: string
  setValue: (teeth: string) => void
}

function stringToArray(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map((x) => parseInt(x))
    .filter(Boolean)
}

function arrayToString(arr: number[]): string {
  return arr.join(', ')
}

function Tooth({
  toothNum,
  textTransform,
  pathTransform,
  d,
  isSelected,
  isDragging,
  onMouseDown,
  onMouseEnter
}: {
  toothNum: number
  textTransform: string
  pathTransform: string
  d: string
  isSelected: boolean
  isDragging: boolean
  onMouseDown: (toothNum: number) => void
  onMouseEnter: (toothNum: number) => void
}) {
  const fillColor = isDragging ? '#6aA8f7' : isSelected ? '#3a88d7' : '#e8e8e8'

  return (
    <g
      style={{ fill: fillColor, cursor: 'pointer' }}
      id={`tooth-${toothNum}`}
      onMouseDown={() => onMouseDown(toothNum)}
      onMouseEnter={() => onMouseEnter(toothNum)}
    >
      <path className="tooth_path" d={d} transform={pathTransform} />
      <text
        style={{
          fontSize: '2.3em',
          fill: isSelected || isDragging ? 'white' : '#858585',
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
  const [internalValue, setInternalValue] = useState(stringToArray(value))
  const [draggedTeeth, setDraggedTeeth] = useState<Set<number>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const [firstSelectedTooth, setFirstSelectedTooth] = useState<number | null>(
    null
  )

  useEffect(() => {
    setInternalValue(stringToArray(value))
  }, [value])

  useEffect(() => {
    const handleMouseUp = () => {
      if (firstSelectedTooth !== null) {
        const wasFirstToothSelected = internalValue.includes(firstSelectedTooth)
        let newSelection: number[]
        if (wasFirstToothSelected) {
          newSelection = internalValue.filter(
            (tooth) => !draggedTeeth.has(tooth)
          )
        } else {
          newSelection = [...new Set([...internalValue, ...draggedTeeth])]
        }
        setInternalValue(newSelection)
        const newValue = arrayToString(newSelection)
        setValue(newValue)
        onChange(newValue)
      }
      setIsDragging(false)
      setFirstSelectedTooth(null)
      setDraggedTeeth(new Set())
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [internalValue, draggedTeeth, firstSelectedTooth, onChange, setValue])

  const handleMouseDown = (toothNum: number) => {
    setIsDragging(true)
    setFirstSelectedTooth(toothNum)
    setDraggedTeeth(new Set([toothNum]))
  }

  const handleMouseEnter = (toothNum: number) => {
    if (isDragging && firstSelectedTooth !== null) {
      const firstToothData = teethData.find(
        (t) => t.toothNum === firstSelectedTooth
      )
      const currentToothData = teethData.find((t) => t.toothNum === toothNum)

      if (firstToothData && currentToothData) {
        const startOrder = Math.min(
          firstToothData.orderNum,
          currentToothData.orderNum
        )
        const endOrder = Math.max(
          firstToothData.orderNum,
          currentToothData.orderNum
        )

        const newDraggedTeeth = new Set(
          teethData
            .filter(
              (tooth) =>
                tooth.orderNum >= startOrder && tooth.orderNum <= endOrder
            )
            .map((tooth) => tooth.toothNum)
        )

        setDraggedTeeth(newDraggedTeeth)
      }
    }
  }

  const renderTeeth = (arch: 'upper' | 'lower') =>
    teethData
      .filter((tooth) => tooth.arch === arch)
      .map((tooth) => (
        <Tooth
          key={tooth.toothNum}
          {...tooth}
          isSelected={internalValue.includes(tooth.toothNum)}
          isDragging={draggedTeeth.has(tooth.toothNum)}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
        />
      ))

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
