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

// Testing if the URL provided is in fact an URL
function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/*
    The configuration file is a Json with the following structure:
        {
            "numSearchResults" : 5,
            "forgetResults" : false,
            "currentProfile": "profile1",
            "profiles": {
                "profile1" : {
                    "url": "http://localhost:8080/OpenKM/",
                    "username": "username",
                    "password": "password"
                }
            }
        }
*/

function saveConfiguration() {
    console.log("options.js: Save configuration");
    
    // Get a value saved in a form.
    var dictConfig = {};
    dictConfig["profiles"] = {};
    dictConfig["currentProfile"] = "profile1";
    dictConfig["numSearchResults"] = 5;
    dictConfig["forgetResults"] = false;

    // Setting up the profiles
    var dictProfile = {};
    dictProfile["url"] = document.getElementById('texURL').value;
    dictProfile["username"] = document.getElementById('texUsername').value;
    dictProfile["password"] = document.getElementById('texPassword').value;

    dictConfig["profiles"]["profile1"] = dictProfile;

    var textConfig = JSON.stringify(dictConfig, null, 4);

    console.log("options.js: " + textConfig);

    if (!validateURL(dictProfile["url"])) {
        // Showing warning message
        document.getElementById('optMessage').innerHTML = "<div class='notice warning'><i class='icon-warning-sign icon-large'></i> " + "WARNING: URL not valid! Configuration will NOT  be stored unless corrected." + "<a href='#close' class='icon-remove'></a></div>";
        alert("URL not valid!");
        
        return false;
    }
    else if (dictProfile["username"] == "" || dictProfile["password"] == "") {
        // Showing warning message
        document.getElementById('optMessage').innerHTML = "<div class='notice warning'><i class='icon-warning-sign icon-large'></i> " + "WARNING: User or password not provided. Configuration will NOT  be stored unless corrected." + "<a href='#close' class='icon-remove'></a></div>";
        return false;
    }

    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'config': dictConfig}, function() {
        // Notify that we saved.
        console.log("Settings saved");
        // Showing warning message
        alert(chrome.i18n.getMessage(aleConfigurationSaved));
        document.getElementById('optMessage').innerHTML = "<div class='notice success'><i class='icon-ok icon-large'></i> " + "SUCCESS!" + "<a href='#close' class='icon-remove'></a></div>";
    });
    
    console.log("Sending reload message...");
    // Sending message of task completed to let the scripts reload the information
    chrome.runtime.sendMessage({done: true});
    document.getElementById('optMessage').innerHTML = "<div class='notice success'><i class='icon-ok icon-large'></i> " + "SUCCESS!" + "<a href='#close' class='icon-remove'></a></div>";

    window.close();

    return true;
}

/*
    Grabbing the configuration and seting it into the UI.
*/
document.addEventListener('DOMContentLoaded', function () {
    console.log("Grabbing the current configuration...");
    // Grabbing the configuration
    chrome.storage.sync.get("config", function (storage) {
        var dictConfig = storage["config"];

        if (!validateURL(dictConfig["profiles"][dictConfig["currentProfile"]]["url"])) {
            alert(chrome.i18n.getMessage(msgNotFoundValidConfig));
            document.getElementById('optMessage').innerHTML = "<div class='notice error'><i class='icon-remove-sign icon-large'></i> " + "ERROR" + "<a href='#close' class='icon-remove'></a></div>";
            alert("Url not valid!");
        }
        else if (dictConfig["profiles"][dictConfig["currentProfile"]]["username"] == "" || dictConfig["profiles"][dictConfig["currentProfile"]]["password"] == "") {
            // Showing warning message
            document.getElementById('optMessage').innerHTML = "<div class='notice error'><i class='icon-remove-sign icon-large'></i> " + "ERROR" + "<a href='#close' class='icon-remove'></a></div>";
            alert("User or password not provided");
        }


        // Saving the configuration:
        //      - texURL
        //      - texUsername
        //      - texPassword

        // Inserting the URL into the UI
        try {
            var element = document.getElementById('texURL');
            element.value = dictConfig["profiles"][dictConfig["currentProfile"]]["url"];
        }
        catch(e){
            console.log("ERROR: There is no URL in the current configuration.");
        }

        // Inserting the username into the UI
        try {
            var element = document.getElementById('texUsername');
            element.value = dictConfig["profiles"][dictConfig["currentProfile"]]["username"];
        }
        catch(e){
            console.log("ERROR: There is no username in the current configuration.");
        }

        // Inserting the password into the UI
        try {
            var element = document.getElementById('texPassword');
            element.value = dictConfig["profiles"][dictConfig["currentProfile"]]["password"];
        }
        catch(e){
            console.log("ERROR: There is no password in the current configuration.");
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('butSave').addEventListener('click', saveConfiguration);
});
