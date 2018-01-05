var gaugeOptions = {
    
        chart: {
            type: 'solidgauge'
        },
    
        title: null,
    
        pane: {
            center: ['50%', '98%'],
            size: '150%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
    
        tooltip: {
            enabled: false
        },
    
        // the value axis
        yAxis: {
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 3,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
    
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };
    
    // 烟雾浓度
    var chartSmoke = Highcharts.chart('container-smoke', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 2000,
            title: {
                text: '烟雾浓度'
            },
            stops: [
                [0.2, '#55BF3B'], // green
                [0.4, '#DDDF0D'], // yellow
                [0.5, '#DF5353'] // red
            ],
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'smoke',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">ppm</span></div>'
            },
        }]
    
    }));
    
    // 煤气浓度
    var chartGas = Highcharts.chart('container-gas', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 200,
            title: {
                text: '煤气浓度'
            },
            stops: [
                [0.2, '#55BF3B'], // green
                [0.4, '#DDDF0D'], // yellow
                [0.5, '#DF5353'] // red
            ],
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'smoke',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">ppm</span></div>'
            },
        }]
    
    }));

    // 甲醛浓度
    var chartMethanal = Highcharts.chart('container-methanal', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: '甲醛浓度'
            },
            stops: [
                [0.2, '#55BF3B'], // green
                [0.4, '#DDDF0D'], // yellow
                [0.5, '#DF5353'] // red
            ],
        },
    
        credits: {
            enabled: false
        },
    
        series: [{
            name: 'smoke',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">ppm</span></div>'
            },
        }]
    }
   ));   
   var config = {
    syncURL: "https://wd0544256450dbzuhp.wilddogio.com/" //输入节点 URL
  };
  wilddog.initializeApp(config);

 //净化开启状态
var gas_status = wilddog.sync().ref('/devices/airCleaner/gas/status');
var smoke_status = wilddog.sync().ref('/devices/airCleaner/smoke/status');
var methanal_status = wilddog.sync().ref('/devices/airCleaner/methanal/status');

 //实时值
 var gas_value = wilddog.sync().ref('/devices/airCleaner/gas/value');
 var smoke_value = wilddog.sync().ref('/devices/airCleaner/smoke/value');
 var methanal_value = wilddog.sync().ref('/devices/airCleaner/methanal/value');

 gas_status.on('value',function(snapshot){
    localStorage.gas_setting = (snapshot.val() == "on")?1:0;
})

    //刷新数据
    gas_value.on('value',function(snapshot){
        var point = chartGas.series[0].points[0];
        point.update(Number(snapshot.val()));
   })
   smoke_value.on('value',function(snapshot){
    var point = chartSmoke.series[0].points[0];
    point.update(Number(snapshot.val()));
})
methanal_value.on('value',function(snapshot){
    var point = chartMethanal.series[0].points[0];
    point.update(Number(snapshot.val()));
})
    

    $('.save-setting').click(function(){
        var val = $('input[name="gas"]:checked').val()
        var status = (val == 1)?"on":"off";
        gas_status.set(status)
        smoke_status.set(status)
        methanal_status.set(status)
        $.toast("操作成功",1000);
    })

    if(localStorage.gas_setting == 1){
        $('#gas-open').prop('checked','checked')  
      }else{
        $('#gas-close').prop('checked','checked')
      }
      