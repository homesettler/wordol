import React from 'react';
import QuillEditor from '../component/QuillEditor';
class Editor extends React.Component{
      render(){
        let path = this.props.location['pathname'];
        let paths = path.toString().split('/');
        return(
          <QuillEditor userId={paths[2]} fileId={paths[3]}/>
        )
      }
}

export default Editor;
