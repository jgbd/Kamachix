
/*
  Esta funcion grafica datos en columna
  donde
  * data es los datos en un json
  * content_name es el nombre de la divicion contenedora
  * title es el titulo de la grafica
  * namecolumn es el nombre de las columnas
  * namerows es el nombre de las fillAlphas
  estos dos ultimos valores se tomande a cuerdo al nombre de los atributos de cada objeto en el el json

  todos los objetos en el json tienen un atributo color
*/

//crear variable global a todas las funciones


var menu_export = [ {
  "class": "export-main",
  "menu": ["JPG"]
}];

// #62B7F2
function columnGraph(data, content_name, title, namecolumn, namerows, depth3D, angle){
  // alert(JSON.stringify(data));
  var chart = AmCharts.makeChart(content_name, {
    "type": "serial",
    "theme": "light",
    "marginRight": 70,
    "dataProvider": data,
    "autoResize":false,
    // "backgroundAlpha":0.10, //se usa para decir la opasidad el fondo de la grafica
    // "backgroundColor":"#000000", //se define el color de fondo de la grafica
    "valueAxes": [{
      "axisAlpha": 0,
      "position": "left",
      "title": title,
      // "color":"#02f14e", //controla el color de las label del eje Y
      // "titleColor":"#02f14e", //contola el color del titulo de la grafica
      //  "gridAlpha":0.40, //opasidad de las lineas horizontales
      //  "gridColor":"#de05f2", //color de las lineas horizontales
    }],
    "startDuration": 1,
    "graphs": [{
      "balloonText": "<b>[[category]]: [[value]]</b>",
      // "fillColors": "#de75f2", //controla el colorr de fondo de cad columna delas graficas
      "fillAlphas": 0.9,
      "lineAlpha": 0.2,
      "type": "column",
      "topRadius":1,
      "valueField": namerows,
    }],
    "depth3D": depth3D,
    "angle": angle,
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": true
    },
    "categoryField": namecolumn,
    "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 45,
      // "color":"#de05f2",
      // "gridAlpha": 0.40,
      // "gridColor": "#de05f2",
    },
    "export": {
      "enabled": true,
      "menu": menu_export
    }
  });
}

/*
  Funcion que grafica a dos columnas
  * data es un Json con 4 campos los datos para la columnas y
    los dos valores que existan para esta, mas color
  * content_name es el id de la division que contendra la grafica
  * title es el titulo de la grafica
  * namecolumn es el nombre de las columnas
  * namerow1 el el primer valor por columna
  * namerow2 es el segundo valor por columna
  * depth3d y angle son los valores que definen profundidad
*/
function columnTwoGraph(data, content_name, title, namecolumn, namerow1, namerow2, depth3D, angle, legen1, legen2 ){
  $("#"+content_name).empty();
  var chart = AmCharts.makeChart(content_name, {
    "type": "serial",
    "theme": "chalk",
    "marginRight": 70,
    "dataProvider": data,
    "legend": {
      "equalWidths": true,
      "periodValueText": "[[value]]",
      "position": "bottom",
      "valueAlign": "left",
      "valueWidth": 20
    },
    "valueAxes": [{
      "axisAlpha": 0,
      "position": "left",
      "title": title
    }],
    "startDuration": 1,
    "graphs": [{
      "balloonText": "<b>" + legen1 + ": [[value]]</b>",
      "fillColorsField": "color",
      "id":"gr1",
      "fillAlphas": 0.9,
      "lineAlpha": 0.2,
      "type": "column",
      "title":legen1,
      "valueField": namerow1
    },{
      "balloonText": "<b>" + legen2 + ": [[value]]</b>",
      "fillColorsField": "color",
      "id":"gr2",
      "fillAlphas": 0.9,
      "lineAlpha": 0.2,
      "type": "column",
      "title":legen2,
      "valueField": namerow2,
    }
    ],
    "depth3D": depth3D,
    "angle": angle,
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": true
    },
    "categoryField": namecolumn,
    "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 5
    },
    "export": {
      "enabled": true,
      "menu": menu_export
    }
  });
}

//Grafica de linea simple
/*
  * data es un json con los datos
  * contentname division contenedora
  * title es el titulo de la grafica
  * namecolumn es el nombre de las columnas
  * namerows el el primer valor por columna
*/
function lineGraph(data, contentname, title, namecolumn, namerows ){
    var chart = AmCharts.makeChart(contentname, {
    "type": "serial",
    "theme": "light",
    "titles":[{"text":title}],
    "marginRight": 40,
    "marginLeft": 40,
    "autoMarginOffset": 20,
    "mouseWheelZoomEnabled":true,
    "valueAxes": [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth":true
    }],
    "balloon": {
        "borderThickness": 1,
        "shadowAlpha": 0
    },
    "graphs": [{
        "id": "g1",
        "balloon":{
          "drop":true,
          "adjustBorderColor":true,
          "color":"color"
        },
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "color",
        "bulletSize": 5,
        "hideBulletsCount": 50,
        "lineThickness": 2,
        "title": title,
        "useLineColorForBulletBorder": true,
        "valueField": namerows,
        "balloonText": "<span style='font-size:10px;'>[[value]]</span>"
    }],
    "chartScrollbar": {
        "graph": "g1",
        "oppositeAxis":false,
        "offset":30,
        "scrollbarHeight": 30,
        "backgroundAlpha": 0,
        "selectedBackgroundAlpha": 0.1,
        "selectedBackgroundColor": "color",
        "graphFillAlpha": 0,
        "graphLineAlpha": 0.5,
        "selectedGraphFillAlpha": 0,
        "selectedGraphLineAlpha": 1,
        "autoGridCount":true,
        "color":"color"
    },
    "chartCursor": {
        "pan": true,
        "valueLineEnabled": true,
        "valueLineBalloonEnabled": true,
        "cursorAlpha":1,
        "cursorColor":"#a22aaa",
        "limitToGraph":"g1",
        "valueLineAlpha":0.2,
        "valueZoomable":true
    },
    "valueScrollbar":{
      "oppositeAxis":false,
      "offset":50,
      "scrollbarHeight":5
    },
    "categoryField": namecolumn,
    "categoryAxis": {
        "dashLength": 1,
        "minorGridEnabled": true,
    },
    "export": {
        "enabled": true,
        "menu": menu_export
    },
    "dataProvider": data
  });

  chart.addListener("rendered", zoomChart);

  zoomChart();
  function zoomChart() {
    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }

}

//doble line
function lineTwoGraph(data, contentname, title, namecolumn, namerow1, namerow2, legen1, legen2 ){
    $("#"+contentname).empty();
    var chart = AmCharts.makeChart(contentname, {
      "type": "serial",
      "theme": "chalk",
      "titles":[{"text":title}],
      "marginRight": 40,
      "marginLeft": 40,
      "autoMarginOffset": 20,
      "mouseWheelZoomEnabled":true,
      "legend": {
        "equalWidths": true,
        "periodValueText": "[[value]]",
        "position": "bottom",
        "valueAlign": "left",
        "valueWidth": 20
      },
      "valueAxes": [{
          "id": "v1",
          "axisAlpha": 0,
          "position": "left",
          "ignoreAxisWidth":true
      }],
      "balloon": {
          "borderThickness": 1,
          "shadowAlpha": 0
      },
      "graphs": [{
          "id": "g1",
          "balloon":{
            "drop":false,
            "adjustBorderColor":true,
            "color":"#000000"
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "bulletSize": 3,
          "hideBulletsCount": 30,
          "lineThickness": 2,
          "title": legen1,
          "useLineColorForBulletBorder": true,
          "valueField": namerow1,
          "balloonText": "<span style='font-size:10px;'>[[value]]</span>"
      },{
          "id": "g2",
          "balloon":{
            "drop":false,
            "adjustBorderColor":true,
            "color":"#000000"
          },
          "bullet": "round",
          "bulletBorderAlpha": 1,
          "bulletColor": "#FFFFFF",
          "bulletSize": 3,
          "hideBulletsCount": 30,
          "lineThickness": 2,
          "title": legen2,
          "useLineColorForBulletBorder": true,
          "valueField": namerow2,
          "balloonText": "<span style='font-size:10px;'>[[value]]</span>"
      }],
      "chartScrollbar": {
          "graph": "g1",
          "oppositeAxis":false,
          "offset":30,
          "scrollbarHeight": 20,
          "backgroundAlpha": 0,
          "selectedBackgroundAlpha": 0.1,
          "selectedBackgroundColor": "#888888",
          "graphFillAlpha": 0,
          "graphLineAlpha": 0.5,
          "selectedGraphFillAlpha": 0,
          "selectedGraphLineAlpha": 1,
          "autoGridCount":true,
          "color":"#AAAAAA"
      },
      "chartCursor": {
          "pan": true,
          "valueLineEnabled": true,
          "valueLineBalloonEnabled": true,
          "cursorAlpha":1,
          "cursorColor":"#258cbb",
          "limitToGraph":"g1",
          "valueLineAlpha":0.2,
          "valueZoomable":true
      },
      "valueScrollbar":{
        "oppositeAxis":false,
        "offset":50,
        "scrollbarHeight":5
      },
      "categoryField": namecolumn,
      "categoryAxis": {
          "dashLength": 1,
          "minorGridEnabled": true
      },
      "export": {
          "enabled": true,
          "menu": menu_export
      },
      "dataProvider":data
  });
  //permite realizar zoon en la grafica
  chart.addListener("rendered", zoomChart);

  zoomChart();

  function zoomChart() {
      chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
  }
}

//Grafica de Acelerometro simple recive el dato , la div contenedora y los tre scolores con ter letras
//'g' verde, 'y' amarillo y 'r' rojo
function gaugesGraph(data,contentName, co1, co2, co3, soso, goal, title, symbol ){
    var col = ["#84b761","#fdd400","#cc4748"];
    var c1,c2,c3;
    //comprueba que los colores no sean iguales
    if(co1!=co2 && co2!=co3 && co1!=co3){
      //asigna color segun envio primer intervalo
      if(co1=='g') c1=col[0];
      else if (co1=='y') c1=col[1];
      else c1=col[2];
      //asigna color segundo intervalo
      if(co2=='g') c2=col[0];
      else if (co2=='y') c2=col[1];
      else c2=col[2];
      //asigna color tercer intervalo
      if(co3=='g') c3=col[0];
      else if (co3=='y') c3=col[1];
      else c3=col[2];
    }else{
      c1=col[0];
      c2=col[0];
      c3=col[0];
    }

    var gaugeChart = AmCharts.makeChart( contentName, {
      "type": "gauge",
      "theme": "chalk",
      "titles": [{"text":title}],
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "gridInside": true,
        "inside": true,
        "radius": "100%",
        "valueInterval": 10,
        "bands": [ {
          "color": c1,
          "endValue": soso,
          "startValue": 0
        }, {
          "color": c2,
          "endValue": goal,
          "startValue": soso
        }, {
          "color": c3,
          "endValue": 200,
          "innerRadius": "90%",
          "startValue": goal
        } ],
        "bottomText": data + symbol,
        "bottomTextYOffset": -10,
        "endValue": 200
      } ],
      "arrows": [{"value":data}], //es el valor que tiene
      "export": {
        "enabled": true,
        "menu": menu_export
      }
    });
    //gaugeChart.arrows[0].setValue( data );
}

//Grafica de acelerometro doble
function gaugesTwoAxesGraph(data1, data2, contentname, title){
  var chart = AmCharts.makeChart( contentname, {
	  "theme": "chalk",
	  "type": "gauge",
	  "axes": [ {
		 "axisThickness": 1,
		 "endValue": 100,
		 "gridInside": false,
		 "inside": false,
		 "radius": "100%",
		 "valueInterval": 10,
		 "bands": [ {
		     "color": "#84b761", //color verde
		     "endValue": 40,
		     "startValue": 0
		   }, {
		     "color": "#fdd400", //color amarrillo
		     "endValue": 70,
		     "startValue": 40
		   }, {
		     "color": "#cc4748", //color rojo
		     "endValue": 100,
		     "innerRadius": "95%",
		     "startValue": 70
		   } ],
		   "bottomText": data1+"% Deserción"
	  },{
		 "axisThickness": 1,
		 "endValue": 0,
		 "startValue":100,
		 "radius": "80%",
		 "valueInterval": -10,
		 "tickColor": "#fdd400",
		 "bands": [ {
		     "color": "#84b761", //color verde #84b761
		     "endValue": 70,
		     "startValue": 100
		   }, {
		     "color": "#fdd400", //color amarrillo
		     "endValue": 40,
		     "startValue": 70
		   }, {
		     "color": "#cc4748", //color rojo
		     "endValue": 0,
		     "innerRadius": "95%",
		     "startValue": 40
		   } ],
		   "bottomText": data2+"% Retención"
	  } ],
	  "arrows": [ {
		 "color": "#67b7dc",
		 "innerRadius": "25%",
		 "nailRadius": 0,
		 "radius": "85%",

	  } ],
	  "export": {
		 "enabled": true,
     "menu": menu_export
	  }
	});
  chart.arrows[0].setValue( data1 );
}

//grafica de pastel
function pieGraph(data, contentName, namePart, valuePart,title){
    var chart = AmCharts.makeChart( contentName, {
      "type": "pie",
      "theme": "chalk",
      "titles":[{"text":title}],
      "legend": {
        "equalWidths": true,
        "periodValueText": "[[value]]",
        "position": "bottom",
        "valueAlign": "left",
        "valueWidth": 5
      },
      "dataProvider": data,
      "valueField": valuePart,
      "titleField": namePart,
       "balloon":{
       "fixedPosition":true
      },
      "fillColorsField": "color",
      "export": {
        "enabled": true,
        "menu": menu_export
      }
    });
}

//grafica pastel 3d
function pieGraph3D(data, contentName, namePart, valuePart,title){
    var chart = AmCharts.makeChart( contentName, {
      "type": "pie",
      "theme": "chalk",
      "titles":[{"text":title}],
      "legend": {
        "equalWidths": true,
        "periodValueText": "[[value]]",
        "position": "bottom",
        "valueAlign": "left",
        "valueWidth": 5
      },
      "innerRadius": "35%",
      "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
      "dataProvider": data,
      "valueField": valuePart,
      "titleField": namePart,
       "balloon":{
       "fixedPosition":true
      },
      "fillColorsField": "color",
      "export": {
        "enabled": true,
        "menu": menu_export
      }
    });
}

//grafica de barras horizontales
function barGraph(data, contentName, title, namecolumn, namerows, depth3D, angle){
  var chart = AmCharts.makeChart(contentName, {
  "theme": "light",
  "type": "serial",
  "dataProvider": data,  
  "valueAxes": [{
      "title": title
  }],
  "startDuration": 1,
  "graphs": [{
      "balloonText": "<b>[[category]]: [[value]]</b>",
      "fillAlphas": 1,
      "lineAlpha": 0.2,
      "title": "Income",
      "type": "column",
      "valueField": namerows
  }],
  "depth3D": depth3D,
  "angle": angle,
  "rotate": true,
  "chartCursor": {
    "categoryBalloonEnabled": false,
    "cursorAlpha": 0,
    "zoomable": true
  },
  "categoryField": namecolumn,
  "categoryAxis": {
      "gridPosition": "start",
      "fillAlpha": 0.05,
      "position": "left"
  },
  "export": {
  	"enabled": true,
    "menu": menu_export
   }
  });
}

//grafica doble barra horizontales
function barTwoGraph(data, content_name, title, namecolumn, namerow1, namerow2, depth3D, angle, legen1, legen2){
  var chart = AmCharts.makeChart(content_name, {
  	"type": "serial",
    "theme": "light",
  	"categoryField": namecolumn,
  	"rotate": true,
  	"startDuration": 1,
  	"categoryAxis": {
  		"gridPosition": "start",
  		"position": "left"
  	},
    "legend": {
      "equalWidths": true,
      "periodValueText": "[[value]]",
      "position": "bottom",
      "valueAlign": "left",
      "valueWidth": 20
    },
  	"trendLines": [],
  	"graphs": [
  		{
  			"balloonText": "<b>" + legen1 + ": [[value]]</b>",
  			"fillAlphas": 0.8,
  			"id": "AmGraph-1",
  			"lineAlpha": 0.2,
  			"title": legen1+":",
  			"type": "column",
  			"valueField": namerow1
  		},
  		{
  			"balloonText": "<b>" + legen2 + ": [[value]]</b>",
  			"fillAlphas": 0.8,
  			"id": "AmGraph-2",
  			"lineAlpha": 0.2,
  			"title": legen2+":",
  			"type": "column",
  			"valueField": namerow2
  		}
  	],
    "depth3D": depth3D,
    "angle": angle,
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": true
    },
  	"guides": [],
  	"valueAxes": [
  		{
  			"id": "ValueAxis-1",
  			"position": "top",
  			"axisAlpha": 0
  		}
  	],
  	"allLabels": [],
  	"balloon": {},
  	"titles": [],
  	"dataProvider": data,
    "export": {
    	"enabled": true,
      "menu":menu_export
     }
  });
}

//grafica de area
function areaGraph(data, contentname, title, namecolumn, namerows){
  var chart = AmCharts.makeChart( contentname, {
    "type": "serial",
    "theme": "light",
    "titles":[{"text":title}],
    "marginRight": 40,
    "marginLeft": 40,
    "autoMarginOffset": 20,
    "valueAxes": [ {
      "id": "v1",
      "axisAlpha": 0,
      "position": "left",
      "ignoreAxisWidth": true
    } ],
    "balloon": {
      "borderThickness": 1,
      "shadowAlpha": 0
    },
    "graphs": [ {
      "id": "g1",
      "balloon": {
        "drop": true,
        "adjustBorderColor": false,
        "color": "#ffffff",
        "type": "smoothedLine"
      },
      "fillAlphas": 0.2,
      "bullet": "round",
      "bulletBorderAlpha": 1,
      "bulletColor": "#FFFFFF",
      "bulletSize": 5,
      "hideBulletsCount": 50,
      "lineThickness": 2,
      "title": title,
      "useLineColorForBulletBorder": true,
      "valueField": namerows,
      "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
    } ],
    "chartCursor": {
      "valueLineEnabled": true,
      "valueLineBalloonEnabled": true,
      "cursorAlpha": 0,
      "zoomable": false,
      "valueZoomable": true,
      "valueLineAlpha": 0.5
    },
    "valueScrollbar": {
      "autoGridCount": true,
      "color": "#000000",
      "scrollbarHeight": 50
    },
    "categoryField": namecolumn,
    "categoryAxis": {
      "dashLength": 1,
      "minorGridEnabled": true
    },
    "export": {
      "enabled": true,
      "menu": menu_export
    },
    "dataProvider": data
  } );
}

//funcion para grafica de acelerometro simple: indica solo una cantidad
function simpleGauge(data, contentname, title){
  var chart = AmCharts.makeChart(contentname, {
    "theme": "light",
    "type": "gauge",
    "titles": [{"text":title}],
    "axes": [{
      "topTextFontSize": 12,
      "topTextYOffset": 50,
      "axisColor": "#31d6ea",
      "axisThickness": 1,
      "endValue": 100,
      "gridInside": true,
      "inside": true,
      "radius": "50%",
      "valueInterval": 10,
      "tickColor": "#67b7dc",
      "startAngle": -90,
      "endAngle": 90,
      "bandOutlineAlpha": 0,
      "bands": [{
        "color": "#0080ff",
        "endValue": 100,
        "innerRadius": "105%",
        "radius": "170%",
        "gradientRatio": [0.5, 0, -0.5],
        "startValue": 0
      }, {
        "color": "#3cd3a3",
        "endValue": data,
        "innerRadius": "105%",
        "radius": "170%",
        "gradientRatio": [0.5, 0, -0.5],
        "startValue": 0
      }],
      "topText": "Total Profesores: "+data,
    }],
    "arrows": [{
      "alpha": 1,
      "innerRadius": "35%",
      "nailRadius": 0,
      "radius": "170%",
      "value":data
    }],
    "export": {
      "enabled": true,
      "menu": menu_export
    }
  });

}
