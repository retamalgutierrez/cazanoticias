var args = arguments[0] || {};
var indice = args.id;
var user = Alloy.Globals.user;

var coleccionNewsCompleta = Alloy.Collections.completa;

ingresarVisita();

function comentar () {
	Alloy.createController("comentarios",{id:indice}).getView().open();
}

function ingresarVisita(){
	var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/infoextravisitas';
	var xhr=Titanium.Network.createHTTPClient();
	xhr.open("POST", url);
	xhr.onload = function(){
		if(this.status == '200'){
	        console.log('Transmission successful!');
	        data = JSON.parse(this.responseText);
	        console.log(data);
	 	}else{
	        console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
	 	}              
	};

	xhr.onerror = function(e){
		alert("ha ocurrido un error");
		console.log('Transmission error: ' + e.error);
	};

	xhr.setRequestHeader("Content-Type", "application/json");
		var postData = {
			idUsuario:user.id, idNoticia:indice
	};
	xhr.send(JSON.stringify(postData));
}

function fetchNoticias(index){
	var direccion = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenernoticiacompleta';
	var uri = direccion+"?id="+index;

	coleccionNewsCompleta.reset();

	coleccionNewsCompleta.fetch({
        url: uri,
        success : function(){
            _.each(coleccionNewsCompleta.models, function(models){
            	var imgPerfil = Ti.UI.createImageView({
			        image: models.get("link"),
			        defaultImage:'/i.png',
			        height: Ti.UI.FILL,
			        width: Ti.UI.FILL
			    });

            	$.tablaPerfil.add(imgPerfil);
            	
				$.name.text = models.get("name");
				$.tipo.text = models.get("tipo");
				$.fecha.text = models.get("fecha");

				var valorando = models.get("valoracion");

				var vistaValoracion = Ti.UI.createView({
			        width: Ti.UI.FILL,
			        height: 20,
			        left: 5,
			        right: 5,
			        top: 5,
			        bottom: 5,
			        backgroundColor: "white",
			    });

			    var valorA = valorando.substr(19,valorando.length);
    			var stringValor = parseFloat(valorA).toFixed(1);

			    var tituloValoracion = Ti.UI.createLabel({
			        text: 'Valoración Actual: '+stringValor,
			        font:{
			            fontSize: '13sp',
			            fontFamily: 'Arial'
			        },
			        left: 0
			    });

			    vistaValoracion.add(tituloValoracion);

			    var backImg = Ti.UI.createView({
			        right: 0,
			        width: 180,
			        backgroundColor: "blue"
			    });

			    vistaValoracion.add(backImg);

			    var valor = valorando.substr(19,valorando.length);
			    
			    
			    if(valor == 0)
			    {
			        valor = 5;
			    }

			    var v=valor;

			    var tam=100-(20*(v));
			    if(v>=1 && v<2)
			    {
			        tam=tam+60;
			    }
			    else if(v>=2 && v<3)
			    {
			        tam=tam+40;
			    }
			    else if(v>=3 && v<4)
			    {
			        tam=tam+20;
			    }

			    var progreso = Ti.UI.createView({
			        right: 0,
			        width: tam,
			        backgroundColor: "#D3D3D3"
			    });

			    vistaValoracion.add(progreso);

			    var contF=0;
			    for (var i = 0; i < 5; i++) {
			        var img = Ti.UI.createImageView({
			            image: "/estrella.png",
			            width: 20,
			            height: 20,
			            right: contF
			        });

			        contF=img.width+contF;

			        vistaValoracion.add(img);

			        if(i!=4)
			        {
			            var sep = Ti.UI.createView({
			                backgroundColor: "white",
			                width: 20,
			                right: contF
			            });

			            contF=sep.width+contF;

			            vistaValoracion.add(sep);
			        }
			    };

			    $.tablaValoracion.add(vistaValoracion);


			    var labelValoracionPropia = Ti.UI.createLabel({
			    	left: 5,
					font:{
				        fontSize: '13sp',
				        fontFamily:'Georgia-Italic',
				        fontWeight: 'bold'
					},
				  	width: Titanium.UI.FILL,
				  	textAlign: "center",
				  	text: "Valoracion de noticia:"
			    });
			    $.tablaValoracion.add(labelValoracionPropia);

			    var valoracionPropia = Ti.UI.createView({
			    	width: Ti.UI.FILL,
			        height: 40,
			        left: 5,
			        right: 5,
			        top: 5,
			        bottom: 5,
			        backgroundColor: "white",
			    });

			    var centrarValoracion = Ti.UI.createView({
			    	width: 220,
			    	height: 40,
			    	backgroundColor: "green"
			    });
			    valoracionPropia.add(centrarValoracion);

			    var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/infoextravaloracionanterior';
				var xhr=Titanium.Network.createHTTPClient();    
				xhr.open("GET", url+"?idUsuario="+user.id+"&idNoticia="+indice);
				xhr.onload = function(){
					var valor = JSON.parse(this.responseText);
					var v=valor;

					if(v != 0){
						labelValoracionPropia.text = "Valoraste anteriormente con:"
					}

				    var tam2=200-(40*(v));
				    if(v>=1 && v<2)
				    {
				        tam2=tam2+15;
				    }
				    else if(v>=2 && v<3)
				    {
				        tam2=tam2+10;
				    }
				    else if(v>=3 && v<4)
				    {
				        tam2=tam2+5;
				    }
				    if(valor==0)
				    {
				    	tam2=240;
				    }

				    var progresoPropio = Ti.UI.createView({
				        right: 0,
				        width: tam2,
				        backgroundColor: "#D3D3D3"
				    });

				    centrarValoracion.add(progresoPropio);

				    var contF2=0;
				    for (var i = 0; i < 5; i++) {
				        var img = Ti.UI.createImageView({
				            image: "/estrella.png",
				            width: 40,
				            height: 40,
				            right: contF2,
				            class: 5-i
				        });

				        img.addEventListener('click', function(e) {
				        	if(e.source.class == 1)
				        	{
				        		progresoPropio.width = 175;
				        	}
				        	else if(e.source.class == 2)
				        	{
				        		progresoPropio.width = 130;
				        	}
				        	else if(e.source.class == 3)
				        	{
				        		progresoPropio.width = 85;
				        	}
				        	else if(e.source.class == 4)
				        	{
				        		progresoPropio.width = 40;
				        	}
				        	else if(e.source.class == 5)
				        	{
				        		progresoPropio.width = 0;
				        	}

				        	clickValorar(e.source.class,progresoPropio,tituloValoracion,progreso,tam2);
					    });

				        contF2=img.width+contF2;

				        centrarValoracion.add(img);

				        if(i!=4)
				        {
				            var sep = Ti.UI.createView({
				                backgroundColor: "white",
				                width: 5,
				                right: contF2
				            });

				            contF2=sep.width+contF2;

				            centrarValoracion.add(sep);
				        }
				    };
				};

				xhr.onerror = function(e){
					console.log('Transmission error: ' + e.error);
				};

				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send();
			    

			    $.tablaValoracion.add(valoracionPropia);

				$.titulo.text = models.get("titulo");
				$.ubicacion.text = models.get("ubicacion");
				$.cuerpo.text = models.get("cuerpo");

				var ventana = Ti.UI.createView({
                	width: Ti.UI.FILL,
                	height: Ti.UI.SIZE,
                	layout: "vertical"
                });

				var length = Object.keys(models.get('fotos')).length;
				var fotos = models.get('fotos');
                for (var i = 0; i < length; i++) {
                	var archivoFoto = fotos[i].archivo;
                    var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/imagen?idNoticia='+fotos[i].idNoticias+'&archivo='+archivoFoto;

                    var imagenes = Ti.UI.createImageView({
                    	image: url,
                    	width: Ti.UI.FILL,
                    	height: 240
                    });
                    ventana.add(imagenes);
                    
                    imagenes.addEventListener('click',function()
					{
						Alloy.createController("galeria",{nombre:archivoFoto,idNoticias:indice}).getView().open();
					});

                    if(i!=(length-1))
                    {
                    	var separador = Ti.UI.createView({
							left: 11,
							right: 11,
							backgroundColor: "white",
							height: 5
	                    });
	                    ventana.add(separador);
                    }
                }
                $.espacioFotos.add(ventana);

				$.visitas.text = models.get("visitas");
				$.cantidadComentarios.text = models.get("cantidadComentarios");
            });
        },
        error : function(){
            Ti.API.error("hmm - this is not good!");
        }
    });
}

function clickValorar(valor,progress,total,progresoTotal,anterior)
{
	var dialog = Ti.UI.createAlertDialog({
        buttonNames: ['Si', 'No'],
        message: 'Asignar ' + valor + ' estrellas a la noticia',
        title: '¿Esta seguro?'
    });

    dialog.addEventListener('click', function(e){
        if (e.index === 0){
        	var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/infoextravaloracion';
			var xhr=Titanium.Network.createHTTPClient();    
			xhr.open("POST", url);
			xhr.onload = function(){
				var data = 240;
				if(this.status == '200'){
			        console.log('Transmission successful!');

			        data = JSON.parse(this.responseText);
			        var respuestaValor=data;
		            var v=parseFloat(respuestaValor).toFixed(1);
		            total.text= 'Valoración Actual: '+v;
					var tam=100-(20*(v));
					if(v>=1 && v<2)
					{
						tam=tam+60;
					}
					else if(v>=2 && v<3)
					{
						tam=tam+40;
					}
					else if(v>=3 && v<4)
					{
						tam=tam+20;
					}
					progresoTotal.width = tam;
			 	}else{
			 		progresoTotal.width = 240;
			 		alert("Transmission failed. Try again later");
			        console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
			 	}              
			};

			xhr.onerror = function(e){
				alert("ha ocurrido un error");
				console.log('Transmission error: ' + e.error);
				progresoTotal.width = 240;
			};

			xhr.setRequestHeader("Content-Type", "application/json");
				var postData = {
					idUsuario:user.id, idNoticia:indice,valoracion:valor
			};
			xhr.send(JSON.stringify(postData));
        }
		if (e.index === 1){
			progress.width = anterior;
		}
    });
    dialog.show();
}

$.volver.addEventListener("click", function(e){
	$.noticiaCompleta.close();
});

fetchNoticias(indice);