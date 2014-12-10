exports.LoadRemoteImage = function (obj,url) {
   var xhr = Titanium.Network.createHTTPClient();

    xhr.onload = function()
    {
     Ti.API.info('image data='+this.responseData);
     /*obj.borderColor="black";
     obj.borderWidth=1;*/
     obj.image=this.responseData;

    };
    // open the client
    xhr.open('GET',url);

    // send the data
    xhr.send();
};