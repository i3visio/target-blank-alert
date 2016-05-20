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

function getFileIconCode (mimeType) {
    if (mimeType == "application/pdf") {
        return "<i class='fa fa-file-pdf-o'></i>";
    } else if (mimeType == "text/plain") { 
        return "<i class='fa fa-file-text-o'></i>";
    } else if (mimeType == "application/msword") { 
        return "<i class='fa fa-file-word-o'></i>";
    } else if (mimeType == "application/vnd.ms-excel"){ 
        return "<i class='fa fa-file-excel-o'></i>";
    } else if (mimeType == "application/vnd.ms-powerpointtd"){ 
        return "<i class='fa fa-file-powerpoint-o'></i>";
    } else if (mimeType == "application/zip"){ 
        return "<i class='fa fa-file-zip-o'></i>";
    } else if (mimeType == "text/html"){ 
        return "<i class='fa fa-file-code-o'></i>";
    } else {
        return "<i class='fa fa-file-o'></i>";
    }
}


function generateHtmlResults(jsonDict, baseUrl) {
    // Grabbing the results
    var results = jsonDict["queryResults"]["queryResult"];

    var html = "<div class='callout callout-top clearfix'>";

    html += "<h6><i class='fa fa-list-alt fa-lg'></i> Resultados: " + results.length.toString()+ "</h6>";
    
    html += "<table class='tight' cellspacing='0' cellpadding='0'><br>";
    html += "<thead></thead><br>";

    //Body
    html += '<tbody><br>';
    


    for (var k = 0; k < results.length; k++) {
        var res = results[k];
        
        var newRow = "<tr class='result'>";
        // Setting the file name and the Download link
        newRow += "<docname>" + getFileIconCode (res["document"]["mimeType"] ) + " <a target='_blank' href='" + baseUrl + "OpenKM/Download?path=/" + res["document"]["path"] + "'>" + res["document"]["path"].substring(res["document"]["path"].lastIndexOf('/')+1)+ "</a></docname>";
        newRow += "<date>Date: " + res["document"]["actualVersion"]["created"].toString()+ "</date><br><br>";
        
        // Adding the excerpt if it exists
        try {
            if (res["excerpt"].toString() == "undefined") {
                newRow += "<i>[N/F]</i>";
            }
            else {
                newRow += "<i class='fa fa-quote-left'></i><excerpt>[...] " +res["excerpt"] + "[...]</excerpt><i class='fa fa-quote-right'></i>";
            }
        }
        catch (e) {
            newRow += "<i>--</i>";
        }
        
        newRow+="</tr><hr><br>";

        html += newRow;
    }
    
    // Closing the results
    html += "</tbody><br>";
    html += "</table>";

    html += "</div>";

    return html;
}


// Executing the Query towards OpenKM
function runQuery() {
    // Grabbing the configuration
    chrome.storage.sync.get("config", function (storage) {
        var dictConfig = storage["config"];
        
        //var apiUrl = "https://connect.h4ck.me:8443/";
        //var apiUrl = "http://217.160.143.32:8080/";
        var apiUrl = dictConfig["profiles"][dictConfig["currentProfile"]]["url"];
        
        var requestUrl = apiUrl + "OpenKM/services/rest/search/findByContent?content=" + document.getElementById("texQuery").value;

        var xhr = new XMLHttpRequest();

        xhr.open("GET", requestUrl, false);

        //xhr.setRequestHeader("Authorization", "Basic " + btoa("okmAdmin" + ":" + "OpenKMi3visio15?"));
        xhr.setRequestHeader("Authorization", "Basic " + btoa(dictConfig["profiles"][dictConfig["currentProfile"]]["username"] + ":" + dictConfig["profiles"][dictConfig["currentProfile"]]["password"]));
        xhr.setRequestHeader("Accept", "application/json; indent=4");
        xhr.send();

        // To-DO: Generate output HTML files
        var html = generateHtmlResults(JSON.parse(xhr.responseText), dictConfig["profiles"][dictConfig["currentProfile"]]["url"]);
        
        document.getElementById("results").innerHTML = html;
        
    });
}


document.addEventListener('DOMContentLoaded', function () {
    // Adding the main listener
    document.getElementById('butSearch').addEventListener('click', runQuery);
});


/*
    Grabbing the configuration and seting it into the UI.
*/
document.addEventListener('DOMContentLoaded', function () {
    //console.log("Grabbing the current configuration...");
    
    // Grabbing the configuration
    chrome.storage.sync.get("config", function (storage) {
        var dictConfig = storage["config"];

        if (!validateURL(dictConfig["profiles"][dictConfig["currentProfile"]]["url"])) {
            //alert(chrome.i18n.getMessage(msgNotFoundValidConfig));
            document.getElementById('seaMessage').innerHTML = "<div class='notice error'><i class='icon-remove-sign icon-large'></i> " + "ERROR" + "<a href='#close' class='icon-remove'></a></div>";
            alert("Url not valid!");
        }
        else if (dictConfig["profiles"][dictConfig["currentProfile"]]["username"] == "" || dictConfig["profiles"][dictConfig["currentProfile"]]["password"] == "") {
            // Showing warning message
            document.getElementById('seaMessage').innerHTML = "<div class='notice error'><i class='icon-remove-sign icon-large'></i> " + "ERROR" + "<a href='#close' class='icon-remove'></a></div>";
            alert("User or password not provided");
        }
    });
});



