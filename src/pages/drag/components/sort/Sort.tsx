// eslint-disable-next-line no-use-before-define
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import type { CSSProperties } from 'react'
import {
  useDrop,
  useDrag,
  DndProvider,
  useDragDropManager,
} from 'react-dnd'
import { HTML5Backend, getEmptyImage } from 'react-dnd-html5-backend'
// import { TouchBackend } from 'react-dnd-touch-backend' // 如果是移动端，采用TouchBackend
import './index.scss'

const style: any = {
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  cursor: 'move',
}

const ItemTypes = {
  CARD: 'card',
  CONTAINER: 'container',
}

interface CardProps {
  id: number,
  text: string,
  index: number,
  height?:boolean,
  moveCard: (dragIndex: number, hoverIndex: number) => void,
  optionHandles: {
    [key: string]: any
  }
  styleObj: CSSProperties
}

const CardPreview = ({ item, isDragging, offsetY, offsetX, styleObj }:any) => {
  const { height, width } = item?.rect ?? {}

  return isDragging ? <div
    className="card-item-preview"
    style={{
      top: `${offsetY}px`,
      left: `${offsetX}px`,
      position: 'fixed',
      background: 'blue',
      zIndex: 100,
      ...style,
      ...styleObj,
      height: `${height}px`,
      width: `${width}px`,
    }}
  >
    <div className="item">{item.text}</div>
  </div> : null

}

const Card = ({ id, text, index, moveCard, optionHandles, styleObj }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover (item: CardProps, monitor: any) { // 只有在hover时执行
      // 异常处理判断
      if (!ref.current) {
        return
      }
      // 拖拽目标的Index
      const dragIndex = item.index
      // 放置目标Index
      const hoverIndex = index
      // 如果拖拽目标和放置目标相同的话，停止执行
      if (dragIndex === hoverIndex) { // 当拖拽对像的上边缘和放置对象的下边缘重合时，此时的hoverIndex变为放置对象的index
        return
      }

      // 如果不做以下处理，则卡片移动到另一个卡片上就会进行交换，下方处理使得卡片能够在跨过中心线后进行交换.
      // 获取卡片的边框矩形
      // console.log(ref.current) // 这里的ref指的是正在移动的对象
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      // console.log(hoverBoundingRect.bottom, hoverBoundingRect.top)
      // 获取Y轴中点
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2 // 被拖动物体的高度的一半
      // 获取拖拽目标偏移量
      const clientOffset = monitor.getClientOffset() // 获取的是鼠标距离窗口左侧和顶部的距离
      // console.log(clientOffset)
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // console.log('hoverClientY', hoverClientY)
      // 从上往下放置console.log(hoverClientY)
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // 从下往上放置
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveCard(dragIndex, hoverIndex) // 调用方法完成交换
      item.index = hoverIndex // 重新赋值index，否则会出现无限交换情况
    },
  })

  const [{ isDragging, item = {} }, drag, dragPreview] = useDrag({
    type: ItemTypes.CARD,
    item: {
      id: id,
      index: index,
      text: text,
      rect: ref.current?.getBoundingClientRect() ?? {},
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    }),
    // previewOptions: {
    //   captureDraggingState: true,
    //   anchorX: 100,
    // },
  })

  const opacity = (!item || item.index !== index) ? 1 : 0

  useEffect(() => {
    optionHandles.setStatus(isDragging)
  }, [isDragging])

  useEffect(() => {
    optionHandles.setItem(item)
  }, [item])

  /**
   * 对于html5 drag原生api
   * 在拖拽时，会自动生成预览截图跟随移动，如果想改变该截图使用dataTransfer.setDragImage(img, xOffset, yOffset);
   * 如果要实现自定义预览，可以自己使用dom实现
   * react-dnd提供了自定义预览的api，使用useDragLayer
   */
  drag(drop(ref))
  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true }) // 隐藏拖拽dom
  }, [])

  return (
    <div className="card-item-box">
      <div
        className="card-item"
        ref={ref}
        style={{
          ...style,
          opacity: opacity,
          ...styleObj,
        }}
      >
        <div className="item">{text}</div>
      </div>
    </div>
  )
}

const Container = ({ previewList, handlePreviewList }: any) => {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setStatus] = useState(false)
  const [activeItem, setItem] = useState({})
  const dragDropManager = useDragDropManager()
  const monitor = dragDropManager.getMonitor()
  const updateCollected = useCallback(
    () => {
      const offset = monitor.getSourceClientOffset()
      if (offset) {
        const { x, y } = offset
        setOffsetX(x)
        setOffsetY(y)
      }

    },
    [],
  )
  useLayoutEffect(() => monitor.subscribeToOffsetChange(updateCollected)) // redux中offset改变时，运行该订阅函数
  // useEffect(() => monitor.subscribeToStateChange(updateCollected))

  const handleDnd = (dragIndex: number, hoverIndex: number) => {
    const tmp = previewList[dragIndex]
    previewList.splice(dragIndex, 1)
    previewList.splice(hoverIndex, 0, tmp)
    handlePreviewList(previewList.map((item: any) => item))
  }

  return (
    <div className="card-list">
      {
        previewList.map((item: CardProps, index: number) => {
          return (
            <Card
              key={index}
              index={index}
              id={item.id}
              text={item.text}
              styleObj={item && item.height ? { height: '100px' } : {}}
              moveCard={handleDnd}
              optionHandles={{
                setOffsetX,
                setOffsetY,
                setStatus,
                setItem,
              }}
            />
          )
        })
      }
      <CardPreview
        isDragging={isDragging}
        offsetX={offsetX}
        offsetY={offsetY}
        item={activeItem}
        styleObj={activeItem?.height ? { height: '100px' } : {}}
      />
    </div>
  )

}

export default function Sort () {
  const [cardList, setCardList] = useState([
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text:
        'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    },
    {
      id: 6,
      text: '???',
      height: true,
    },
    {
      id: 7,
      text: 'PROFIT',
    },
  ])

  return (
    <DndProvider backend={HTML5Backend}>
      <Container
        previewList={cardList}
        handlePreviewList={setCardList}
      />
    </DndProvider>
  )
}
