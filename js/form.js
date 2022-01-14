var phone= '';
var nombre='';
var token='';
let lbltelefono;
let inputNombre;
let ubicacion;
let milatlng;
window.addEventListener("load",function(){
  ubicacion=document.getElementById("coordenada");
  var socket = io('http://ditec.eu-4.evennode.com/users');
  socket.on('connected', function (data) {

    console.log('connected');
    socket.emit('signin','operador@',function(cbmsg,sckt){
      console.log(cbmsg+ "socketdi: "+ sckt);
    });
    console.log(socket.id);
  });


  document.querySelector("#submit").addEventListener("click", e => {
    e.preventDefault();
  
/*     if (cliente === "" || fecha === "" || hora === "") {
      resp.classList.add("fail");
      resp.innerHTML = `Faltan algunos datos, ${cliente}`;
      return false;
    } */

    resp.innerHTML = `Se ha enviado tu reserva, ${cliente}`;
    var data = {};
    data.latitude = milatlng.lat();
    data.longitude = milatlng.lng();;
    data.email = 'operador@';
    data.user="Whatsapp"
    data.phone=phone;
    data.name=inputNombre.value;
    data.note = document.getElementById('referencia').value;
    data.address = document.getElementById('direccion').value;
    data.tipomovil= "Cualquiera";
    data.zona="";
    data.tipopeticion="normal"; 
    data.price='';
    data.to="";
    data.exactprice="";

    console.log(data);

/*     socket.emit('new request',data,function(cb){
      console.log("se ejecuto el new request");}); */
  });

  console.log("probando inicio");

  var tmp=[];
  var parametro=location.search.substring(1).split('?');
  parametro[0].split('&').forEach(function(item){
    tmp=item.split('=');
    if(tmp[0]=='phone'){
      phone=decodeURIComponent(tmp[1]);
    }
    if(tmp[0]=='nombre'){
      nombre=decodeURIComponent(tmp[1]);
    }
    if(tmp[0]=='token'){
      token=decodeURIComponent(tmp[1]);
    }
  });
  inputNombre = document.getElementById("nombre");
  inputNombre.value=nombre;
  lbltelefono = document.getElementById("telefono");
  telefono.innerHTML=phone
  console.log(phone);
  console.log(nombre);
  console.log(token);
 // console.log('p: '+p);
 iniciarMapa();
})

function iniciarMapa(){
  var mapProp = {
    //Arequipa
    //center:new google.maps.LatLng(-16.4090474,-71.53745099999998),
    //Tacna
    center:new google.maps.LatLng(-18.02941384681983,-70.2692299336195),
    zoom:13,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
  };
  MAP=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    MAP.addListener('click', function(e) {
      latitude= e.latLng.lat();
      longitude=e.latLng.lng();
      putmarker(e.latLng, MAP,1);
//realizaractivate();
    });

  
}
var destino =null;
function putmarker(latLng, map,clic) {
  if(destino!=null)
      destino.setMap(null);        
  destino = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
  console.log('latlng: '+ latLng);
// se retira porque no es necesario que la central capture la direccion de la api de google solo la latitud y longitude y confirmar que se capturo

  /*var direccion=latLng+"";
  direccion=direccion.substring(1, direccion.length-1);
  callWebService(direccion,clic);*/
  ubicacion.innerHTML='latlng: '+ latLng
  milatlng=latLng;
/*       if(clic==1)
        realizaractivate();
      else
        evaluar(); */


}
