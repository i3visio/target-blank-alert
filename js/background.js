/*
     _ _____      _     _
    (_)___ /_   _(_)___(_) ___         ___ ___  _ __ ___
    | | |_ \ \ / / / __| |/ _ \       / __/ _ \| '_ ` _ \
    | |___) \ V /| \__ \ | (_) |  _  | (_| (_) | | | | | |
    |_|____/ \_/ |_|___/_|\___/  (_)  \___\___/|_| |_| |_|

    Copyright 2016 Félix Brezo and Yaiza Rubio (i3visio, contacto@i3visio.com)

    This file is part of Kamify. You can redistribute it and/or 
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
    // Defining colors in RGBA [Red, Green, Blue, Alpha (Transparency)] in a range from 0 to 255.
    var colors = {};
    colors["red"] = [128, 0, 0, 255];
    colors["green"] = [0, 128, 0, 255];
    colors["blue"] = [0, 0, 128, 255];
                
    chrome.browserAction.setBadgeText({"text": request.greeting["GLOBAL"].toString()});
    
    if (request.greeting["GLOBAL"] > 0) {
        chrome.browserAction.setBadgeBackgroundColor({ color: colors["red"] }); 
    }
    else {
        chrome.browserAction.setBadgeBackgroundColor({ color: colors["green"] }); 
    }
    
    sendResponse({farewell: "Badge Should be set..."}); 
  });
