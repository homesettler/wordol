class WebSocketForOLEditor{
  static createSocket(userId,fileId,handleMessage,handleStateChange){
    let webSocket;
    if("WebSocket" in window) {
      //let newUrl = "ws://192.168.1.139:8080/word/"+userId+"/"+fileId;
      let newUrl = "ws://192.168.1.124:8080/word/"+userId+"/"+fileId;
      webSocket = new WebSocket(newUrl);
      webSocket.onerror = ()=>{
        console.log("error")
      };
      webSocket.onopen = ()=>{
        console.log("open")
      };
      webSocket.onmessage = (evt)=>{
        handleMessage(evt);
      };
      webSocket.onclose = ()=>{
        console.log("close")
      };
    }
    else {
      alert("浏览器不支持WebSocket");
    }
    return webSocket;
  }
}
export default WebSocketForOLEditor;
