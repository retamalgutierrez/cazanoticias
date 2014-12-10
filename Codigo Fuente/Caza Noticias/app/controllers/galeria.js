var args = arguments[0] || {};
var archivo = args.nombre;
var idNoticia = args.idNoticias;


url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenergaleria?idNoticia='+idNoticia;
xhr = Ti.Network.createHTTPClient({
	onload: function (e) {
		var data = JSON.parse(this.responseText);
		
		var imageCollection = [];
		var nombres = [];
		
		var indice = -1;
		
		for(var j = 0;j<Object.keys(data.galeria).length;j++){
			var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/imagen?idNoticia='+idNoticia+'&archivo='+data.galeria[j].archivo;
			nombres.push(data.galeria[j].archivo);
			imageCollection.push(url);
			
			if(archivo == data.galeria[j].archivo)
			{
				indice = j;
			}
		}
		var scrollGallery = Ti.UI.createScrollableView({
		  showPagingControl:true
		});
		var viewCollection = [];
		for (var i = 0; i < imageCollection.length; i++) {
		  var view = Ti.UI.createView({});
			  var img = Ti.UI.createImageView({
			    height: Ti.UI.FILL
			  });
			   img.image = imageCollection[i];
			   view.add(img);
		  viewCollection.push(view);
		}
		scrollGallery.views = viewCollection;
		$.win.add(scrollGallery);
		
		scrollGallery.scrollToView(indice);
	},
	//error en la coneccion
	onerror: function (e) {
		console.log(e.error + "error");
	},
	timeout:300
});

xhr.open('GET',url);
xhr.send();


