$(document).ready(function() {

  

    var temChart = Highcharts.chart('temChart',{
        chart:{
            // event:st1()
            height:'200px',
            marginRight:20,            
        },
        colors:['#50B432'],
        title:{
            text: '室内温度',
            style:{color:'#50B432'} 
          },
          xAxis:{
            id:'xA1',
           categories: [],
           labels: {
            step: 5
           },
          },
          yAxis:{
           title: {
               text: 'Temperature (\xB0C)'
            },
            tickAmount: 5
          },
          plotOptions:{
           line: {
               dataLabels: {
                  enabled: true
               },   
               enableMouseTracking: false
            }
          },
          legend:{
           enabled:false
          },
          credits:{
            enabled: false
          },
          series:[
           {
             id:'exSeries1',
             data: []
           } 
          ]
    })
    var humChart = Highcharts.chart('humChart',{
        chart:{
            height:'200px',
            marginRight:20,            
        },
        colors:['#058DC7'],
        title:{
            text: '室内湿度',
            style:{color:'#058DC7'}  
          },
          xAxis:{
            id:'xA2',
            categories: [],
           labels: {
            step: 5
            },
          },
          yAxis:{
           title: {
               text: 'Humidity (%)'
            },
            tickAmount: 5            
          },
          plotOptions:{
           line: {
               dataLabels: {
                  enabled: true
               },   
               enableMouseTracking: false
            }
          },
          legend:{
           enabled:false,         
        },
          credits:{
            enabled: false
          },
          series:[
           {
             id:'exSeries2',
             data: []
           } 
          ]
    })

    var exSeries1 = temChart.get('exSeries1')
    var xA1 = temChart.get('xA1')
    var exSeries2 = humChart.get('exSeries2')
    var xA2 = humChart.get('xA2')
    var data1 = []
    var categories1 = []
    var categories2 = []
    var data2 = []

    var config = {
      syncURL: "https://wd0544256450dbzuhp.wilddogio.com/" //输入节点 URL
    };
    wilddog.initializeApp(config);

    //温湿度实时值
    var hum_value = wilddog.sync().ref('/devices/thController/humidity/value');
    var tem_value = wilddog.sync().ref('/devices/thController/temperature/value');

    //温湿度设置开启状态：on/off
    var tem_status = wilddog.sync().ref('/devices/thController/temperature/status');
    var hum_status = wilddog.sync().ref('/devices/thController/humidity/status');

    //温湿度设置值
    var tem_setting = wilddog.sync().ref('/devices/thController/temperature/setting');
    var hum_setting = wilddog.sync().ref('/devices/thController/humidity/setting');
  


    tem_status.on('value',function(snapshot){
         localStorage.temHum_setting = (snapshot.val() == "on")?1:0;
    })
    tem_setting.on('value',function(snapshot){
      localStorage.tem_slider = snapshot.val() 
    })
    hum_setting.on('value',function(snapshot){
      localStorage.hum_slider = snapshot.val() 
    })

    // snapshot 里面的数据会一直和云端保持同步
    //湿度
  hum_value.on('value',function(snapshot) {
    var time = new Date()
     var x = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
     var y2 = Number(snapshot.val())
     if(data2.length<11){
       data2.push(y2)
       categories2.push(x)
    }
    else{
     data2.shift();
     categories2.shift()
     data2.push(y2)
     categories2.push(x)
   }
   xA2.setCategories(categories2, true, false, false)
   exSeries2.setData(data2, true, false, false);
  });

  //温度
  tem_value.on('value',function(snapshot) {
    var time = new Date()
    var x = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
    var y1 = Number(snapshot.val())
    if(data1.length<11){
      data1.push(y1)
      categories1.push(x)
   }
   else{
    data1.shift();
    categories1.shift()
    data1.push(y1)
    categories1.push(x)
  }
  xA1.setCategories(categories1, true, false, false)
  exSeries1.setData(data1, true, false, false);
  });
      

  $('.save-setting').click(function(){
    var val = $('input[name="temHum"]:checked').val()
    var tem_slider = $('#sliderValue1').text()
    var hum_slider = $('#sliderValue2').text()
    if(val == 1){
      tem_status.set('on')
      hum_status.set('on')
      tem_setting.set(tem_slider) 
      hum_setting.set(hum_slider) 
    }else{
      tem_status.set('off')
      hum_status.set('off')
    }
    $.toast("操作成功",1000);
  })
  
  var tem_slider = Number(localStorage.tem_slider)
  var hum_slider = Number(localStorage.hum_slider)
  $('#sliderTrack1').css('width',tem_slider*2+"%")
  $('#sliderHandler1').css('left',tem_slider*2+"%")
  $('#sliderValue1').text(tem_slider)

  $('#sliderTrack2').css('width',hum_slider+"%")
  $('#sliderHandler2').css('left',hum_slider+"%")
  $('#sliderValue2').text(hum_slider)

  $('#slider1').slider(function(data){
     $('#sliderValue1').text(Math.round(data*0.5))
  })
  $('#slider2').slider()
  
  if(localStorage.temHum_setting == 1){
    $('#temHum-open').prop('checked','checked')  
    $('.temHum-slider').show()
  }else{
    $('#temHum-close').prop('checked','checked')
  }
  
  $('input[name="temHum"]').change(function(){
    var val = $('input[name="temHum"]:checked').val()
    if(val == 1){     
      $('.temHum-slider').slideDown()
    }
    else{    
      $('.temHum-slider').slideUp()
    }
  })

 });