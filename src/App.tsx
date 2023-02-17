// eslint-disable-next-line no-use-before-define
import React, { Component } from 'react'
import Home from '@src/pages/home/Home' // Cannot find module '@src/pages/home/Home' or its corresponding type declarations.ts(2307)
import Index from '@src/pages/index/Index' // 上面报错需要在tsconfig设置path属性为对应的别名
import bizhi from '../public/bizhi.jpg'
import Drag from '@src/pages/drag/Drag'
import './App.less'

interface IState {
  name: string
}

interface IProps {
  appName: 'react ts template'
}

export default class App extends Component<IProps, IState> {
  constructor (props: IProps) {
    super(props)
    this.state = {
      name: 'app',
    }
  }

  onClick = () => {
    console.log('测试点击')
  }

  render () {
    return (
      <>
        <div className="test">
          {/* this is react template with typescript.
          <button onClick={this.onClick}>点击试试</button>
          <Home />
          <Index /> */}
          {/* 根据webpack-dev-server static静态资源目录访问 */}
          {/* <img src="/bizhi.jpg" alt="" /> */}

          {/* 使用图片打包 */}
          {/* <img src={bizhi} alt="" /> */}
          <Drag />
        </div>
      </>
    )
  }
}
