class WebSocketForOLEditor{
  static createSocket(userId,fileId,handleMessage){
    let webSocket;
    if("WebSocket" in window) {
      let newUrl = "ws://localhost:8080/websocket/"+userId+"/"+fileId;
      webSocket = new WebSocket(newUrl);
      webSocket.onerror = this.onError;
      webSocket.onopen = this.onOpen;
      webSocket.onmessage = (evt)=>{
        handleMessage(evt);
      };
      webSocket.onclose = this.onClose;
    }
    else {
      alert("浏览器不支持WebSocket");
    }
    return webSocket;
  }

  static onOpen(){
    console.log("onOpen");
  }
  static onError() {
    console.log("onError");
  }

  static onClose(){
    console.log("onClose");
  }
}
export default WebSocketForOLEditor;
