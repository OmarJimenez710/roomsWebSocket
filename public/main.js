var socket = io(); //se genera la conexion

$(function() {
  $("form").submit(() => {
    var mensaje = $("#msj").val();
    socket.emit('message', mensaje);
    $("#msj").val('').focus();
    return false;
  });
})

//el evento que genero el server, lo escucha el front
//id --> parametro que envia el server
socket.on('message', (msj, id) => {
  alert(msj);
  $("message").append('<li>').text('<strong>' + id + '</strong>:' + msj);

  //alert('bye usuario: ' + id);
});