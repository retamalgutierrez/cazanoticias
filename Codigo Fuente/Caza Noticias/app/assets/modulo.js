var loading = Alloy.Globals.loading;
var coleccionNoticias = Alloy.Collections.noticias;
var multimedia = Alloy.Collections.multimedia;

//*****************************************
function fetchNoticias(menor,mayor){
	loading.show();
	var direccion = Ti.App.Properties.getString('uri') + '/api/cazanoticias/obtenernoticias';
	var uri = direccion+"?inferior="+menor+"&superior="+mayor;
	coleccionNoticias.fetch({
        url: uri,
        success : function(){
            multimedia.reset();
            _.each(coleccionNoticias.models, function(models){
                //var modelParseado = JSON.parse(models);
                //console.log(modelParseado);
                var fotos = models.get('fotos');
                var length = Object.keys(models.get('fotos')).length;
                for (var i = 0; i < length; i++) {

                    //multimedia.add(fotos[i]);

                    var task = Alloy.createModel('multimedia', {    
                        id: fotos[i].id,
                        archivo: fotos[i].archivo,
                        idNoticias: fotos[i].idNoticias,
                    });
                    task.save();
                    multimedia.add(task);
                }
            });
            console.log('modelo fotos archivado: '+multimedia.models.length);
        },
        error : function(){
            Ti.API.error("hmm - this is not good!");
        }
    });
	loading.hide();
}
//*****************************************

module.exports = {
	fetchNoticias: fetchNoticias
};