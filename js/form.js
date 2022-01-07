var phone= '';
var nombre='';
var token='';
let lbltelefono;
let inputNombre;
let ubicacion;
window.addEventListener("load",function(){
  ubicacion=document.getElementById("coordenada");

  document.querySelector("#submit").addEventListener("click", e => {
    e.preventDefault();
  
    //INGRESE UN NUMERO DE WHATSAPP VALIDO AQUI:
    let telefono = "573105010573";
  
    let cliente = document.querySelector("#cliente").value;
    let servicio = document.querySelector("#servicio").value;
    let resp = document.querySelector("#respuesta");
  
    resp.classList.remove("fail");
    resp.classList.remove("send");
  
    let url = `https://api.whatsapp.com/send?phone=${telefono}&text=
      *_MI NEGOCIO_*%0A
      *Reservas*%0A%0A
      *¿Cuál es tu nombre?*%0A
      ${cliente}%0A
      *Indica la fecha de tu reserva*%0A
      ${fecha}%0A
      *Indica la hora de tu reserva*%0A
      ${hora}%0A
      *Empleado de preferencia*%0A
      ${empleado}%0A
      *¿Cuál es el servicio que se desea realizar?*%0A
      ${servicio}`;
  
    if (cliente === "" || fecha === "" || hora === "") {
      resp.classList.add("fail");
      resp.innerHTML = `Faltan algunos datos, ${cliente}`;
      return false;
    }
    resp.classList.remove("fail");
    resp.classList.add("send");
    resp.innerHTML = `Se ha enviado tu reserva, ${cliente}`;
  
    window.open(url);
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
/*       if(clic==1)
        realizaractivate();
      else
        evaluar(); */


}
