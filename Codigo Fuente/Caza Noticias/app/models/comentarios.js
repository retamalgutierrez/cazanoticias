exports.definition = {	
	config: {
		"URL": Ti.App.Properties.getString('uri') + "/api/cazanoticias/obtenercomentarios",
		//"debug": 1, 
		"adapter": {
			"type": "restapi",
			"collection_name": "comentarios",
			"idAttribute": "id"
		},
		"headers": { // your custom headers
            "Accept": "application/vnd.stackmob+json; version=0",
	        "X-StackMob-API-Key": "your-stackmob-key"
        },
        "parentNode": "comentarios" //your root node
	},		
	extendModel: function(Model) {		
		_.extend(Model.prototype, {});
		return Model;
	},	
	extendCollection: function(Collection) {		
		_.extend(Collection.prototype, {});
		return Collection;
	}		
}