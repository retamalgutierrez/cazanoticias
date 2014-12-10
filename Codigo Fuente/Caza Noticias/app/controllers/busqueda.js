var args = arguments[0] || {};
var coleccionBuscar = Alloy.Collections.buscar;

function clicFila (e) {
	Alloy.createController("noticiaCompleta",{id:e.rowData.title}).getView().open();
}

function filtrar(menor,mayor,titulo){
	if($.titulos.value!="")
	{
		var direccion = Ti.App.Properties.getString('uri') + '/api/cazanoticias/buscarnoticias';
		var uri = direccion+"?inferior="+menor+"&superior="+mayor+"&titulo="+titulo;
		coleccionBuscar.fetch({url: uri});
	}
	else
	{
		coleccionBuscar.reset();
	}	
}

$.titulos.addEventListener("change", function(e) {
	filtrar(0,10,$.titulos.value);
});

$.volver.addEventListener("click", function(e) {
	$.busqueda.close();
});

var swipeRefresh;
$.tabla.addEventListener("postlayout", function handler() {
    $.tabla.removeEventListener("postlayout", handler);
    var parent = $.tabla.getParent();
    parent.remove($.tabla);
    var swipeRefreshModule = require('com.rkam.swiperefreshlayout');
    swipeRefresh = swipeRefreshModule.createSwipeRefresh({
        view: $.tabla,
        zIndex: $.tabla.zIndex,
        backgroundColor: $.tabla.backgroundColor,
        height: $.tabla.height,
        width: $.tabla.width,
    });
    swipeRefresh.addEventListener('refreshing', function () {
        
        filtrar(0,10,$.titulos.value);
        
        console.log('Listado Actualizado');
		
		if(swipeRefresh.isRefreshing()){
			swipeRefresh.setRefreshing(false);
		}
    });
    // adds it
    parent.add(swipeRefresh);
});
