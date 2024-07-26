import React, { useState, useEffect, useCallback } from 'react'
import { teethData } from './teethData'

export type ToothProps = {
  toothNum: number
  textTransform: string
  pathTransform: string
  d: string
  arch: 'upper' | 'lower'
}

type TeethSelectionProps = {
  onChange: (teeth: string) => void
  value: string
  setValue: (teeth: string) => void
}

function Tooth(
  props: {
    toothNum: number
    textTransform: string
    pathTransform: string
    d: string
    isDragging: boolean
    onMouseEnter: () => void
    onMouseDown: () => void
  } & TeethSelectionProps
) {
  const selected = props.value
    .split(/[\s,]+/)
    .map((x) => parseInt(x))
    .includes(props.toothNum)

  return (
    <g
      style={{ fill: selected ? '#3a88d7' : '#e8e8e8', cursor: 'pointer' }}
      id={`tooth-${props.toothNum}`}
      onMouseDown={props.onMouseDown}
      onMouseEnter={props.onMouseEnter}
    >
      <path
        className="tooth_path"
        d={props.d}
        transform={props.pathTransform}
      ></path>
      <text
        style={{
          fontSize: '2.3em',
          fill: selected ? 'white' : '#858585',
          fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
          userSelect: 'none'
        }}
        textAnchor="middle"
        transform={props.textTransform}
      >
        {props.toothNum}
      </text>
    </g>
  )
}

function TeethSelectionBase(props: TeethSelectionProps) {
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const toggleSelection = useCallback(
    (toothNum: number) => {
      const selectedTeeth = props.value.split(/[\s,]+/).map((x) => parseInt(x))
      let newSelection: number[]

      if (selectedTeeth.includes(toothNum)) {
        newSelection = selectedTeeth.filter((t) => t !== toothNum)
      } else {
        newSelection = [...selectedTeeth, toothNum]
      }

      const joinedValues = newSelection.join(', ')
      props.setValue(joinedValues)
      props.onChange(joinedValues)
    },
    [props]
  )

  const handleMouseDown = useCallback(
    (toothNum: number) => {
      setIsDragging(true)
      toggleSelection(toothNum)
    },
    [toggleSelection]
  )

  const handleMouseEnter = useCallback(
    (toothNum: number) => {
      if (isDragging) {
        toggleSelection(toothNum)
      }
    },
    [isDragging, toggleSelection]
  )

  return (
    <>
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
              <g className="upper_arch arch_wrapper">
                {teethData
                  .filter((tooth) => tooth.arch === 'upper')
                  .map((tooth) => (
                    <Tooth
                      key={tooth.toothNum}
                      {...props}
                      {...tooth}
                      isDragging={isDragging}
                      onMouseDown={() => handleMouseDown(tooth.toothNum)}
                      onMouseEnter={() => handleMouseEnter(tooth.toothNum)}
                    />
                  ))}
              </g>
              <g className="lower_arch arch_wrapper">
                {teethData
                  .filter((tooth) => tooth.arch === 'lower')
                  .map((tooth) => (
                    <Tooth
                      key={tooth.toothNum}
                      {...props}
                      {...tooth}
                      isDragging={isDragging}
                      onMouseDown={() => handleMouseDown(tooth.toothNum)}
                      onMouseEnter={() => handleMouseEnter(tooth.toothNum)}
                    />
                  ))}
              </g>
            </svg>
          </span>
        </div>
      </div>
    </>
  )
}

export default TeethSelectionBase
