/***************************************************************
 *  Copyright notice
 *
 *  (c) 2013 Aleksandar Glisovic <gsorry@gmail.com>
 *  
 *  All rights reserved
 *
 *  You can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 * RemoteImage Titanium module.
 *
 * @author Aleksandar Glisovic <gsorry@gmail.com>
 * @link http://www.gsorry.com/
 */
module.exports.createImageView = function(a) {
    
    // CHECK FOR PROPERTIES
    a = a || {};
    
    // ADD DEFAULT IMAGE
    var remoteImage = a.image; 
    a.image = '/images/empty_photo.png'; // CHANGE THIS TO YOUR PATH
    
    // CREATE IMAGE VIEW
    var image = Ti.UI.createImageView(a);
    
    var localImageName = Ti.Utils.md5HexDigest(remoteImage) + '.' + remoteImage.split('.').pop();
    
    var localImage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'remoteImages', localImageName);
    
    if (localImage.exists()) {
        localImage.deleteFile();
        localImage = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'remoteImages', localImageName);
    }
    
    var localDirectory = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'remoteImages');
    
    if (!localDirectory.exists()) {
        localDirectory.createDirectory();
    }
    
    var xhr = Ti.Network.createHTTPClient();
    xhr.open('GET', remoteImage);
    xhr.onload = function() {
        if (xhr.status == 200) {
            localImage.write(xhr.responseData);
            image.image = localImage.nativePath;
            if (a.onload) { a.onload(); } // TRIGGER CALLBACK FUNCTION
        }
    }
    xhr.send();
    
    return image;
}