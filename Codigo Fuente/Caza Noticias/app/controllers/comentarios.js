var args = arguments[0] || {};
var indice = args.id;
var user = Alloy.Globals.user;
var comentarios = Alloy.Collections.comentarios;
var loading = Alloy.Globals.loading;

var direccion = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenercomentarios';
var uri = direccion+"?idNoticia="+indice;

refrescar();

function transformFunction(model) {
    var transform = model.toJSON();

    var imgPerfil = Ti.UI.createImageView({
        image: transform.link,
        defaultImage:'/i.png',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL
    });

    fotos_perfil = [];
    var rowPerfil= Ti.UI.createTableViewRow();
    rowPerfil.add(imgPerfil);
    fotos_perfil.push(rowPerfil);
    transform.link = fotos_perfil;

    return transform;
}

function focoComentar(){
	$.tabla.height= "76.8%";
}

function volver () {
  $.comentarios.close();
}

function comentar(){
    loading.show();

	var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/comentar';
	var xhr=Titanium.Network.createHTTPClient();    
	xhr.open("POST", url);

	xhr.onload = function(){

	if(this.status == '200'){
	    console.log('Transmission successful!');
        $.comentario.value = "";
	    comentarios.reset();
		comentarios.fetch({url: uri});
		}else{
	    	alert("Error");
	    	console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
	 	}

        loading.hide();            
	};

	xhr.onerror = function(e){
		alert("ha ocurrido un error");
		console.log('Transmission error: ' + e.error);
        loading.hide();
	};

	xhr.setRequestHeader("Content-Type", "application/json");
	var user = Alloy.Globals.user;
		var postData = {
			idNoticia:indice, textoComentario:$.comentario.value,idUsuario:user.id
	};
	xhr.send(JSON.stringify(postData));
}

function refrescar(e){
	
    loading.show();
    comentarios.reset();
    comentarios.fetch({url: uri});
    loading.hide();
}
