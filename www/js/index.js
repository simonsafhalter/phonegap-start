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

var TVA = {
    
    customerToken: "",
    CCTokens: null,
    order: {
            total: null,
            details: null,
            merchant: null
           }
}

/////////////////////// LOGIN ///////////////////////

function login() {  
    alert("login");
    try { 
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        alert(email);
        alert(password);
        if(email != "" && password != "") {
           alert("ajax");
           $.ajax({
             dataType:"json",
             
             error: function(xhr, textStatus, errorThrown){
                 alert(xhr.responseText);
                 alert(textStatus);
                 alert(errorThrown);
             },
             success: function(){alert("successjson");},
             data:{email : email, password : password/*, callback: 'CBlogin'*/},
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
        TVA.customerToken = data.customerToken;  
        alert("ct="+TVA.customerToken);
        
        if (typeof TVA.customerToken != "undefined" && TVA.customerToken != "") {
            document.getElementById("welcomeuser").innerHTML = "Welcome " + TVA.customerToken;
            getCCTokens(TVA.customerToken);
            $("#loginscreen").hide();
            $("#mainscreen").show();
        } else if (data.error != "") {
            alert("e="+data.error)
        }
    } catch(e){ 
        alert("e="+e);
    }
}

/////////////////////// CreditCard TOKENS ///////////////////////

function getCCTokens(token) {
    alert("getCCTokens");
    try {
       $.ajax({
         dataType:"script",
         data:{customerToken : token, callback: "CBgetCCTokens"},
         url:"https://164.177.149.82/vault/getcctokens.php",
         timeout: 5000
        });
    } catch(e){ 
        alert("e="+e);
    }
}

CBgetCCTokens = function(data) {  
    alert("CBgetCCTokens");
    try {
        TVA.CCtokens = data;
        for(var i = 0; i < TVA.CCtokens.length; i++) {
            // ADD TABLE
            var table=document.getElementById("tokenTable");
            var row=table.insertRow(i+1);
            var cell1=row.insertCell(0);
            var cell2=row.insertCell(1);
            cell1.innerHTML=TVA.CCtokens[i].token;
            cell2.innerHTML=TVA.CCtokens[i].description;
            
            // ADD RADIO BUTTONS
            var radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', 'cc');
            radioInput.setAttribute('value', TVA.CCtokens[i].token);
            
            var span = document.createElement('span');
            span.innerHTML = TVA.CCtokens[i].description;
            
            var form = document.getElementById("ccradioform");
            form.appendChild(radioInput);
            form.appendChild(span);
            form.appendChild(document.createElement("br"));
        }
    } catch(e){ 
        alert("e="+e);
    }
}

/////////////////////// get order details ///////////////////////

function getOrderDetails() {
    transactionToken = document.getElementById('orderDetailsToken').value;
    //alert("tt:"+transactionToken);   
    //alert("ct:"+TVA.customerToken);   
    try {
       $.ajax({
         dataType:"script",
         data:{customerToken : TVA.customerToken, transactionToken: transactionToken, callback: "CBgetOrderDetails"},
         url:"https://164.177.149.82/vault/getorderdetails.php",
         timeout: 5000
        });
    } catch(e){ 
        alert("e="+e);
    }
}

CBgetOrderDetails = function(data) {  
    try {
        
        if (typeof data.error != "undefined") {
            alert(data.error);
        } else {
            TVA.order.total = data.total;
            TVA.order.details = data.details;
            TVA.order.merchant = data.merchant;
            
            var r=confirm("Total: " + TVA.order.total + 
                          "\nDetails: " + TVA.order.details + 
                          "\nMerchant: " + TVA.order.merchant);
                          
            if (r==true) {
                alert("Confirming payment!");
                $("#mainscreen").hide();
                $("#popupcc").show();        
            } else {
                alert("Cancelling payment!");
            }              
        }
    } catch(e){ 
        alert("e="+e);
    }
}

/////////////////////// Choose CC, DO Payment! ///////////////////////

function chooseCCandDOpayment() {
    selectedCC = $('input[name="cc"]:checked').val();
    alert("selectedCC="+selectedCC)
    $.ajax({
     dataType:"script",
     data:{ccToken : selectedCC, transactionToken: transactionToken, callback: "CBchooseCC"},
     url:"https://164.177.149.82/vault/dopayment.php",
     timeout: 5000
    });
}

CBchooseCC = function(data) {  
    try {
        payment = data.payment;
        if (payment=="accepted") {
            document.getElementById('paymentresponse').innerHTML = "Payment successfull!";
        } else {
            document.getElementById('paymentresponse').innerHTML = "Payment error." + data.error;   
        }
        $("#popupcc").hide();      
        $("#result").show();
    } catch(e){ 
        alert("e="+e);
    }
}

/////////////////////// OTHER STUFF ///////////////////////


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



