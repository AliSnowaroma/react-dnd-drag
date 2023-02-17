// eslint-disable-next-line no-use-before-define
import React from 'react'
import DragSource from './components/sort/Sort'
import './index.scss'

export default function Drag () {
  return (
    <div className="drag-page">
      <div className="source-box">
        <DragSource />
      </div>
      <div className="target-box" />
    </div>
  )
}
