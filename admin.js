var registerpid;

$(document).ready(function(){
    
     // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAP1W3p7FCUVOLNZYu12pLzVC5gjniXh9A",
        authDomain: "waterflowmonitoring-481b6.firebaseapp.com",
        databaseURL: "https://waterflowmonitoring-481b6.firebaseio.com",
        projectId: "waterflowmonitoring-481b6",
        storageBucket: "waterflowmonitoring-481b6.appspot.com",
        messagingSenderId: "338752954453"
    };
  
    firebase.initializeApp(config);
    
    $('.product').hide();
    $('.user').hide();
    $('#changes').css("box-shadow" , "0 12px 16px 0 rgba(0,0,0,0.5), 0 17px 50px 0 rgba(0,0,0,0.5)");
    
    var aname = localStorage.getItem("adminname");
    
    $('#logoutbtn').on({
        click: function(){
            localStorage.setItem("adminname" ,"");
            location.replace("home.html");
        }
    });
    
    $('#changes').on({
        click: function(){
            $('.user').hide();
            $('.product').hide();
            $('.changes').show();
            $(this).css("box-shadow" , "0 12px 16px 0 rgba(0,0,0,0.5), 0 17px 50px 0 rgba(0,0,0,0.5)");
            $("#addproduct").css("box-shadow" , "none");
            $("#adduser").css("box-shadow" , "none");
        }
    });
    
    $('#addproduct').on({
        click: function(){
            $('.user').hide();
            $('.product').show();
            $('.changes').hide();
            $(this).css("box-shadow" , "0 12px 16px 0 rgba(0,0,0,0.5), 0 17px 50px 0 rgba(0,0,0,0.5)");
            $("#changes").css("box-shadow" , "none");
            $("#adduser").css("box-shadow" , "none");
        }
    });
    
    $('#adduser').on({
        click: function(){
            $('.user').show();
            $('.product').hide();
            $('.changes').hide();
            $(this).css("box-shadow" , "0 12px 16px 0 rgba(0,0,0,0.5), 0 17px 50px 0 rgba(0,0,0,0.5)");
            $("#addproduct").css("box-shadow" , "none");
            $("#changes").css("box-shadow" , "none");
        }
    });
    
    var nameref = document.getElementById('adminname');
    nameref.innerText = "Admin Name : " + aname;
    
    $('#registerbtn').on({
        click: function(){
            
            var insertpid = $('#insertpid').val();
            
            if(insertpid === ""){
                window.alert("field is empty");
            }else{
                var productref = firebase.database().ref().child('PRODUCT');
                var pidref = productref.child(insertpid);
                var returnval;
                
                pidref.once( 'value' , snap => {
                    returnval = snap.val();
                    if(returnval == null){
                        
                        pidref.set({
                            value: "0",
                            status: "off",
                            register: "no",
                            'added by': aname
                        });
                        
                        window.alert("Successfully registered.");
                        $('#insertpid').val("");
                        
                    }else{
                        window.alert('This Product is already registered');
                        $('#insertpid').val("");
                    }
                    
                });
                
            }
        }
    });
    
    $('#removebtn').on({
        click: function(){
            
            var removepid = $('#removepid').val();
            
            if(removepid === ""){
                window.alert("field is empty");
            }else{
                var productref = firebase.database().ref().child('PRODUCT');
                var pidref = productref.child(removepid);
                var returnval;
                
                pidref.child('added by').once( 'value' , snap => {
                    returnval = snap.val();
                    if(returnval == null){
                        window.alert("this product doesn't exiest.");
                    }else if(returnval === aname){
                        
                        pidref.remove();
                        window.alert("Successfully removed.");
                        $('#removepid').val("");
                        
                    }else{
                        window.alert("You can't remove this product. ");
                        $('#removepid').val("");
                    }
                    
                });
            }
            
        }
    });
    
    $('#userbtn').on({
        click: function(){
            
            var username = $('#username').val();
            var upswd = $('#userpswd').val();
            var rupswd = $('#userrpswd').val();
            var pid = $('#userpid').val();
            
            if(username == "" || upswd == "" || rupswd == "" || pid == ""){
                window.alert("some fields are empty.");
            }else{
                
                var isnum=false;
                var isalpha=false;
            
                var length = username.length;
            
                if(length >=10){
                    var i=0;
                    for(i=0;(i<length)&&(isnum==false || isalpha==false);i++){
                        var ch = username.charAt(i);
                        if((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')){
                            isalpha=true;
                        }
                        if((ch >= '0' && ch <= '9')){
                            isnum=true;
                        }
                    }
                }
            
                if(isnum == false || isalpha == false || length<10){
                    window.alert('User Name must be contain alphabets and numbers both and length must be atleast 10.')
                }else{
                
                    var nameref = firebase.database().ref().child('PUBLIC').child(username);
                
                    nameref.once( 'value' , snap => {
                    
                        var returnval = snap.val();
                    
                        if(returnval == null){
                            
                            if(upswd === rupswd){
                                
                                var productref = firebase.database().ref().child('PRODUCT').child(pid).child('register');
                                
                                productref.once('value' , snapshot=>{
                                    
                                    var ret = snapshot.val();
                                    
                                    if(ret == null){
                                        window.alert('you have to register that product first.')
                                    }else if(ret == "yes"){
                                        window.alert('this product is already registered for another user');
                                    }else if(ret == "no"){
                                        
                                        productref.set("yes");
                                        
                                        nameref.set({
                                            'added by': aname,
                                            password: upswd,
                                            'product id': pid
                                        });
                                        
                                        window.alert('Successfully registered.') 
                                        $('#username').val("");
                                        $('#userpswd').val("");
                                        $('#userrpswd').val("");
                                        $('#userpid').val("");
                                    }
                                    
                                });
                                
                            }else{
                                window.alert('Password does not match.');
                            }
                            
                        }else{
                            window.alert('this user name has already been taken.');
                        }
                    });
                
                }
            }
        }
    });
    
    
});