$(document).ready(function() {

/**
 * Creates the ct namespace for the chatapp widget
 * @name ct
 */
var ct = {}; 

/**
 * An array of possible names for the user. Randomly generated.
 */
ct.names = ["meatPopsicle", "pilez", "madeMan", "wiseGuy"];

/**
 * Randomly choose a user name 
 */
ct.user = ct.names[Math.floor(Math.random()*4)];

/**
 * Instantiate the widgets in the DOM dynamically
 */
ct.init = function() {
   $('<h2 id="title"></h2><div id="chat"></div><textarea id="chat_input"></textarea><div id="users"></div>').appendTo('body');
   $('#title').html("Your username is: " + ct.user);

}();

/**
 * Grab the init funciton chat widget
 */
ct.scroll = document.getElementById("chat");

/**
 * Store the token
 */
ct.token = "fe60596f247178f2e94ea9ec0edde4f0c423b77c96e1c074e91de6fa"; 

/**
 * Get the current app name
 * lends ct
 * @param {string} a url representing a controller method server-side
 * @param {object} data sent along with the ajax request
 * @return {object} current app name
 */
ct.get = function(url, data) {

   return $.getJSON("http://cutetypo.com" + url + "?callback=?&token=" + ct.token, data);

};

/**
 * Send the server a message
 * 
 * @param {string} a url representing a controller method server-side
 * @param {object} data sent along with the ajax request
 * @return {boolean} success
 */
ct.send = function(url, data) {

   return $.getJSON("http://cutetypo.com" + url + "?message=" + ct.msg + "&username=" + ct.user + "&callback=?&token=" + ct.token, data);

};

/**
 * Initial interval for how far back to retrieve messages
 */
ct.int = "-1days";

/**
 * Initial grab of all the messages on load
 * 
 * @param {string} a url representing a controller method server-side
 * @param {object} data sent along with the ajax request
 * @return {object} a list of all returned messages
 */
ct.read = function(url, data) {

   return $.getJSON("http://cutetypo.com" + url + "?since=" + ct.int + "&callback=?&token=" + ct.token, data);

};

/**
 * Look for all the active users in the last 5 minutes to list in the sidebar
 * 
 * @param {string} a url representing a controller method server-side
 * @param {object} data sent along with the ajax request
 * @return {object} a list of all active users
 */
ct.userCheck = function(url, data) {

   return $.getJSON("http://cutetypo.com" + url + "?since=-5minutes" + "&callback=?&token=" + ct.token, data);

};

/**
 * Refresh the chat window at an interval
 * 
 * @param {string} a url representing a controller method server-side
 * @param {object} data sent along with the ajax request
 * @return {object} a list of all returned messages
 */
ct.ref = function(url, data) {

   return $.getJSON("http://cutetypo.com" + url + "?since=-1seconds" + "&callback=?&token=" + ct.token, data);

};

ct.refresh = function() {

   ct.ref("/message/get")
     .then(function(data) {});

}

/*ct.get("/name/get")
   .then(function(data) {  });
*/

/**
 * Call the read method of ct and add all the messages returned to the chat
 * window, then scroll to the bottom of the window
 */
ct.read("/message/get")
  .then(function(data) {

     for(var msg in data) {
      
         $("#chat").append("<p>user: " + data[msg].username + " | " + data[msg].message + "</p>");
         ct.scroll.scrollTop = 500;

     }

});

/**
 * Call the usercheck function and add the returned users to the sidebar
 */
ct.userlist = ct.userCheck("/message/get")
 .then(function(data) {
    for(var user in data) {

       $("#users").append("<p>" + data[user].username + "</p>");

    }


 });

/**
 * Listen for a keydown event on the chatbar, then call the write functions
 * sending in the set object properties to the server and append the messages
 * to the chat window
 */
$("#chat_input").keydown(function(event) {

  if(event.keyCode == '13') {
      event.preventdefault;
      ct.msg = $("#chat_input").val();
      ct.send("/message/send")
        .then(function(data) {
            
           $("#chat_input").val("");

           ct.ref("/message/get")
             .then(function(data) {

               ct.userlist;
               for(var msg in data) {
   
                  $("#chat").append("<p>user: " + data[msg].username + " | " + data[msg].message + "</p>");
                  ct.scroll.scrollTop = ct.scroll.scrollHeight;

               }

            });

      });

  };

});
/**
 * Set a recurring interval to refresh the chat window
 */
setInterval(function() {ct.ref("/message/get").then(function(data) {console.log(data);});}, 1000);

});

