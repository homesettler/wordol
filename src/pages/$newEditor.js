import React,{Component} from 'react';
import {Editor,RichUtils} from 'draft-js';
import {Row,Col,Select} from 'antd';
import { connect } from 'dva';
import InlineStyleButton from '../component/module/InlineStyleButton';

const mapStateToProps = (state)=> {
    return{
        editorState:state.simpleEditor.editorState,
        //webSocket:state.simpleEditor.webSocket
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        updateEditorState:(newEditorState)=>{
            dispatch({
                type:"simpleEditor/updateEditorState",
                payload:newEditorState
            })
        }
    }
}

@connect(mapStateToProps,mapDispatchToProps)
class SimpleEditor extends Component{
    constructor(props){
        super(props);
        this.onChange = this.onEditorChange.bind(this);
        this.toggleInlieStyle = this.toggleInlineStyle.bind(this);
        this.toggleBlockType = this.toggleBlockType.bind(this);
    }

    onEditorChange(newEditorState){
        this.props.updateEditorState(newEditorState);
    }

    toggleInlineStyle(inlineType){
        this.onChange(RichUtils.toggleInlineStyle(this.props.editorState,inlineType));
    }
    toggleBlockType(blockType){
        this.onChange(RichUtils.toggleBlockType(this.props.editorState,blockType));
    }


    render(){
        return(
            <div>
                <Row>
                    <Col span={2}>
                        <Select
                            size ={"large"}
                            style = {{flat:'center',width:'100%',height:'100%'}}
                            defaultValue="text" dropdownMatchSelectWidth={true}
                            onSelect={(value)=>{
                                switch(value){
                                    case 'Header1':return this.toggleBlockType('header-one');
                                    case 'Header2':return this.toggleBlockType('header-two');
                                    case 'Header3':return this.toggleBlockType('header-three');
                                    case 'Header4':return this.toggleBlockType('header-four');
                                    case 'Header5':return this.toggleBlockType('header-five');
                                    case 'Header6':return this.toggleBlockType('header-six');
                                    case 'text':return this.toggleBlockType('unstyled');
                                    default: return null;
                                }
                            }}
                        >
                            <Select.Option value="text">正文</Select.Option>
                            <Select.Option value="Header1"><h1>标题1</h1></Select.Option>
                            <Select.Option value="Header2"><h2>标题2</h2></Select.Option>
                            <Select.Option value="Header3"><h3>标题3</h3></Select.Option>
                            <Select.Option value="Header4"><h4>标题4</h4></Select.Option>
                            <Select.Option value="Header5"><h5>标题5</h5></Select.Option>
                            <Select.Option value="Header6"><h6>标题6</h6></Select.Option>
                        </Select>
                    </Col>
                    <Col span={1}>
                        <InlineStyleButton
                            styleType = {'bold'}
                            onClick={()=>{
                                this.toggleInlineStyle('BOLD');
                            }}
                        />
                    </Col>
                    <Col span={1}>
                        <InlineStyleButton
                            styleType = {'italic'}
                            onClick={()=>{
                                this.toggleInlieStyle('ITALIC');
                            }}
                        />
                    </Col>
                    <Col span={1}>
                        <InlineStyleButton
                            styleType={'underline'}
                            onClick={()=>{
                                this.toggleInlieStyle('UNDERLINE');
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <div className="editor">
                            <Editor
                                editorState={this.props.editorState}
                                onChange={this.onChange}
                            />
                    </div>
                </Row>
            </div>
        );
    }
}

export default SimpleEditor;