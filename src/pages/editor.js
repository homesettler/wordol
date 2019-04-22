import React from 'react';
import QuillEditor from '../component/QuillEditor';
class Editor extends React.Component{
      render(){
        let userId = this.props.match.params.userId;
        let fileId = this.props.match.params.fileId;
        return(
          <QuillEditor userId={userId} fileId={fileId}/>
        )
      }
}

export default Editor;
