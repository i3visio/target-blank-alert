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
// Initializing the vulnerable vars 
var vulnerables = {};
vulnerables["GLOBAL"] = 0;
vulnerables["chrome"] = 0;
vulnerables["firefox"] = 0;

var elements = document.getElementsByTagName('a');

// Iterating through all the elements in the HTML code
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var target = element.getAttribute("target");
    
    var thisLinkIsVulnerable = false;

    if (target == "_blank") {
        var rel = element.getAttribute("rel");
        
        if (rel == null)  {
            vulnerables["firefox"] += 1;
            vulnerables["chrome"] += 1;
            
            thisLinkIsVulnerable = true;
        }
        else {
            if (rel.indexOf("noopener") == -1) {
                vulnerables["chrome"] += 1;
                thisLinkIsVulnerable = true;
            }
            if (rel.indexOf("noreferrer") == -1)  {
                vulnerables["firefox"] +=1;
                
                thisLinkIsVulnerable = true;
            }
        }
    }
    
    if (thisLinkIsVulnerable) {
        vulnerables["GLOBAL"] += 1;
    }
}

chrome.runtime.sendMessage({greeting: vulnerables}, function(response) {
  //alert("Background said: " + response.task);
});


// Listener to capture the message of an update needed to change the badge
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.task == 'recover_vulnerable_links') {
    chrome.runtime.sendMessage({greeting: vulnerables}, function(response) {
      //alert("Background said: " + response.task);
    });
  }
});
