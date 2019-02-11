import React from 'react';
import {Select,Row,Col} from 'antd';
import 'draft-js/dist/Draft.css';
import {Editor,EditorState,RichUtils,Modifier,SelectionState} from 'draft-js';
import './SimpleEditor.css'
import InlineStyleButton from './module/InlineStyleButton';

class SimpleEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            webSocket:null
        };
        this.onChange = this.onEditorChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.cmdStack = [];
    }

    webSocketState = 'onclose';

    onEditorChange(newEditorState){

        let lastEditorState = this.state.editorState;
        this.setState({editorState:newEditorState});

        let lastChangeType = newEditorState.getLastChangeType();

        if(lastEditorState.getCurrentContent().getBlockMap() === newEditorState.getCurrentContent().getBlockMap()){
            return;
        }

        switch(lastChangeType){
            case 'insert-characters':
                console.log('insert characters');
                console.log(newEditorState.getCurrentContent().getBlockMap().toString());
                this.insertCharacters(lastEditorState.getSelection(),newEditorState.getSelection(),newEditorState);
                break;
            case 'backspace-character':
                console.log('backspace character');
                break;
            case 'change-block-type':
                console.log('change block type');
                break;
            case 'adjust-depth':
                console.log('adjust depth');
                break;
            case 'apply-entity':
                console.log('apply entity');
                break;
            case 'change-block-data':
                console.log('change block data');
                break;
            case 'change-inline-style':
                console.log('change inline style');
                break;
            case 'move-block':
                console.log('move block');
                break;
            case 'delete-character':
                console.log('delete character');
                break;
            case 'insert-fragment':
                console.log('insert fragment');
                break;
            case 'redo':
                console.log('redo');
                break;
            case 'remove-range':
                console.log('remove-range');
                break;
            case 'spellcheck-change':
                console.log('spellcheck change');
                break;
            case 'split-block':
                console.log('split block');
                break;
            case 'undo':
                console.log('undo');
                break;
            default:
                console.log(lastChangeType)
        }

    }

    insertCharacters(lastSelection,newSelection,newEditorState) {
        let lastAnchorOffset = lastSelection["anchorOffset"];
        let newAnchorOffset = newSelection["anchorOffset"];
        let newAnchorKey = newSelection["anchorKey"];
        let text = newEditorState.getCurrentContent().getBlockMap().get(newAnchorKey).get("text");
        let insertStr = text.substring(lastAnchorOffset, newAnchorOffset);
        let inlineStyle = newEditorState.getCurrentInlineStyle();
        let cmd = {
            "ops":"insert-characters",
            "text":insertStr,
            "insertLine":this.getBlockIndex(newAnchorKey),
            "insertOffset":lastAnchorOffset,
            "inlineStyle":inlineStyle
        };
        this.sendCmd(JSON.stringify(cmd));
    }

    getBlockIndex(blockKey){
        return this.state.editorState.getCurrentContent().getBlockMap().toList().findIndex(item=>item.key===blockKey);
    };

    getBlockKey(index){

        let list = this.state.editorState.getCurrentContent().getBlockMap().toList();

        return list.toArray()[index]["key"];
    }

    sendCmd(cmd) {
        console.log(this.webSocketState);
        let message = {
            "fileType": "word",
            "fileId": "0",
            "userId": "0",
            "message": cmd
        };
        this.state.webSocket.send(JSON.stringify(message));
    }



    handleKeyCommand(command,editorState){
        const newState = RichUtils.handleKeyCommand(editorState,command);
        if(newState){
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }


    toggleInlineStyle(styleType){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState,styleType));
    }
    toggleBlockType(blockType){
        this.onChange(RichUtils.toggleBlockType(this.state.editorState,blockType));
    }
    componentDidMount() {
        this.setState({webSocket:this.connect(0,0)});
    }

    connect(userId,fileId){
        let webSocket;
        if("WebSocket" in window) {
            let newUrl = "ws://localhost:8080/websocket/"+userId+"/"+fileId;
            webSocket = new WebSocket(newUrl);
            webSocket.onerror = this.onError;
            webSocket.onopen = this.onOpen;
            webSocket.onmessage = this.onMessage;
            webSocket.onclose = this.onClose;
        }
        else {
            alert("浏览器不支持WebSocket");
        }
        return webSocket;
    }

    onOpen(){
        console.log("websocket:"+"onopen");
        this.webSocketState = 'onopen';

    }

    onError(){
        console.log("websocket:"+"onerror");
        this.webSocketState = 'onerror';
    }

    onClose(){
        console.log("websocket:"+"onclose");
        this.webSocketState = 'onclose';
    }

    onMessage(evt){
        console.log("接收的数据:" + evt.data);
        let message = JSON.parse(evt.data);
        if(message["Type"]==="open"){
            this.onFileOpen(message["textMessage"]);
        }

        if(message["userId"] === "0")
        {
            //console.log("这是我自己");
        }
    }

    onFileOpen(textMessage){
        textMessage.forEach((message)=>{
            let cmd = JSON.parse(message);

            switch(cmd["ops"]){
                case "insert-characters":
                    this.insertText(cmd["text"],cmd["insertLine"],cmd["insertOffset"],cmd["inlineStyle"]);
                    return;
                default:
                    console.log();
                    return;
            }
        })

    }

    insertText(text,insertLine,insertOffset,inlineStyle){

        let selectionState = new SelectionState();
        selectionState = selectionState.set('anchorKey',this.getBlockKey(parseInt(insertLine)));
        selectionState =selectionState.set('anchorOffset',parseInt(insertOffset));
        selectionState =selectionState.set('focusKey',this.getBlockKey(parseInt(insertLine)));
        selectionState = selectionState.set('focusOffset',parseInt(insertOffset));
        selectionState =selectionState.set('isBackward',false);
        selectionState =selectionState.set('hasFocus',true);
        let newEditorState = this.state.editorState;

        let newContentState = newEditorState.getCurrentContent();


        newContentState = Modifier.insertText(
            newContentState,
            selectionState,
            text,
            inlineStyle
        );
        newEditorState = EditorState.set(newEditorState,{currentContent:newContentState});
        this.setState({editorState:newEditorState});
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
                            handleKeyCommand={this.handleKeyCommand}
                            handleBeforeInput={this.handleBeforeInput}
                            handlePastedText={this.handlePastedText}
                         />
                    </div>
                </Row>
                <Row>

                </Row>
            </div>
        )
    }
}
export default SimpleEditor;