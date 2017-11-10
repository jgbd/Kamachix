$(document).ready(function () {
  load_start();
  loadlstsprogram(); //carga la lista de programas
  $("#lstperiod1").append('<option value="0" selected>Seleccionar Año</option>');
  $("#lstperiod2").append('<option value="0" selected>Seleccionar Año</option>');
  $("#frmfilter").submit(function (event) {
    load_filters();
    event.preventDefault();
  });

  // al hacer click para cambiar grafica del primer div
  // se puede obtar por de columna o de barras horizontales
  //$("input[name=cgdiv1]").click(function () {
  $("#cgdiv1").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if ($(this).val() === '1') {
      columnTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
    }
    else if ($(this).val() === '2') {
      columnTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 40, 30, "Deserción", "Retención");
    }
    else if ($(this).val() === '3') {
      barTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
    }
    else {
      barTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 40, 30, "Deserción", "Retención");
    }
  });
  $("#cgdiv2").change(function () {
    var json = JSON.parse($('#txtjson').val());
    if ($(this).val() === '1') {
      columnTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
    }
    else if ($(this).val() === '2') {
      columnTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 40, 30, "Deserción", "Retención");
    }
    else if ($(this).val() === '3') {
      lineTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], "Deserción", "Retención");
    }
    else if ($(this).val() === '4') {
      barTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
    }
    else if ($(this).val() === '5') {
      barTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 40, 30, "Deserción", "Retención");
    }
  });
});

function load_start() {
  //$("#cgc1").attr('checked',true);
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');
  $.ajax({
    type: "GET", //el el tipo de peticion puede ser GET y POsT
    url: "consultaperiodo", //la url del que realizara la consulta
    dataType: 'json',
    //se ejecutasi todo se realiza bien
    success: function (json) {
      $("#txtjson").val(JSON.stringify(json));
      $("#programa").html(json.programa);
      $("#meta").html("Meta del Indicador " + json.datos[0].num_Rango_MA +"%");
      for (var i = json.count - 1; i >= 0; i--) {
        $("#tableres").append('<tr>');
        $("#tableres").append('<td>' + json.datos[i].periodo + '</td>');
        $("#tableres").append('<td>' + json.datos[i].no_graduados + '</td>');
        $("#tableres").append('<td>' + json.datos[i].desertores + '</td>');
        json.datos[i].desercion = json.datos[i].desercion.replace(/%/g, "");
        json.datos[i].retencion = json.datos[i].retencion.replace(/%/g, "");
        json.datos[i].desercion = parseFloat(json.datos[i].desercion);
        json.datos[i].retencion = parseFloat(json.datos[i].retencion);
        $("#tableres").append('<td>' + json.datos[i].desercion + '%</td>');
        $("#tableres").append('<td>' + json.datos[i].retencion + '%</td>');

        //----------------------------------------------------------------------
        //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
        // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
        //en caso de que el simbolo del rango adecuado sea '= '
        if (json.datos[i].sim_Rango_A === '= ') {
          if (json.datos[i].desercion == json.datos[i].num_Rango_A) {
            $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
          }
          else if (json.datos[i].sim_Rango_MA === '> ') {
            if (json.datos[i].desercion > json.datos[i].num_Rango_MA) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }
            else {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }

          }
          else if (json.datos[i].sim_Rango_MA === '< ') {
            if (json.datos[i].desercion < json.datos[i].num_Rango_MA) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }
            else {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

            }

          }
        }

        //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
        else if (json.datos[i].sim_Rango_MA === '> ') {
          if (json.datos[i].desercion >= json.datos[i].num_Rango_MA) {
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
          }
          else if (json.datos[i].sim_Rango_A === '> ') {
            if (json.datos[i].desercion >= json.datos[i].num_Rango_A) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta(' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }
            else {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

            }
          }
          else if (json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ') {
            if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_I) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[j].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }
            else if (json.datos[i].desercion <= json.datos[i].num_Rango_I) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }

          }
        }
        //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
        else if (json.datos[i].sim_Rango_MA === '< ') {
          if (json.datos[i].desercion <= json.datos[i].num_Rango_MA) {
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
          }
          else if (json.datos[i].sim_Rango_A === '> ') {
            if (json.datos[i].desercion > json.datos[i].num_Rango_A && json.datos[i].desercion <= json.datos[i].num_Rango_I) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
            }
            else {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

            }
          }
          else if (json.datos[i].sim_Rango_A === '< ') {
            if (json.datos[i].sim_Rango_I === '> ') {
              if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_MA) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else {
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

              }
            }
          }

        }

        //en caso de que el simbolo del rango muy adecuado sea '= '
        else if (json.datos[i].sim_Rango_MA === '= ') {
          if (json.datos[i].desercion == json.datos[i].num_Rango_MA) {
            $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
          }
          else if (json.datos[i].sim_Rango_A === '> ') {
            if (json.datos[i].desercion > json.datos[i].num_Rango_A) {
              $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

            }
            else {
              $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

            }

          }
          else if (json.datos[i].sim_Rango_A === '< ') {
            if (json.datos[i].sim_Rango_I === '< ') {
              if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_I) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else {
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

              }
            }

            if (json.datos[i].sim_Rango_I === '> ') {
              if (json.datos[i].desercion <= json.datos[i].num_Rango_A) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta(' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else {
                $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

              }
            }

          }
        }
        //-----------------------------------------------------------------
        $("#tableres").append('</tr>');
      }
      columnTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
      lineTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], "Deserción", "Retención");
      gaugesTwoAxesGraph(json.datos[0].desercion, json.datos[0].retencion, 'divgraph3')
    }
  });
}

function loadlstsperiod() {
  $("#lstperiod1").html("");
  $("#lstperiod2").html("");
  $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "filtrosperiodo", //la url del que realizara la consulta
    dataType: 'json',
    data: { c: 2, 'program': $("#lstprog").val() },//se envia un valor para despues coneste saber que consulta
    //realizar a la base de daos
    //se ejecutasi todo se realiza bien
    success: function (json) {
      $("#lstperiod1").append('<option value="0" selected>Seleccionar Año</option>');
      $("#lstperiod2").append('<option value="0" selected>Seleccionar Año</option>');
      for (var i = 0; i < json.rowCount; i++) {
        $("#lstperiod1").append('<option value="' +
          json.rows[i].periodo + '">'
          + json.rows[i].periodo
          + '</option>');

        $("#lstperiod2").append('<option value="' +
          json.rows[i].periodo + '">'
          + json.rows[i].periodo
          + '</option>');
      }
    }
  });
}

function loadlstsprogram() {
  $.ajax({
    type: "get", //el el tipo de peticion puede ser GET y POsT
    url: "filtrosperiodo", //la url del que realizara la consulta
    dataType: 'json',
    data: { c: 1 },//se envia un valor para despues coneste saber que consulta
    //realizar a la base de daos
    //se ejecutasi todo se realiza bien
    success: function (json) {
      $("#lstprog").append('<option value="0" selected>Seleccionar Programa</option>');
      for (var i = 0; i < json.rowCount; i++) {
        $("#lstprog").append('<option value="' +
          json.rows[i].programa + '">'
          + json.rows[i].nombre
          + '</option>');
      }
    }
  });
}

function load_filters() {
  $("#cgc1").attr('checked', true);
  var ban = true;
  //vacea el contenido de la tabla para volver a cargar datos nuevos
  $("#tableres").html('');
  $("#divgraph1").html('');
  $("#divgraph2").html('');
  $("#divgraph3").html('');

  //se obtiene los valores de las input en variables
  var program = $("#lstprog").val(), periodfrom = $("#lstperiod1").val(), periodto = $("#lstperiod2").val();

  if (periodfrom > periodto && periodto != 0) {
    var aux = periodfrom;
    periodfrom = periodto;
    periodto = aux;
  } else if (periodto > periodfrom && periodfrom == 0) {
    periodfrom = periodto;
  }

  //se coloca los datos del form en el formato adecuado para enviar al server
  var formData = {
    'program': program,
    'periodfrom': periodfrom,
    'periodto': periodto
  };
  //el metodo ajax para consulta asyncronica
  if (ban) {
    $.ajax({
      type: "POST", //el el tipo de peticion puede ser GET y POsT
      url: "consultaperiodo", //la url a la  que se realizara la consulta
      data: formData,
      dataType: 'json',
      success: function (json) {
        if (json.Error) {
          $("#messageError").html("No existen datos");
          $('#myModal').modal('show');
          load_start();
        } else {
          $("#txtjson").val(JSON.stringify(json));
          if (periodfrom != 0) {
            if (periodto != 0 && periodfrom != periodto) {
              $("#programa").html(json.programa + "<br> Periodo: " + periodfrom + " A " + periodto);
            } else {
              $("#programa").html(json.programa + "<br> Periodo: " + periodfrom);
            }
          } else {
            $("#programa").html(json.programa);
          }
          for (var i = json.count - 1; i >= 0; i--) {
            $("#tableres").append('<tr>');
            $("#tableres").append('<td>' + json.datos[i].periodo + '</td>');
            $("#tableres").append('<td>' + json.datos[i].no_graduados + '</td>');
            $("#tableres").append('<td>' + json.datos[i].desertores + '</td>');
            json.datos[i].desercion = json.datos[i].desercion.replace(/%/g, "");
            json.datos[i].retencion = json.datos[i].retencion.replace(/%/g, "");
            json.datos[i].desercion = parseFloat(json.datos[i].desercion);
            json.datos[i].retencion = parseFloat(json.datos[i].retencion);
            $("#tableres").append('<td>' + json.datos[i].desercion + '</td>');
            $("#tableres").append('<td>' + json.datos[i].retencion + '</td>');
            //----------------------------------------------------------------------
            //--Verificación y muestra de etiquetas de estado de los KPI's en función de la meta a lo largo de los años---------------------------------------------------------------------------------------------------------------
            // condiciones para insertar el estado rojo verde o amarillo segun el estado de meta y segun los rangos establecidos en los manuales
            //en caso de que el simbolo del rango adecuado sea '= '
            if (json.datos[i].sim_Rango_A === '= ') {
              if (json.datos[i].desercion == json.datos[i].num_Rango_A) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else if (json.datos[i].sim_Rango_MA === '> ') {
                if (json.datos[i].desercion > json.datos[i].num_Rango_MA) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }

              }
              else if (json.datos[i].sim_Rango_MA === '< ') {
                if (json.datos[i].desercion < json.datos[i].num_Rango_MA) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                }

              }
            }

            //en caso de que el simbolo del rango muy adecuado sea el simbolo de mayor '>'
            else if (json.datos[i].sim_Rango_MA === '> ') {
              if (json.datos[i].desercion >= json.datos[i].num_Rango_MA) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else if (json.datos[i].sim_Rango_A === '> ') {
                if (json.datos[i].desercion >= json.datos[i].num_Rango_A) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de se esta alejando de la meta(' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                }
              }
              else if (json.datos[i].sim_Rango_A === '< ' && json.datos[i].sim_Rango_I === '< ') {
                if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_I) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[j].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }
                else if (json.datos[i].desercion <= json.datos[i].num_Rango_I) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }

              }
            }
            //en caso de que el simbolo del rango muy adecuado sea el simbolo de menor '<'
            else if (json.datos[i].sim_Rango_MA === '< ') {
              if (json.datos[i].desercion <= json.datos[i].num_Rango_MA) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else if (json.datos[i].sim_Rango_A === '> ') {
                if (json.datos[i].desercion > json.datos[i].num_Rango_A && json.datos[i].desercion <= json.datos[i].num_Rango_I) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                }
              }
              else if (json.datos[i].sim_Rango_A === '< ') {
                if (json.datos[i].sim_Rango_I === '> ') {
                  if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_MA) {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                  }
                  else {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                  }
                }
              }

            }

            //en caso de que el simbolo del rango muy adecuado sea '= '
            else if (json.datos[i].sim_Rango_MA === '= ') {
              if (json.datos[i].desercion == json.datos[i].num_Rango_MA) {
                $("#tableres").append('<td class="est"><img id="est" src="/images/verde.svg" alt="GREEN" title="Meta del Nivel de Deserción Alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
              }
              else if (json.datos[i].sim_Rango_A === '> ') {
                if (json.datos[i].desercion > json.datos[i].num_Rango_A) {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                }
                else {
                  $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                }

              }
              else if (json.datos[i].sim_Rango_A === '< ') {
                if (json.datos[i].sim_Rango_I === '< ') {
                  if (json.datos[i].desercion <= json.datos[i].num_Rango_A && json.datos[i].desercion > json.datos[i].num_Rango_I) {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                  }
                  else {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                  }
                }

                if (json.datos[i].sim_Rango_I === '> ') {
                  if (json.datos[i].desercion <= json.datos[i].num_Rango_A) {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/orange.svg" alt="ORANGE" title="La meta del Nivel de Deserción se esta alejando de la meta (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');
                  }
                  else {
                    $("#tableres").append('<td class="est"><img id="est" src="/images/red.svg" alt="RED" title="Meta del Nivel de Deserción no alcanzada (' + json.datos[i].desercion + '% de ' + json.datos[i].num_Rango_MA + '%)"></td>');

                  }
                }

              }
            }
            //-----------------------------------------------------------------
            $("#tableres").append('</tr>');
          }
          columnTwoGraph(json.datos, 'divgraph1', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], 0, 0, "Deserción", "Retención");
          lineTwoGraph(json.datos, 'divgraph2', 'Deserción por Periodo\n' + json.programa, json.fields[0], json.fields[1], json.fields[2], "Deserción", "Retención");
          gaugesTwoAxesGraph(json.datos[0].desercion, json.datos[0].retencion, 'divgraph3')
        }
      }
    });
  }
  closedivfilter();
}

function opendivfilter() {
  $("#modalfilter").modal('show');
}

function closedivfilter() {
  $("#modalfilter").modal('hide');
}

function hidenmodal() {
  $("#myModal").modal('hide');
  $("#modalfilter").modal('show');
}
