import React, { useCallback, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { teethData } from './teethData'

// Atoms for state management
const savedSelectionAtom = atom<Set<number>>(new Set<number>())
const dragSelectionAtom = atom<Set<number>>(new Set<number>())
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
  const [savedSelection] = useAtom(savedSelectionAtom)
  const [dragSelection] = useAtom(dragSelectionAtom)

  const isSaved = savedSelection.has(toothNum)
  const isDragged = dragSelection.has(toothNum)

  let fillColor = '#e8e8e8' // Default color
  if (isSaved) fillColor = '#3a88d7' // Saved selection color
  if (isDragged) fillColor = isSaved ? '#2a68b7' : '#6aA8f7' // Drag selection color

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
          fill: isSaved || isDragged ? 'white' : '#858585',
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
  const [savedSelection, setSavedSelection] = useAtom(savedSelectionAtom)
  const [dragSelection, setDragSelection] = useAtom(dragSelectionAtom)
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom)
  const [firstSelectedTooth, setFirstSelectedTooth] = useAtom(
    firstSelectedToothAtom
  )

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false)

      if (firstSelectedTooth !== null) {
        const wasFirstToothSelected = savedSelection.has(firstSelectedTooth)
        setSavedSelection((prev) => {
          const newSelection = new Set(prev)
          dragSelection.forEach((tooth) => {
            if (wasFirstToothSelected) {
              newSelection.delete(tooth)
            } else {
              newSelection.add(tooth)
            }
          })
          return newSelection
        })
      }

      setFirstSelectedTooth(null)
      setDragSelection(new Set())
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [
    setIsDragging,
    setFirstSelectedTooth,
    setSavedSelection,
    setDragSelection,
    dragSelection,
    firstSelectedTooth,
    savedSelection
  ])

  useEffect(() => {
    const newSavedSelection = new Set(
      value
        .split(/[\s,]+/)
        .map((x) => parseInt(x))
        .filter(Boolean)
    )
    setSavedSelection(newSavedSelection)
  }, [value, setSavedSelection])

  const updateSelection = useCallback(() => {
    const newValue = Array.from(savedSelection).join(', ')
    setValue(newValue)
    onChange(newValue)
  }, [setValue, onChange, savedSelection])

  const handleMouseDown = useCallback(
    (toothNum: number) => {
      setIsDragging(true)
      setFirstSelectedTooth(toothNum)
      setDragSelection(new Set([toothNum]))
    },
    [setIsDragging, setFirstSelectedTooth, setDragSelection]
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

          const newDragSelection = new Set<number>()
          teethData.forEach((tooth) => {
            if (tooth.orderNum >= startOrder && tooth.orderNum <= endOrder) {
              newDragSelection.add(tooth.toothNum)
            }
          })

          setDragSelection(newDragSelection)
        }
      }
    },
    [isDragging, firstSelectedTooth, setDragSelection]
  )

  useEffect(() => {
    updateSelection()
  }, [savedSelection, updateSelection])

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
