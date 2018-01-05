$(document).ready(function() {
      var options = {
          chart: {
              renderTo: 'pmChart',
              marginRight:20,
          },
          colors:['#ED561B'],
          title: {
              text: '室内PM2.5',
              style:{color:'#ED561B'}
          },
          credits: {
              enabled: false
          },
          xAxis: {
              id:'xA',
            //   tickInterval :14, 
            labels: {
                step: 5
            },
          },
          yAxis: {
              title: {
                  text: 'PM2.5 (μg/m3)'
              },
              tickAmount: 10
          },
          plotOptions:{
                       line: {
                           dataLabels: {
                              enabled: true
                           },   
                           enableMouseTracking: false
                        }
                        
                      },
          legend: {
              enabled: false
          },
          exporting: {
              enabled: false
          },
          series: [{
            id   : 'exSeries', // id声明为exSeries 
              data:[]
          }]
      };
     
      var config = {
        syncURL: "https://wd0544256450dbzuhp.wilddogio.com/" //输入节点 URL
      };
      wilddog.initializeApp(config);

     //pm2.5净化开启状态
    var pm_status = wilddog.sync().ref('/devices/airCleaner/pm/status');

     //pm2.5实时值
    var pm_value = wilddog.sync().ref('/devices/airCleaner/pm/value');

    pm_status.on('value',function(snapshot){
        localStorage.pm_setting = (snapshot.val() == "on")?1:0;
   })
    
      chart = new Highcharts.Chart(options);
      var exSeries = chart.get('exSeries')
      var xA = chart.get('xA')
      var data = []
      var categories = []

      pm_value.on('value',function(snapshot) {
        var time = new Date()
        var x = time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()
        var y = Number(snapshot.val())
        if(data.length<11){
            data.push(y)
            categories.push(x)
        }
        else{
          data.shift();
          categories.shift()
          data.push(y)
          categories.push(x)
        }
      xA.setCategories(categories, true, false, false)
      exSeries.setData(data, true, false, false);
     });

    $('.save-setting').click(function(){
        var val = $('input[name="pm"]:checked').val()
        var status = (val == 1)?"on":"off";
        pm_status.set(status)
        $.toast("操作成功",1000);
    })

    if(localStorage.pm_setting == 1){
        $('#pm-open').prop('checked','checked')  
      }else{
        $('#pm-close').prop('checked','checked')
      }

      });