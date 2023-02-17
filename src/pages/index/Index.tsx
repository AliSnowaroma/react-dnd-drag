// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import './Index.css'
export default function Index () {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
  })

  // setCount(0)
  console.log('1221')

  return (
    <div className="index-page">
      使用css1{count}
    </div>
  )
}
