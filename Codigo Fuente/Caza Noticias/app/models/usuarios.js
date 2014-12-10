exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY",
		    "name": "TEXT",
		    "email": "TEXT",
		    "sexo": "TEXT",
		    "link": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "usuarios",
			idAttribute: 'id'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};