
class WebSocketUtil{

  static messageList =[];
  static recvList = [];
  static webSocket = null;
  static baseUrl = "";
  static userId = 0;
  static fileId = 0;
  static connectToServer(url,userId,fileId){
    console.log("url = "+url);
    this.baseUrl = url;
    this.userId = userId;
    this.fileId = fileId;
    let newUrl = this.baseUrl+"/"+this.userId+"/"+this.fileId;
    let webSocket = new WebSocket(newUrl);
    webSocket.onopen = this.onopen;
    webSocket.onclose = this.onclose;
    webSocket.onerror = this.onerror;
    webSocket.onmessage = this.onMessage;
    this.webSocket = webSocket;
  }
  static onopen(){
    console.log("connected");
  }
  static onMessage = (data)=>{
    console.log("before initialize");
  };


  static getOnMessage(callback){
    this.onMessage = (data)=>{
      callback(data);
    }
  }

  static onclose(){
    console.log("close connect");

  }
  static onerror(){
    console.log("connect error");
  }
  static sendMessage(msg){
    let message = {
      "fileType":"word",
      "fileId":"0",
      "userId":"0",
      "message":msg
    };
    this.messageList.push(JSON.stringify(message));
    switch(this.webSocket.readyState){
      case this.webSocket.OPEN:
        while (this.messageList.length>0){
          if(this.webSocket.readyState===this.webSocket.OPEN){
            this.webSocket.send(this.messageList[0]);
            this.messageList.splice(0,1);
          }
          else{
            break;
          }
        }
        break;
      case this.webSocket.CLOSED:
        break;
      case this.webSocket.CLOSING:
        break;
      case this.webSocket.CONNECTING:
        break;
      default:
        break;
    }

  }
}
export default WebSocketUtil;