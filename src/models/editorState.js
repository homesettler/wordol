import {EditorState} from 'draft-js'
import {routerRedux} from 'dva/router'



export default {
  namespace:"simpleEditor",
  state:{
    editorState:EditorState.createEmpty(),
    baseUrl: "ws://localhost:8080/websocket/",
    userId: 0,
    fileId: 0,
    webSocket:null
  },

  subscriptions:{
    connectWebSocket ({dispatch,history}){
      history.listen((location)=>{
        if(location.pathname.indexOf('newEditor')===1){
          let dynamicPath = location.pathname.substring(11);
          let paths = dynamicPath.split('/');
          if(paths.length===2){
            dispatch({
              type:'updateWebSocket',
              payload: paths
            });
            dispatch({
              type:'redirect',
              payload:paths
            });
          }
        }
      })
    }
  },
  effects:{
    *redirect({payload:paths},{put}){
      console.log(paths);
      console.log(paths[0]+"/"+paths[1]);
      yield put(routerRedux.replace("/newEditor/"+paths[0]+"/"+paths[1]));
    }
  },
  reducers:{
    updateEditorState(state,{payload: newEditorState}){
      return{
        ...state,
        editorState: newEditorState
      }
    },
    updateWebSocket(state,{payload:paths}){
      const webSocket = new WebSocket(state.baseUrl+paths[0]+"/"+paths[1]);
      webSocket.onopen = ()=>{
        console.log("onopen");
      };
      webSocket.onclose = ()=>{
        console.log("onclose");
      };
      webSocket.onerror = ()=>{
        console.log("onerror");
      }
      webSocket.onmessage = (msg)=>{
        console.log("接收数据:"+msg.data);
      }
      return{
        ...state,
        webSocket: webSocket,
        userId: paths[0],
        fileId: paths[1]
      }
    },
    addMessageCallBack(state,{payload:callback}){
      let newWebSocket = state.webSocket;
      newWebSocket.onmessage = (evt)=>{
        callback(evt.data);
      };
      return {
        ...state,
        webSocket: newWebSocket
      }
    }
  }
}
