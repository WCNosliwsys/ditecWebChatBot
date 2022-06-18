var phone = '';
var nombre = '';
var token = '';
// let lbltelefono;
let inputNombre;
let ubicacion;
let milatlng;
window.addEventListener("load", async () => {

  ubicacion = document.getElementById("coordenada");
  var socket = io('https://radiotaxichiclayo.eu-4.evennode.com/users');
  socket.on('connected', function (data) {

    console.log('connected');
    socket.emit('signin', 'operador@', function (cbmsg, sckt) {
      console.log(cbmsg + "socketdi: " + sckt);
    });
    console.log(socket.id);
  });

  let button = document.querySelector("#submit");
  button.addEventListener("click", async e => {
    e.preventDefault();
    resp = document.getElementById('respuesta');
        if (!milatlng ) {          
          resp.innerHTML = `Debe hacer clic a un punto en el mapa para realizar su solicitud`;
          return false;
        } 



    var data = {};
    data.latitude = milatlng.lat();
    data.longitude = milatlng.lng();;
    data.email = 'operador@';
    data.phone = phone;
    data.name = inputNombre.value;
    data.note = document.getElementById('referencia').value;
    data.address = document.getElementById('direccion').value;
    data.tipomovil = "Cualquiera";
    data.zona = "";
    data.tipopeticion = "normal";
    data.price = '';
    data.to = "";
    data.exactprice = "";
    data.user = 'WHATSAPP';
    data.mykey = 'ditec999';
    if (data.name.length <2 ) {          
      resp.innerHTML = `Debe poner un nombre para enviar su solicitud`;
      return false;
    } 
    if (data.address.length<3 ) {          
      resp.innerHTML = `Debe poner una direccion valida para realizar su solicitud`;
      return false;
    } 
    button.disabled = true;

    console.log(data);
    mibody = { "phone": phone };

    responseCheck = await fetch('https://radiotaxichiclayo.eu-4.evennode.com/api/v1/request/checkEnableWhatsapp', {
      method: 'post',
      body: JSON.stringify(mibody),
      headers: { 'Content-Type': 'application/json' }
    });
    checkWhatsapp = await responseCheck.json();
    console.log(checkWhatsapp);
    if (checkWhatsapp.chatTokenPedir == "") window.open("error.html", "_self");
    else
      socket.emit('new request', data, async (cb) =>{
        console.log("se ejecuto el new request");
        console.log(cb);
        resp.innerHTML = `Se ha enviado tu solicitud de servicio de Taxi en breve le informaremos por WhatsApp cuando un conductor acepte su solicitud, ${nombre}`;

      });
  });

  console.log("probando inicio");

  var tmp = [];
  var parametro = location.search.substring(1).split('?');
  parametro[0].split('&').forEach(function (item) {
    tmp = item.split('=');
    if (tmp[0] == 'phone') {
      phone = decodeURIComponent(tmp[1]);
    }
    if (tmp[0] == 'nombre') {
      nombre = decodeURIComponent(tmp[1]);
    }
    if (tmp[0] == 'token') {
      token = decodeURIComponent(tmp[1]);
    }
  });
  inputNombre = document.getElementById("nombre");
  inputNombre.value = nombre;
/*   lbltelefono = document.getElementById("telefono");
  telefono.innerHTML = phone */
  console.log(phone);
  console.log(nombre);
  console.log(token);

  mibody = { "phone": phone };

/*   responseCheck = await fetch('https://radiotaxichiclayo.eu-4.evennode.com/api/v1/request/checkEnableWhatsapp', {
    method: 'post',
    body: JSON.stringify(mibody),
    headers: { 'Content-Type': 'application/json' }
  });
  checkWhatsapp = await responseCheck.json();
  console.log(checkWhatsapp);
  if (checkWhatsapp.chatTokenWeb != token) window.open("error.html", "_self");
  else {
    mibody = { "phone": phone, "chatTokenWeb": token };

    await fetch('https://radiotaxichiclayo.eu-4.evennode.com/api/v1/request/updateToken', {
      method: 'post',
      body: JSON.stringify(mibody),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("se actualizo el token");
  } */

  // console.log('p: '+p);
  iniciarMapa();


 

})

function iniciarMapa() {
  var mapProp = {
    //Arequipa
    //center:new google.maps.LatLng(-16.4090474,-71.53745099999998),
    //Tacna
    center: new google.maps.LatLng(-6.771648, -79.839047),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    gestureHandling: "greedy"
  };
  MAP = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  MAP.addListener('click', function (e) {
    latitude = e.latLng.lat();
    longitude = e.latLng.lng();
    putmarker(e.latLng, MAP, 1);
    //realizaractivate();
  });


  navigator.geolocation.getCurrentPosition(geoposOK, geoposKO);


  function geoposOK(pos) {

    var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    putmarker(location, MAP, 1);
    var geocoder = new google.maps.Geocoder();             // create a geocoder object
    var location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);    // turn coordinates into an object          
    geocoder.geocode({ 'latLng': location }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {           // if geocode success
        var add = results[0].formatted_address;         // if address found, pass to processing function
        document.getElementById('direccion').value=add;
        console.log(add);
      }
    });
  }

  
  function geoposKO(err) {
    console.warn(err.message);
    let msg;
    switch(err.code) {
        case err.PERMISSION_DENIED:
            msg = "No nos has dado permiso para obtener tu posición";
            break;
        case err.POSITION_UNAVAILABLE:
            msg = "Tu posición actual no está disponible";
            break;
         case err.TIMEOUT:
             msg = "No se ha podido obtener tu posición en un tiempo prudencial";
             break;
         default:
             msg = "Error desconocido";
             break;
    }
    console.log(msg);
  }
}

var destino = null;
function putmarker(latLng, map, clic) {
  if (destino != null)
    destino.setMap(null);
  destino = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
  console.log('latlng: ' + latLng);
  // se retira porque no es necesario que la central capture la direccion de la api de google solo la latitud y longitude y confirmar que se capturo

  /*var direccion=latLng+"";
  direccion=direccion.substring(1, direccion.length-1);
  callWebService(direccion,clic);*/
  ubicacion.innerHTML = 'latlng: ' + latLng
  milatlng = latLng;
  /*       if(clic==1)
          realizaractivate();
        else
          evaluar(); */


}


 