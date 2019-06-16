var currentuser='PUBLIC';
    
var adminret= Infinity;
var adminname="";
var adminpassword="";
    
var publicpid="";
var publicname="";
var publicpassword="";
var pretpid=Infinity;
var pretpassword=Infinity;


function disable(){
    $('.adminact').hide();
    }

function getadminname(){
    adminname = $('#aname').val();
    }

function getadminpassword(){
    adminpassword = $('#apswd').val();
    }

function getpublicname(){
    publicname = $('#pname').val();
    }

function getpublicpassword(){
    publicpassword = $('#ppswd').val();
    }

function getpublicpid(){
    publicpid = $('#pid').val();
    }
           
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
                
                
    $("#admin").on({
        
        click:  function(){
            currentuser='ADMIN';
            $('.publicact').hide();
            $('.adminact').show();
            $('#public').css("background-color" , "gray");
            $('#public').css("color" , "white");
            $('#admin').css("background-color" , "transparent");
            $('#admin').css("color" , "gray");
        }
    });
                
    $("#public").on({
                    
        click:  function(){
            currentuser='PUBLIC';
            $('.publicact').show();
            $('.adminact').hide();
            $('#admin').css("background-color" , "gray");
            $('#admin').css("color" , "white");
            $('#public').css("background-color" , "transparent");
            $('#public').css("color" , "gray");
        }
    });
    
    
    $('#adminlogin').on({
        
       click: function(){             
            
           adminret = Infinity;
           
           adminname = $('#aname').val();
           adminpassword = $('#apswd').val();
           
           if(adminname === "" && adminpassword === ""){
               window.alert("you forgot to enter admin name and password.");
           }else if(adminname === ""){
               window.alert("you forgot to enter admin name.");
           }else if(adminpassword === ""){
               window.alert("you forgot to enter password.");
           }else{
               
               var adminpasswordref = firebase.database().ref().child(currentuser).child(adminname);
               
               adminpasswordref.once('value', snap => {
                   adminret = snap.val();
                   if(adminret === null){
                       window.alert("wrong admin name.");
                       $('#aname').val("");
                       $('#apswd').val("");
                       adminname="";
                       adminpassword="";
                       adminret = Infinity;
                   }else{
                       if(adminpassword === adminret){
                           window.alert("You are in.");
                           localStorage.setItem("adminname",adminname);
                           location.replace("admin.html")
                       }else{
                           window.alert("there is something wrong with password");
                           $('#apswd').val("");
                           adminpassword="";
                       }
                   }
               });
               
           }                  
       }                     
    });
    
    $('#publiclogin').on({
        
        click: function(){
            
            pretpassword = Infinity;
            pretpid = Infinity;
            
            publicname = $('#pname').val();
            publicpassword = $('#ppswd').val();
            publicpid = $('#pid').val();
                                    
            if(publicname === "" || publicpid === "" || publicpassword === ""){
                window.alert("you forgot one of the field below.");
            }else{
                
                var publicref = firebase.database().ref().child(currentuser).child(publicname);                
                var publicpasswordref = publicref.child('password');
                var publicpidref = publicref.child('product id');
                
                
                publicpasswordref.once( 'value' , snap =>{
                    pretpassword = snap.val();
                    publicpidref.on( 'value' , snapshot => {
                        pretpid = snapshot.val();
                        
                        if(pretpassword === null && pretpid === null){
                            window.alert("wrong user id");
                            $('#pname').val("");
                            $('#pid').val("");
                            $('#ppswd').val("");
                            publicpid="";
                            publicname="";
                            publicpassword="";
                            pretpid=Infinity;
                            pretpassword=Infinity;
                        }else if(pretpassword === publicpassword && pretpid === publicpid){
                            localStorage.setItem("publicname",publicname);
                            localStorage.setItem("publicpid",publicpid);
                            window.alert("you are in.");
                            location.replace("public.html");
                        }else{
                            window.alert("there is something wrong with password or product id.");
                            $('#pid').val("");
                            $('#ppswd').val("");
                            publicpassword="";
                            publicpid="";
                        }
                    });
                });
            }
        }
    });   
});