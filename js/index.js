
var config = {
    syncURL: "https://wd0544256450dbzuhp.wilddogio.com/" //输入节点 URL
  };
  wilddog.initializeApp(config);

  //灯光状态
  var ref = wilddog.sync().ref('/devices/light/light1/status');

  var phoneuid = wilddog.sync().ref('/devices/video/phoneuid');
  phoneuid.on('value',function(data){
    localStorage.phoneuid = data.val()
    console.log(localStorage.phoneuid)
  })
  
   //气体监测
 var air = wilddog.sync().ref('/devices/airCleaner');
 var air1 = wilddog.sync().ref('/devices/airCleaner/pm/value');
 
  // snapshot 里面的数据会一直和云端保持同步
ref.on('value',function(snapshot) {
    if(snapshot.val()  == 'on-self' || snapshot.val() == 'on-remote'){
       $('.light-control').addClass('active')    
    }else{      
        $('.light-control').removeClass('active')                
    }
});

var alert_sign = false
air.on('value',function(snapshot){
    var data = snapshot.val();
    var gas_value = Number(data.gas.value)
    var smoke_value = Number(data.smoke.value)
    var methanal_status = Number(data.methanal.value)
    var pm_value = Number(data.pm.value)
    if(gas_value >=100 || smoke_value >=1000 || methanal_status >=50 || pm_value >= 10){
        warning(true)
        if((pm_value >= 10) && (gas_value >=100 || smoke_value >=1000 || methanal_status >=50) && !alert_sign){
            $.alert({
                title: '警告',
                text: '检测到室内<span class="gas_tip">有害气体</span>和<span class="gas_tip">PM2.5</span>超标<br/>请立即前往开启相关净化装置',
              });
              alert_sign = true
        }else if(pm_value >= 10 && !alert_sign){
            $.alert({
                title: '警告',
                text: '检测到室内<span class="gas_tip">PM2.5</span>超标<br/>请立即前往开启相关净化装置',
                onOK: function(text){
                    // air1.set('10')
                }
              });
              alert_sign = true              
        }else if(!alert_sign){
            $.alert({
                title: '警告',
                text: '检测到室内<span class="gas_tip">有害气体</span>超标<br/>请立即前往开启相关净化装置',
              });
              alert_sign = true              
        }
    }else{
        warning(false)
        alert_sign = false
    }
})

ref.onDisconnect().set("close-remote");

$('.light-control').click(function(){
    event.preventDefault();
    if($('.light-control').hasClass('active')){
        ref.set('off-remote');
    }else{
        ref.set('on-remote');
    }
})

var timer
function warning(clear){
    if(timer){
    clearInterval(timer)    
    }
    if(clear){
        timer = setInterval(function(){
            $('.warn-control').toggleClass('active')
        },500)
    }
    if(!clear){
        clearInterval(timer)
        $('.warn-control').removeClass('active') 
    }
}