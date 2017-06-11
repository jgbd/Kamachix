//funcion para cargar los archivo al server

function fileupload(files){
  var file;

  var result='-1';

  if(!files){
    result='0';
  }
  else{
    file=files.file;
    if(!/csv/.test(file.mimetype) && !/vnd.ms-excel/.test(file.mimetype)){
      result='1';
    }
    else{
      var fina = file.name.replace(/\s/g, "");
      file.mv('files/'+fina,function(err){
        if(err) result='2';
        else result='3';
      });
    }
  }
  return result;
}


module.exports.fileupload = fileupload;
