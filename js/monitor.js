// var videoInstance
//初始化 Wilddog Auth
var node = document.getElementById('monitor')
var config = {
    authDomain: "wd8836996470ohdrzz.wilddog.com",

};
wilddog.initializeApp(config);

// var getUid = wilddog.sync().ref('/devices/video/phoneuid');
// 初始化 WilddogVideoCall 之前，要先经过身份认证。这里采用匿名登录的方式。推荐使用其他登录方式。
wilddog.auth().signInAnonymously()
.then(function(user){
    //认证成功后，初始化 WilddogVideoCall
    wilddogVideo.initialize({'appId':'wd8836996470ohdrzz','token':user.getToken()})
    //获取 `WilddogVideoCall` 实例
    videoInstance = wilddogVideo.call();
}).then(function() {
    //监听收到的请求
    videoInstance.on('called',function(conversation) {
        console.log(conversation);
    });
    videoInstance.on('token_error',function() {
        console.log('token不合法或过期');
    });
}).catch(function (error) {
    // Handle Errors here.
    console.log(error)
})

//监听收到的邀请
// videoInstance.on('called',function(conversation) {
//     //通过回调函数获取到Conversation对象
//     console.log(conversation);
//   })
//   videoInstance.on('token_error',function() {
//     console.log('token不合法或过期');
//   })

  //使用 call() 来发起一对一视频通话请求
//   getUid.on('value',function(data){
//     var remoteUid = data.val();
//     mConversation = videoInstance.call(remoteUid,localStream,{'data':'userData'});
//   })
wilddogVideo.createLocalStream({
    captureAudio: true,
    captureVideo: true,
    dimension: '120p'
})
.then(function(localStream){
    mConversation = videoInstance.call(localStorage.phoneuid,localStream,{'data':'userData'});
    console.log(localStorage.phoneuid)
    mConversation.on('response', function(callStatus){
        switch (callStatus) {
            case 'ACCEPTED':
                console.log('accepted');
                break;
            case 'REJECTED':
                console.log('rejected');
                break;
            case 'BUSY':
                console.log('busy');
                break;
            case 'TIMEOUT':
                console.log('timeout');
                break;
            default:
                console.log('状态未识别');
                break;
        }
    });
        
         
           //被邀请的用户通过 videoInstance.on('called',callback) 事件收到 Conversation 实例，
           //使用 accept（） 方法接收一对一视频通话：
        //    videoInstance.on('called',function(conversation){
        //        mConversation = conversation;
        //        mConversation.accept(localStream).then(function(conversation) {
        //          //被叫方获取到的Conversation对象,接受邀请成功，加入一对一视频通话
        //        });
        //    })
         
         
           //一对一视频通话链接成功后，通话双方会通过 mConversation.on('stream_received',callback) 事件收到 RemoteStream 实例，
           //使用 attach() 方法将远端媒体流放入 video 标签中播放：
          
           mConversation.on('stream_received',function(remoteStream) {
               // 设置不播放媒体流的音频。
               remoteStream.enableAudio(false);
               //将远端流放入video标签中

               remoteStream.attach(node);
           })
})
.catch(function(err){
    console.log("Catch error! Error code is " + err);
})

 