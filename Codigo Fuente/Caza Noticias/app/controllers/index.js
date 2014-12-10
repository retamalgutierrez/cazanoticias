var args = arguments[0] || {};
var coleccionNoticias = Alloy.Collections.noticias;
var user = Alloy.Globals.user;

if(!user.hasOwnProperty("id")){
	Alloy.createController("login").getView().open();
}else{
	Alloy.createController("principal").getView().open();
}









