var loading = Alloy.Globals.loading;
$.fotos.visible = false;
$.cantFotos.visible = false;
var idNoticia;
var dataFoto = new Object();
var bitmapFoto = new Object();
var indice = 0;

function volver(){
    $.publicar.close();
}

function buscarFoto(){
    subirFotos(1);
}

function llamarCamara(){
    Titanium.Media.showCamera({
        success:function(event) {
            Ti.API.debug('Our type was: '+event.mediaType);
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
               var image=event.media;
               var new_height = image.height /2;
               var new_width = image.width /2;
               var new_image = image.imageAsResized(new_width,new_height);
    
               adjuntar(image);
               Titanium.API.info(new_image);

            } else {
                alert("got the wrong type back ="+event.mediaType);
            }
        },
        cancel:function() {
        },
        error:function(error) {
            var a = Titanium.UI.createAlertDialog({title:'Camera'});
            if (error.code == Titanium.Media.NO_CAMERA) {
                a.setMessage('Please run this test on device');
            } else {
                a.setMessage('Unexpected error: ' + error.code);
            }
            a.show();
        },
        saveToPhotoGallery:true,
        allowEditing:true,
        mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
    });
}

function adjuntarFoto(){
    
    Titanium.Media.openPhotoGallery({
        success:function(event)
        {
            Ti.API.info("success! event: " + JSON.stringify(event));
            var image = event.media;
            
            var new_height = image.height /2;
            var new_width = image.width /2;
            var new_image = image.imageAsResized(new_width,new_height);
            
            adjuntar(new_image);
         
        },
        cancel:function()
        {
         
        },
        error:function(error)
        {
        },
        allowImageEditing:true
    });  
}

var contadorSeparador=0;
var contadorFotos = 0;
function adjuntar(foto)
{
    contadorFotos++;
    bitmapFoto[indice] = foto;
    
    contadorSeparador++;

    var vistaImagenes = Ti.UI.createView({
        width: 70
    });

    var imagenUI = Ti.UI.createImageView({
        height: 60,
        width: 70,
        image:foto
    });

    vistaImagenes.add(imagenUI);

    $.fotos.add(vistaImagenes);

    var separadorA = Ti.UI.createView({
        width: 5
    });
    $.fotos.add(separadorA);

    imagenUI.addEventListener('click',function(){
        
        var dialog = Ti.UI.createAlertDialog({
            cancel: 2,
            buttonNames: ['Borrar', 'Abrir', 'Cancelar'],
            message: 'Seleccione lo que desea hacer',
            title: 'Seleccione'
        });

        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
              alert("se cancelo");
            }
            if (e.index === 0){
                $.fotos.remove(vistaImagenes);
                $.fotos.remove(separadorA);
                var length = Object.keys(bitmapFoto).length;
                var index = -1;
                for (var i = 0; i < length; i++) {
                    if(bitmapFoto[i]==imagenUI.image)
                    {
                        index = i;
                    }
                }
                bitmapFoto[index] = "borrada";
                
            }
             if (e.index === 1){
                verSeleccion=Alloy.createController('verSeleccion',{foto:imagenUI.image}).getView().open();
                
            }
            Ti.API.info('e.cancel: ' + e.cancel);
            Ti.API.info('e.source.cancel: ' + e.source.cancel);
            Ti.API.info('e.index: ' + e.index);
        });
        dialog.show();
    });

    $.fotos.visible = true;
    $.fotos.height = 60;
    $.cantFotos.visible = true;

    indice++;
}

function subirFotos(idNews)
{
    var length = Object.keys(bitmapFoto).length;
    console.log(bitmapFoto);
    Ti.API.info(bitmapFoto);

    var contar = 0;
    for (var i = 0; i < length; i++) {
        if(bitmapFoto[i] != "borrada"){
            var xhr = Titanium.Network.createHTTPClient();
            xhr.onerror = function(e)
            {
                Ti.API.info('IN ERROR ' + e.error);
            };
            xhr.onload = function()
            {

                Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
                if(contar==(length-1))
                {
                    var modulo = require('modulo');
                    modulo.fetchNoticias(0,30);
                    $.publicar.close();
                }
                contar++;
            };
            xhr.onsendstream = function(e)
            {
                Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress+' '+this.status+' '+this.readyState);
            };
            xhr.open('POST',Ti.App.Properties.getString('uri') + '/api/cazanoticias/guardarimagen');
            xhr.setRequestHeader("Connection", "close");
            xhr.send({media:bitmapFoto[i],idNoticia:idNews,indice:i});
        }
        else
        {
            contar++;
        }
    }
}

function publicar(){
	loading.show();
	var longitude;
	var latitude;
	 
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_LOW;
	Titanium.Geolocation.getCurrentPosition(function(e)
	{
	    if (!e.success || e.error)
	    {
	        alert("Error, debe tener el gps y los permisos de ubicacion activados");
            loading.hide();
	        return;
	    }
	    longitude = e.coords.longitude;
	    latitude = e.coords.latitude;
	});
	 
	var locationCallback = function(e)
	{
	    if (!e.success || e.error)
	    {
	        return;
	    }
	 
	    var longitude = e.coords.longitude;
	    var latitude = e.coords.latitude;
	 
	    setTimeout(function()
	    {
	 
	    },300);
	 
	    Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
	    {
	        if (evt.success) {
	            var places = evt.places;
	            if (places && places.length) {
	                var ubicacion = places[0].city+", "+places[0].country;
	                
	                Titanium.Geolocation.removeEventListener('location', locationCallback);
	                
	                var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/guardar';
					var xhr = Titanium.Network.createHTTPClient();
					xhr.open("POST", url);
					
					xhr.onload = function() {
					    if (this.status == '200') {
					        console.log('Transmission successful!');
					
					        data = JSON.parse(this.responseText);
					
					        if (Object.keys(bitmapFoto).length > 0) {
					            subirFotos(data.noticia);
					        } else {
					            var modulo = require('modulo');
					            modulo.fetchNoticias(0, 30);
					            $.publicar.close();
					        }
					    } else {
					        alert("Error");
					        console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
					    }
					};
					
					xhr.onerror = function(e) {
					    alert("ha ocurrido un error");
					    console.log('Transmission error: ' + e.error);
					};
					
					xhr.setRequestHeader("Content-Type", "application/json");
					var user = Alloy.Globals.user;
					var postData = {
					    titulo: $.textoTitulo.value,
					    cuerpo: $.textoCuerpo.value,
					    ubicacion: ubicacion,
					    idUser: user.id
					};
					xhr.send(JSON.stringify(postData));
	            } else {
	                loading.hide();
	                alert("Error, debe tener el gps y los permisos de ubicacion activados");
	            }
	        }
	        else {              
	        }
	    });
	 
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
}

$.textoTitulo.addEventListener('click', function() {
    $.textoTitulo.focus();
});