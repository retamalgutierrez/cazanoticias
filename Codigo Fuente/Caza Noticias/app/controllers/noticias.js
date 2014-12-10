var coleccionNoticias = Alloy.Collections.noticias;
var multimedia = Alloy.Collections.multimedia
var loading = Alloy.Globals.loading;


function clicFila (e) {
    if(e.source.apiName == "Ti.UI.Button" && e.source.title == "Ver Más")
    {
        Alloy.createController("noticiaCompleta",{id:e.rowData.title}).getView().open();
    }else if(e.source.apiName == "Ti.UI.Label" && e.source.className == "comment")
    {
        Alloy.createController("comentarios",{id:e.rowData.title}).getView().open();
    }
}


var suma=0;

var RemoteImage = require('RemoteImage');

var ImageLoader = require('ImageLoader');

var Utils = {
  RemoteImage: function(a){
    var image = Ti.UI.createImageView(a);
    return image;
  }
};

function createRemoteImageWebView(url){
    var photo = Ti.UI.createWebView({
        html:'<body topmargin=0 leftmargin=0><img src="' + url + '" style="width: 100%; height: '+Ti.UI.FILL+'";"></body>',
        touchEnabled:false,
        borderColor: "red",
        borderWidth: 5
    });
 
    var didLoad=false;
    var fnLoad=function() { 
        didLoad=true;
    };
    var fnTimer=function() {
        if (!didLoad) {
            photo.image=url;
        }
    };

    photo.addEventListener('load', function(e) {
        fnLoad();
    });
    setTimeout(function() {
            fnTimer();
    },300);    // seconds load time
 
    return photo;
}

function transformFunction(model) {
    var transform = model.toJSON();

    var vistaValoracion = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
    });

    var valorA = transform.valoracion.substr(19,transform.valoracion.length);
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

    var valor = transform.valoracion.substr(19,transform.valoracion.length);
    
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



    valoracion_data = [];
    var rowValoracion= Ti.UI.createTableViewRow();
    rowValoracion.add(vistaValoracion);
    valoracion_data.push(rowValoracion);
    transform.valoracion = valoracion_data;

    var imgPerfil = Ti.UI.createImageView({
        image: transform.link,
        defaultImage:'/i.png',
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    });

    fotos_perfil = [];
    var rowPerfil= Ti.UI.createTableViewRow();
    rowPerfil.add(imgPerfil);
    fotos_perfil.push(rowPerfil);
    transform.link = fotos_perfil;

    fotos_data = [];

    var fondoScroll = Ti.UI.createView({
        height: 240
    });

    var fondo = Ti.UI.createView({
        height: Titanium.UI.FILL,
        backgroundColor: "white",
        left: 11,
        right: 11
    });

    fondoScroll.add(fondo);

    var scrollViewFotos = Ti.UI.createScrollView({
        scrollType: "horizontal",
        height: Titanium.UI.FILL,
        layout: "horizontal",
        showHorizontalScrollIndicator: true
    });

    fondoScroll.add(scrollViewFotos);

    var contar = 0;
    var imageViewArray = [];
    _.each(transform.fotos, function(foto){
        var vistaImagenes = Ti.UI.createView({
            layout: "horizontal",
            backgroundColor: "transparent",
            left: 5.5,
            right: 5.5,
            width: Ti.UI.FILL
        });

        var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/imagen?idNoticia='+foto.idNoticias+'&archivo='+foto.archivo;

        var pic = Ti.UI.createImageView({
            height: Ti.UI.FILL,
            width: Ti.UI.FILL,
            image: url
        });

        vistaImagenes.add(pic);
        
        vistaImagenes.addEventListener('click',function()
		{
			Alloy.createController("galeria",{nombre:foto.archivo,idNoticias:foto.idNoticias}).getView().open();
		});

        scrollViewFotos.add(vistaImagenes);


        imageViewArray[contar] = vistaImagenes;
        contar++;
    });

    if(contar!=0){
        var row = Ti.UI.createTableViewRow();
        row.add(fondoScroll);
        fotos_data.push(row);
     
        transform.fotos = fotos_data;
    }
    return transform;
}

function fetchNoticias(menor,mayor){
    var direccion = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenernoticias';
    var uri = direccion+"?inferior="+menor+"&superior="+mayor;
    
    coleccionNoticias.fetch({
        url: uri,
        success : function(){
        },
        error : function(){
            Ti.API.error("hmm - this is not good!");
        }
    });
}

var swipeRefresh;
$.tableView.addEventListener("postlayout", function handler() {
    $.tableView.removeEventListener("postlayout", handler);
    var parent = $.tableView.getParent();
    parent.remove($.tableView);
    var swipeRefreshModule = require('com.rkam.swiperefreshlayout');
    swipeRefresh = swipeRefreshModule.createSwipeRefresh({
        view: $.tableView,
        zIndex: $.tableView.zIndex,
        backgroundColor: $.tableView.backgroundColor,
        height: $.tableView.height,
        width: $.tableView.width
    });
    swipeRefresh.addEventListener('refreshing', function () {
        
        fetchNoticias(0,30);
        
        console.log('Listado Actualizado');
        
        if(swipeRefresh.isRefreshing()){
            swipeRefresh.setRefreshing(false);
        }
    });
    // adds it
    parent.add(swipeRefresh);
});

function myLoader(e) {
    var ln = coleccionNoticias.models.length;
    coleccionNoticias.fetch({
        data: { offset: ln },
        add: true,
        success: function (col) {
            (col.models.length === ln) ? e.done() : e.success();
        },
        error: e.error
    });
}

function clic(e){}

loading.show();
fetchNoticias(0,100);
loading.hide();

