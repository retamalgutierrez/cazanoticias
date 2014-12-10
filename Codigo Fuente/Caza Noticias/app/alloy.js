// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//

Alloy.Collections.noticias = Alloy.createCollection('noticias');
Alloy.Collections.usuarios = Alloy.createCollection('usuarios');
Alloy.Collections.buscar = Alloy.createCollection('buscar');
Alloy.Collections.multimedia = Alloy.createCollection('multimedia');
Alloy.Collections.completa = Alloy.createCollection('completa');
Alloy.Collections.comentarios = Alloy.createCollection('comentarios');


Alloy.Globals.Facebook = require('facebook');

Alloy.Globals.user = Ti.App.Properties.getObject('user', {});

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

/* direccion del servidor online */
/*** laravel esta con public removido de url */
//Ti.App.Properties.setString('uri', 'http://cazanoticias.hol.es/cazanoticias');

/* direccion de localhost desde genymotion */
/*** laravel esta con public removido de url */
//Ti.App.Properties.setString('uri', 'http://10.0.3.2:8000');

Ti.App.Properties.setString('uri', 'http://172.16.176.100:8000');
