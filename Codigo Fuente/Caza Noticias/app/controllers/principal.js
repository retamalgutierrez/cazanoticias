var args = arguments[0] || {};
var coleccionNoticias = Alloy.Collections.noticias;
var user = Alloy.Globals.user;

function holap(){}


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

function addItem(){}

function clear (e) {
  	var db=Ti.Database.open('_alloy_');
	var deleteRecords=db.execute('drop table multimedia');
	Ti.API.info('Affected Rows    '+db.getRowsAffected());
	db.close();
}

function navegacion (vista,boton) {
	$.vistaNewsClick.visible = false;
	$.vistaNewsClick.height = "0%";
	$.vistaNews.backgroundColor = "#4a7d74";
	$.vistamyPerfilClick.visible = false;
	$.vistamyPerfilClick.height = "0%";
	$.vistamyPerfil.backgroundColor = "#4a7d74";
	vista.height = Titanium.UI.FILL;
	vista.visible = true;
	boton.backgroundColor = "blue";
}

$.vistaNews.backgroundColor = "blue";
$.vistamyPerfil.backgroundColor = "#4a7d74";

$.vistaNews.addEventListener("click", function(e){
	navegacion($.vistaNewsClick,$.vistaNews);
	$.titulos.text = "Inicio";
});
$.vistamyPerfil.addEventListener("click", function(e){
	navegacion($.vistamyPerfilClick,$.vistamyPerfil);
	$.titulos.text = "Mi Perfil";
});

function cerrarSession (e) {
	Ti.App.Properties.removeProperty("user");
	Alloy.Globals.user = {};
	Alloy.createController("login").getView().open();
}

function buscar (e) {
	Alloy.createController("busqueda").getView().open();
}

function publicar(){
	Alloy.createController("publicar").getView().open();
}




















