var line , lineData , lastlabel;

function drowChart(){
    
    new Chart(line).Line(lineData);
    
}


$(document).ready(function(){
    
    line = document.getElementById('chart').getContext('2d');
    
    lineData = {
        
        labels : [0],
        
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "#878BB6",
                pointColor : "#fff",
                pointStrokeColor : "#878BB6",
                data : [0]
            }
        ]
    };
    
    lastlabel = lineData.labels[lineData.labels.length-1];
    
    drowChart();
    
    $('#turnbtn').hide();
    $('.graph').hide();    
    $('.changepubliccontent').hide();
    
    $('#graphshow').css("border", "2px solid darkviolet");
    $('#graphshow').css("background-color", "transparent");
    $('#graphshow').css("color", "darkviolet");
    
    var pname = localStorage.getItem("publicname");
    var ppid = localStorage.getItem("publicpid");
    
    
    $('#graphshow').on({
        click: function(){
            $('.graph').show();
            $('.changepubliccontent').hide();
            $('#graphshow').css("border", "2px solid darkviolet");
            $('#graphshow').css("background-color", "transparent");
            $('#graphshow').css("color", "darkviolet");
            $('#changebtn').css("border", "none");
            $('#changebtn').css("background-color", "darkviolet");
            $('#changebtn').css("color", "white");
        }
    });
    
    $('#changebtn').on({
        click: function(){
            $('.graph').hide();
            $('.changepubliccontent').show();
            $('#changebtn').css("border", "2px solid darkviolet");
            $('#changebtn').css("background-color", "transparent");
            $('#changebtn').css("color", "darkviolet");
            $('#graphshow').css("border", "none");
            $('#graphshow').css("background-color", "darkviolet");
            $('#graphshow').css("color", "white");
        }
    });
    
    $('#deletebtn').on({
        click: function(){
            
        }
    });
    
    $("#logoutbtn").on({
        click: function(){
            localStorage.setItem("publicpid" , "");
            localStorage.setItem("publicname" , "");
            location.replace("home.html");
        }
    });
    
    
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
    
    
    
    var reading = 0;
    var count = 1;
    
    var machine_stat="off";
    
    var publicref = firebase.database().ref().child('PUBLIC').child(pname);
    var productref = firebase.database().ref().child('PRODUCT').child(ppid);
    
    var addbyref = publicref.child('added by');
    var valueref = productref.child('value');
    var statusref = productref.child('status');

    var name = document.getElementById('p_name');
    var pid = document.getElementById('p_pid');
    var addby = document.getElementById('p_addby');
    var value = document.getElementById('p_value');
    var status = document.getElementById('p_status');
    
     
    
    $("#turnbtn").on({
        click: function(){
            
            if(machine_stat === "on"){
                
                statusref.set("off");
                valueref.set("0");
                
            }else if(machine_stat === "off"){
                
                statusref.set("on");
                valueref.set("10");
                
            }
        }
    });
    
    name.innerText = "User Name : " + pname;
    pid.innerText = "Product ID : " + ppid;
    addbyref.once( 'value' , snap => addby.innerText = "Added By : " + snap.val());
    statusref.on( 'value' , snap => {
        status.innerText = "Current Status : " + snap.val();
        machine_stat=snap.val();
        $('#turnbtn').show();
        $('.graph').show();
        if(machine_stat === "on"){
            $('#turnbtn').attr({ "value" : "turn it off"});
        }else if(machine_stat === "off"){
            $('#turnbtn').attr({ "value" : "turn it on"});
        }
    });
    
    valueref.on( 'value' , snap =>{
        value.innerText = "Current Value : " + snap.val();
        reading = snap.val();
    });
    
    setInterval(function(){
        
//        console.log(lineData.labels);
//        console.log(lineData.datasets[0].data);
        
		var ll = ++lastlabel
        lineData.labels.push(ll);
        lineData.datasets[0].data.push(reading);
        
        if(count >= 7){
            lineData.labels.shift();
            lineData.datasets[0].data.shift();
        }else{
            count++;
        }
        
        drowChart();

    }, 2000);
    
});