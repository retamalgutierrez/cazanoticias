
var user = Alloy.Globals.user;
var modeloUsuarios=  Alloy.createModel('usuarios');

modeloUsuarios.fetch({query: 'select * from usuarios where id = ' + user.id });
$.name.text = modeloUsuarios.get("name");
$.email.text = modeloUsuarios.get("email");
if(modeloUsuarios.get("sexo") == "male"){
	$.sexo.text = "Hombre";
}else{
	$.sexo.text = "Mujer";
}

$.imagen.init({
    image: modeloUsuarios.get("link")
});

$.imagen.addEventListener('click', function(e){

Alloy.createController('verSeleccion',{link:modeloUsuarios.get("link")}).getView().open();

});
ObtenerUpdatas(user.id);

function ObtenerUpdatas(idUser){
	var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenerupdatas';
	var xhr = Ti.Network.createHTTPClient({
		//resultado luego de la consulta
		onload: function (e) {
			var data = JSON.parse(this.responseText);
			$.tipo.text = data.tipo;
			$.cantPublicaciones.text = data.cantidad;

		},
		onerror: function (e) {
			console.log(this.responseText);
			console.log(this.status);
			console.log(e.error + "error");
			//alert("El servidor no e");

			Ti.App.Properties.removeProperty("user");
			Alloy.Globals.user = {};
			Alloy.createController("login").getView().open();
		},
		timeout:300
	});
	xhr.open('GET',url+'?idUser='+idUser);
	xhr.send();
}

$.cerrar.addEventListener('click', function() {
	Ti.App.Properties.removeProperty("user");
	Alloy.Globals.user = {};
	Alloy.createController("login").getView().open();
});