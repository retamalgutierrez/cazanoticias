var facebook = Alloy.Globals.Facebook;
var loading = Alloy.Globals.loading;

facebook.appid = '1470213246574141';
facebook.permissions = ['email'];
facebook.forceDialogAuth = false;

facebook.addEventListener('login', facebookLoginHandler);
facebook.addEventListener('logout', facebookLogoutHandler);

$.login.addEventListener('click', function() {
    facebook.authorize();
    
    /* Para trabajar offline sin facebook */
    /*var user = {
		id : '10204697904950515'
	};
	Ti.App.Properties.setObject("user",user);
	Alloy.Globals.user = user;
	
	var task = Alloy.createModel('usuarios', {    
        id : '10204697904950515',
        name: 'Sergio Retamal',
        //cuerpo: "Cuerpo de ejemplo",
        email: 'correo@correo.com',
        sexo: 'male',
        //fecha: moment().toString(),
        link: 'link_usado',
        tipo: "Básico"
    });
    task.save();
    
    
    var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/guardarusuario';
	var xhr=Titanium.Network.createHTTPClient();    
    xhr.open("POST", url);
 
    xhr.onload = function(){
     if(this.status == '200'){
        console.log('Transmission successful!');
     }else{
        console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
     }              
    };
 
    xhr.onerror = function(e){console.log('Transmission error: ' + e.error);};
    xhr.setRequestHeader("Content-Type", "application/json");
 	var postData = {
 		id:'10204697904950515', name:'Sergio Retamal', email:'correo@correo.com', sexo:'male', link:'link_usado', tipo:'Basico'
	};
	xhr.send(JSON.stringify(postData));
    
    
    
	loading.hide();
	Alloy.createController("principal",{token:"ok"}).getView().open();*/
});

function facebookLoginHandler(e) {
    if (e.success) {
        
        loading.show();
        
        if(facebook.loggedIn){
			facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
		    if (e.success) {
				
				var parseado = JSON.parse(e.result);
				
		    	url = 'http://graph.facebook.com/' + parseado.id + '/picture?type=large&redirect=false&width=400&height=400';
				xhr = Ti.Network.createHTTPClient({
					//resultado luego de la consulta
					onload: function (e) {
						jsonImg = JSON.parse(this.responseText);
						urlUsar = jsonImg.data.url;
						
						var user = {
							id : parseado.id
						};
						Ti.App.Properties.setObject("user",user);
						Alloy.Globals.user = user;
						
						var task = Alloy.createModel('usuarios', {    
					        id : parseado.id,
					        name: parseado.name,
					        email: parseado.email,
					        sexo: parseado.gender,
					        link: urlUsar.toString(),
					        tipo: "Básico"
					    });
					    task.save();
					    
					    
					    var url = Ti.App.Properties.getString('uri') + '/api/cazanoticias/guardarusuario';
						var xhr=Titanium.Network.createHTTPClient();    
					    xhr.open("POST", url);
					 
					    xhr.onload = function(){
					     if(this.status == '200'){
					        console.log('Transmission successful!');
					        loading.hide();
							Alloy.createController("principal",{token:"ok"}).getView().open();
					     }else{
					        console.log('Transmission failed. Try again later. ' + this.status + " " + this.response);
					     }          
					    };
					 
					    xhr.onerror = function(e){console.log('Transmission error: ' + e.error);};
					 
					    xhr.setRequestHeader("Content-Type", "application/json");
					 	var postData = {
					 		id:parseado.id, name:parseado.name, email:parseado.email, sexo:parseado.gender, link:urlUsar.toString(), tipo:'Basico'
						};
						xhr.send(JSON.stringify(postData));

						console.log(JSON.stringify(postData));
					    
					    
					    
					    
						
					},
					onerror: function (e) {	alert("error");},
					timeout:5000
				});
				xhr.open('GET',url);
				xhr.send();
			        
			    } else if (e.error) {
			        alert(e.error);
			    } else {
			        alert('Unknown response');
			    }
			});
		}        
        
    } else if (e.error) {
        // Error!
    } else if (e.cancelled) {
        // cancelled by user
    }
}

// The facebook logout handler
function facebookLogoutHandler(e) {
    if (e.success) {
        var client = Titanium.Network.createHTTPClient();
        client.clearCookies('https://login.facebook.com');
    } else if (e.error) {
        // Error!
    } 
}

function cerrarApp (e) {
  	$.ventana.close();
}


if(facebook.loggedIn){
	var user = Alloy.Globals.user;
	if(!user.hasOwnProperty("id")){
		facebook.logout();
			
		var db=Ti.Database.open('_alloy_');
		var deleteRecords=db.execute('DELETE FROM usuarios');
		db.close();
	}
}
