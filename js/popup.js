/*
     _ _____      _     _
    (_)___ /_   _(_)___(_) ___         ___ ___  _ __ ___
    | | |_ \ \ / / / __| |/ _ \       / __/ _ \| '_ ` _ \
    | |___) \ V /| \__ \ | (_) |  _  | (_| (_) | | | | | |
    |_|____/ \_/ |_|___/_|\___/  (_)  \___\___/|_| |_| |_|

    Copyright 2016 Félix Brezo and Yaiza Rubio (i3visio, contacto@i3visio.com)

    This file is part of Target Blank Alert. You can redistribute it and/or 
    modify it under the terms of the GNU General Public License as published 
    by the Free Software Foundation, either version 3 of the License, or (at 
    your option) any later version.

    This program is distributed in the hope that it will be useful, but 
    WITHOUT ANY WARRANTY; without even the implied warranty of 
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General 
    Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //alert(request.greeting["GLOBAL"]);
    
    // Grabbing the notice
    var maincontent = document.getElementById("infoNotice");
    
    if (request.greeting["GLOBAL"]>0) {
        maincontent.innerHTML = '<div class="notice error">Se han encontrado ' + request.greeting["GLOBAL"] + ' enlaces sospechosos en esta página web. </div>';
        
        maincontent.innerHTML += "<p>La distribución de enlaces sospechosos es la siguiente:</p>";
        maincontent.innerHTML += "<ul>";
        maincontent.innerHTML += '<li><i class="fa fa-chrome"></i> Sin el atributo <code>noopener</code>: <b>' + request.greeting["chrome"]  +  '</b></li>';
        maincontent.innerHTML += '<li><i class="fa fa-firefox"></i> Sin el atributo <code>noreferrer</code>: <b>' + request.greeting["firefox"]  +  '</b></li>';
        maincontent.innerHTML += "</ul>";
        
        // TODO: Activating buttons

    }
    else {
        maincontent.innerHTML = '<div class="notice success">¡Bien! No se han encontrado enlaces sospechosos en esta página web. </div>';
        
        // TODO: Activating buttons

    }
  });

// We send a message to the content
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {task: "recover_vulnerable_links"}, function(response) {});  
});
