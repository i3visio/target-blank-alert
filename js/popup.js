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
    var butTweetThis = document.getElementById("tweetThis");
    var butContactAdmin = document.getElementById("contactAdmin");

    if (request.info.greeting["GLOBAL"]>0) {
        maincontent.innerHTML = '<div class="notice error">' + chrome.i18n.getMessage("texErrors1") + request.info.greeting["GLOBAL"] +  chrome.i18n.getMessage("texErrors2") + '</div>';

        maincontent.innerHTML += "<p>" + chrome.i18n.getMessage("texRelation") + ":</p>";
        maincontent.innerHTML += "<ul>";
        maincontent.innerHTML += '<li><i class="fa fa-chrome"></i><code>noopener</code>: <b>' + request.info.greeting["chrome"]  +  '</b></li>';
        maincontent.innerHTML += '<li><i class="fa fa-firefox"></i><code>noreferrer</code>: <b>' + request.info.greeting["firefox"]  +  '</b></li>';
        maincontent.innerHTML += "</ul>";

        // ACtivating Twitter button
        butTweetThis.setAttribute("href", "https://twitter.com/intent/tweet?button_hashtag=FixTargetBlankVulnerability " + chrome.i18n.getMessage("texVulnFound") + ": " + request.info.url);
        butTweetThis.setAttribute("disabled", "false");

        // Activating contact with the admin button
        butContactAdmin.setAttribute("href", "https://domaintools.com/" + request.info.host);
        butContactAdmin.setAttribute("disabled", "false");
        butContactAdmin.setAttribute("class", "button orange small");
    }
    else {
        maincontent.innerHTML = '<div class="notice success">' + chrome.i18n.getMessage("texNoErrors") + ' </div>';

        // ACtivating Twitter button
        butTweetThis.setAttribute("href", "https://twitter.com/intent/tweet?button_hashtag=FixedTargetBlankVulnerability! " + chrome.i18n.getMessage("texVulnNotFound")  + ": " + request.info.url);
        butTweetThis.setAttribute("disabled", "false");
    }
  });

// We send a message to the content
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {task: "recover_vulnerable_links"}, function(response) {

    });
});
