import React from 'react';
import WebSocketForOLEditor from './WebSocketForOLEditor';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

class QuillEditor extends React.Component{
  constructor(props){
    super(props);
    this.delta = null;
    this.editor = null;
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.webSocket = WebSocketForOLEditor.createSocket(this.props.userId,this.props.fileId,this.handleMessage);
  }
  componentDidMount(){
    const options = {
      debug: "warn",
      theme: "snow"
    };
    this.editor = new Quill("#editor",options);
    this.editor.on('text-change',this.handleTextChange);
    this.delta = this.editor.getContents();
  }
  handleTextChange(delta,oldDelta,source){
    if(source==='user') {
      if(this.webSocket.readyState===this.webSocket.OPEN){
        let message = {
          ops:delta['ops'],
          fileId:this.props.fileId,
          userId:this.props.userId,
          fileType:'word'
        };
        this.webSocket.send(JSON.stringify(message));
      }
    }
  }
  handleMessage(evt){
    let message = JSON.parse(evt.data);
    if(message['userId']===this.props.userId){
      console.log(message['userId']+","+this.props.userId);
      return;
    }
    let currentContent = this.editor.getContents();
    console.log(currentContent);
    if(message.hasOwnProperty('message')) {
      let ops = JSON.parse(message['message']);

      ops.forEach((item,index)=>{

      });
      this.editor.updateContents(ops);
    }


  }
  render(){
    return(
      <div id="editor"/>
    )
  }

}


export default QuillEditor;
