import React from 'react'
import styles from './style.css'
import Button from '../button'
import {connect} from 'dva'
import Contextmenu from '../contextmenu'

class Toolbar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleHighlight = this.handleHighlight.bind(this)
    this.handleAddStickyNode = this.handleAddStickyNode.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.state = {
      mode: 'none'
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'highlight/toolbarOn',
      payload: { toolbarOn: 1 }
    })
  }

  handleHighlight(event) {
    this.setState({mode: 'highlight'})
    document.body.addEventListener('mouseup', this.handleMouseup)
  }

  handleAddStickyNode() {
    this.setState({mode: 'addnode'})
  }

  handleMouseup() {
    let win = event.view
    let selection = win.getSelection()
    if (selection.isCollapsed) {
      console.log("selection.isCollapsed")
    }

    let range = selection.getRangeAt(0)
    if (!range.collapsed) {
      let commonAncestorNode = range.commonAncestorContainer
      if (!commonAncestorNode) {
        console.log("commonAncestorNode is undefind")
      }
      // nodeChain
      let commonAncestorElement = commonAncestorNode
      let highlightText = {}
      let nodeChain = []

      while (commonAncestorElement.nodeType !== Node.ELEMENT_NODE) {
        commonAncestorElement = commonAncestorElement.parentNode
        if (!commonAncestorElement) {
          console.log("commonAncestorElement is undefind")
        }
      }
      let i = 0
      while (commonAncestorElement.parentNode) {
        nodeChain[i] = new String()
        nodeChain[i] = commonAncestorElement.nodeName.toLocaleLowerCase()
        if (commonAncestorElement.id) {
          nodeChain[i] = nodeChain[i] + "#" + commonAncestorElement.id
        }
        if (commonAncestorElement.classList.value) {
          commonAncestorElement.classList.forEach(className => nodeChain[i] = nodeChain[i] + "." + className)
        }
        commonAncestorElement = commonAncestorElement.parentNode
        i = i + 1
      }
      highlightText.nodeChain = nodeChain
      // comtent,fhtno,lhtno

      let nodeComment = []

      if (commonAncestorNode.nodeType === Node.TEXT_NODE) {
        highlightText.startOffset = range.startOffset
        highlightText.endOffset = range.endOffset
        nodeComment = commonAncestorNode.nodeValue
        // highlightText.content = nodeComment.slice(nodeComment.indexOf(highlightText.startOffset),nodeComment.indexOf(highlightText.endOffset))
        highlightText.content = range.toString()
      }

      // id
      highlightText.id = (Date.now()).toString(32)

      // data
      let myDate = new Date()
      highlightText.date = myDate.toLocaleString()
      console.log(highlightText)


      // comments

      // dispatch
      this.props.dispatch({
        type: 'highlight/save',
        payload: {
          [highlightText.id]: highlightText
        }
      })
    }
  }

  render() {
    // TODO: 渲染工具栏
    return (
      <div className={styles.toolbar}>
        <Button onClick={this.handleHighlight}>
          高亮文本
        </Button>
        <Button onClick={this.handleAddStickyNode}>
          添加注释
        </Button>
        <Contextmenu/>
      </div>
    )
  }
}

export default connect()(Toolbar)
