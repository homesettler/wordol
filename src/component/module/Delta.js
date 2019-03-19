import {EditorState} from 'draft-js';

class Delta{
  constructor(props) {
    this.ops = [];
  }
  insert(lastEditorState,newEditorState){
    let lastAnchorOffset = lastEditorState.getSelection()['anchorOffset'];
    let newAnchorOffset = newEditorState.getSelection()['anchorOffset'];
    let newAnchorKey = newEditorState.getSelection()['anchorKey'];
    let text = newEditorState.getCurrentContent().getBlockMap().get(newAnchorKey).get("text");
    let insertStr = text.substring(lastAnchorOffset,newAnchorOffset);
    let inlineStyle = newEditorState.getCurrentInlineStyle();
    this.ops.push({insert:insertStr,attributes:{inlineStyle:inlineStyle}});
    console.log(this.ops);
  }
  delete(){
    this.ops.push({delete:1});
  }
  select(newEditorState){
    this.ops.push(newEditorState.getSelection());
    console.log(this.ops);
  }
}


export default Delta;
