import React from 'react'
import {Select,Row,Col} from 'antd'
import 'draft-js/dist/Draft.css'
import {Editor,EditorState,RichUtils,Modifier,SelectionState} from 'draft-js'
import WebSocketForOLEditor from './WebSocketForOLEditor'
import InlineStyleButton from '@/component/module/InlineStyleButton';
import Delta from './module/Delta';

class OLEditor extends React.Component{
  constructor(props){
    super(props);
    this.state={
      editorState:EditorState.createEmpty(),
      userSelections:{}
    };
    this.webSocket = WebSocketForOLEditor.createSocket(this.props.userId,this.props.fileId);
    this.delta = new Delta();
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.onChange = this.onEditorChange.bind(this);
  }

  onEditorChange(newEditorState){
    let lastEditorState = this.state.editorState;
    this.setState({editorState:newEditorState});
    if(lastEditorState.getCurrentContent().getBlockMap() === newEditorState.getCurrentContent().getBlockMap()){
      if(lastEditorState.getSelection()=== newEditorState.getSelection()){
        return;
      }
      else{
        this.delta.select(newEditorState);
      }
    }
    let lastChangeType = newEditorState.getLastChangeType();
    switch(lastChangeType){
      case 'insert-characters':
        this.delta.insert(lastEditorState,newEditorState);
        break;
      default:
        console.log(lastChangeType);
    }
  }
  toggleInlineStyle(styleType){
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState,styleType))
  }
  toggleBlockType(blockType){
    this.onChange(RichUtils.toggleBlockType(this.state.editorState,blockType))
  }

  render(){
    return(
      <div>
        <Row>
          <Col span={2}>
            <Select
              size={"large"} style={{float:'center',width:'100%',height:'100%'}}
              defaultValue="text" dropdownMatchSelectWidth={true}
              onSelect={(value)=>{
                switch(value){
                  case 'Header1':return this.toggleBlockType('header-one');
                  case 'Header2':return this.toggleBlockType('header-two');
                  case 'Header3':return this.toggleBlockType('header-three');
                  case 'Header4':return this.toggleBlockType('header-four');
                  case 'Header5':return this.toggleBlockType('header-five');
                  default: return this.toggleBlockType('unstyled');
                }
              }}
            >
              <Select.Option value="text">正文</Select.Option>
              <Select.Option value="Header1"><h1>标题1</h1></Select.Option>
              <Select.Option value="Header2"><h2>标题2</h2></Select.Option>
              <Select.Option value="Header3"><h3>标题3</h3></Select.Option>
              <Select.Option value="Header4"><h4>标题4</h4></Select.Option>
              <Select.Option value="Header5"><h5>标题5</h5></Select.Option>
            </Select>
          </Col>
          <Col span={1}>
            <InlineStyleButton
              styleType={'bold'}
              onClick={()=>{
                this.toggleInlineStyle('BOLD');
              }}
            />
          </Col>
          <Col span={1}>
            <InlineStyleButton
              styleType={'italic'}
              onClick={()=>{
                this.toggleInlineStyle('ITALIC');
              }}
            />
          </Col>
          <Col span={1}>
            <InlineStyleButton
              styleType={'underline'}
              onClick={()=>{
                this.toggleInlineStyle('UNDERLINE');
              }}
            />
          </Col>
        </Row>
        <Row>
          <div className="editor">
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              //handleKeyCommand={this.handleKeyCommand}

            />
          </div>
        </Row>
      </div>
    )
  }

}
export default OLEditor;
