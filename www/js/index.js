/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var scanner = cordova.require("cordova/plugin/BarcodeScanner");

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        
        
    }
};

function getToken() {
    alert("getToken");  
    try {
       $.ajax({
         dataType:"script",
         data:{merchant : 'xpto', details : 'tea', total : '5', callback: 'cb'},
         url:"https://164.177.149.82/vault/generatetoken.php",
         timeout: 5000
        });
    } catch(e){ 
        alert("e="+e);
    }
}

function login() {
    alert("login");  
    try { 
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        alert("e:"+email);   
        alert("p:"+password);   
        if(email != "" && password != "") {
           $.ajax({
             dataType:"script",
             data:{email : email, password : password, callback: 'CBlogin'},
             url:"https://164.177.149.82/vault/customerlogin.php",
             timeout: 5000
            });
        }
    } catch(e){ 
        alert("e="+e);
    }
}

CBlogin = function(data) {  
    alert("CBlogin");
    try {
        customerToken = data.customerToken;
        alert("t="+customerToken);   
        if (customerToken != "") {
            getCCTokens(customerToken);
        } else if data.error != "" {
            alert("e="+data.error)
        }
    } catch(e){ 
        alert("e1="+e);
    }
}

function getCCTokens(token) {
    alert("getCCTokens");
    try {
       $.ajax({
         dataType:"script",
         data:{token : token, callback: 'CBgetCCTokens'},
         url:"https://164.177.149.82/vault/getcctokens.php",
         timeout: 15000
        });
    } catch(e){ 
        alert("e="+e);
    }
}

cb = function (data) {  
    try {
        alert("d=" +data.token);
    } catch(e){ 
        alert("e1="+e);
    }
}

function goPool() {
    $.ajax({
        url: "/server/api/function",
        type: "GET",
        success: function(data) {
            console.log("polling");
        },
        dataType: "json",
        complete: setTimeout(function() {poll()}, 5000),
        timeout: 15000
    })
}

function goScan() {
    
       scanner.scan(
          function (result) {
              alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          }, 
          function (error) {
              alert("Scanning failed: " + error);
          }
       );
}



