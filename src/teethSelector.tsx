import React, { useCallback, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { teethData } from './teethData'
// Atoms for state management
const selectedTeethAtom = atom<Set<number>>(new Set<number>())
const isDraggingAtom = atom(false)
const firstSelectedToothAtom = atom<number | null>(null)

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
  onMouseDown,
  onMouseEnter
}: {
  toothNum: number
  textTransform: string
  pathTransform: string
  d: string
  onMouseDown: (toothNum: number) => void
  onMouseEnter: (toothNum: number) => void
}) {
  const [selectedTeeth] = useAtom(selectedTeethAtom)
  const selected = selectedTeeth.has(toothNum)

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
  const [selectedTeeth, setSelectedTeeth] = useAtom(selectedTeethAtom)
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom)
  const [firstSelectedTooth, setFirstSelectedTooth] = useAtom(
    firstSelectedToothAtom
  )

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false)
      setFirstSelectedTooth(null)
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [setIsDragging, setFirstSelectedTooth])

  useEffect(() => {
    const newSelectedTeeth = new Set(
      value
        .split(/[\s,]+/)
        .map((x) => parseInt(x))
        .filter(Boolean)
    )
    setSelectedTeeth(newSelectedTeeth)
  }, [value, setSelectedTeeth])

  const updateSelection = useCallback(
    (newSelection: Set<number>) => {
      const newValue = Array.from(newSelection).join(', ')
      setSelectedTeeth(newSelection)
      setValue(newValue)
      onChange(newValue)
    },
    [setValue, onChange, setSelectedTeeth]
  )

  const handleMouseDown = useCallback(
    (toothNum: number) => {
      setIsDragging(true)
      setFirstSelectedTooth(toothNum)
      const newSelection = new Set(selectedTeeth)
      if (newSelection.has(toothNum)) {
        newSelection.delete(toothNum)
      } else {
        newSelection.add(toothNum)
      }
      updateSelection(newSelection)
    },
    [setIsDragging, setFirstSelectedTooth, selectedTeeth, updateSelection]
  )

  const handleMouseEnter = useCallback(
    (toothNum: number) => {
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
          const shouldSelect = !selectedTeeth.has(firstSelectedTooth)

          const newSelection = new Set(selectedTeeth)
          teethData.forEach((tooth) => {
            if (tooth.orderNum >= startOrder && tooth.orderNum <= endOrder) {
              if (shouldSelect) {
                newSelection.add(tooth.toothNum)
              } else {
                newSelection.delete(tooth.toothNum)
              }
            }
          })

          updateSelection(newSelection)
        }
      }
    },
    [isDragging, firstSelectedTooth, selectedTeeth, updateSelection]
  )

  const renderTeeth = useCallback(
    (arch: 'upper' | 'lower') =>
      teethData
        .filter((tooth) => tooth.arch === arch)
        .map((tooth) => (
          <Tooth
            key={tooth.toothNum}
            {...tooth}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
          />
        )),
    [handleMouseDown, handleMouseEnter]
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
