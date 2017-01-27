$(document).ready(function(){
  $('[data-submenu]').submenupicker();
});

function getPDF(){
  $("#modalinfo").modal('show');
  $("#divtab").html($("#divtable").html());
  $("#divg1").html($("#divgraph1").html());
  $("#divg2").html($("#divgraph2").html());

  // Todo esto se hace para poder generar un reporte con jsPDF
  // las primeras lineas son para guardar
  // las graficas en imagenes para agregar posteriormente al pdf

  // var $con = $('#divgraph1 div.amcharts-main-div div.amcharts-chart-div').html();
  // var arr = $con.split('<a');
  //
  // var svg = arr[0];
  // //alert("hola\n"+arr[0]);
  // if(svg){
  //   svg = svg.replace(/\r?\n|\r/g, '').trim();
  // }
  // var canvase = document.getElementById("canvas");
  // var context = canvase.getContext("2d");
  //
  // context.clearRect(0, 0, canvase.width, canvase.height);
  // canvg(canvase, svg);
  //
  // var imgData = canvas.toDataURL('image/png');
  //
  // var json = JSON.parse($('#txtjson').val());
  //
  // var jbody = [json.fields];
  // var d=[];
  // for (var i = 0; i < json.count; i++) {
  //   var aux = [json.datos[i].Anho,json.datos[i].Nivel]
  //   d.push(aux);
  // }
  // jbody.push(d);
  // alert(JSON.stringify(jbody));

  // aqui se inicializa un nuevo documento pdf y se agregan todo lo que va a contenre y sus propiedades
  // var doc = new jsPDF('p', 'pt', 'letter');
  //
  // doc.setFontSize(40);
  // doc.text(57, 85, 'Hello world!');
  // doc.addImage(imgData, 'PNG', 57, 142, 482, 283);
  // doc.autoTable(jbody[0], jbody[1], {
  //   styles: {fillColor: [0, 0, 204]},
  //   columnStyles: {
  //       id: {fillColor: 255}
  //   },
  //   margin: {top: 454 },
  //   lineColor: 200,
  //   lineWidth: 1,
  // });
  //
  //
  // doc.save('test.pdf');

  // esto es para hacer capturas de pantalla desde js

  // html2canvas($("#tabsat"), {
  //   onrendered: function(canvas) {
	//     var img = canvas.toDataURL("image/png");
  //     alert(img);
  //
	//     doc.addImage(img, 'PNG', 2 , 4, 17, 24);
  //     doc.save('test.pdf');
  //   }
  // });
}

function pdf(){
  var doc = new jsPDF('p', 'cm', 'letter');
  doc.setFontSize(12);

  /*
  En este fragmento es para poder crear un parrafo de un html para enviarselo a pdf
  */

  var cad = $('#txtlec').val();
  var cou = 0;
  var cadaux = "";
  for (var i = 0; i < cad.length; i++) {
    var ch = cad.charAt(i);
    if(cou<85){
      cadaux = cadaux + ch;
      if(ch === '\n'){
        cou=0;
      }else {
        cou++;
      }

    }else{
      if(ch === /\s/){
        alert("cv");
        cadaux = cadaux + ch + '\n';
      }else{
        var chback;
        if(i>0)
          chback = cad.charAt(i-1);
        if(chback === /\W/){
            alert('aaaaa');
            cadaux = cadaux + '-' + '\n' + ch;
          }
          else{
            cadaux = cadaux + '\n' + ch;
          }
      }
      cou=0;
    }
  }
  var ar = cadaux.split('\n');
  var c = 3;
  alert(ar[0])
  for (var i = 0; i < ar.length; i++) {
    doc.text(2, c, ar[i]);
    c+=0.5;
  }
  /*Hasta qui para pasar a una funcion*/

  doc.save('test.pdf');
  // html2canvas($("#tabinfo"), {
  //   onrendered: function(canvas) {
	//     var img = canvas.toDataURL("image/png");
  //     alert(img);
  //
	//     doc.addImage(img, 'PNG', 2 , 3, 18, 2);
  //     doc.save('test.pdf');
  //   }
  // });
}
