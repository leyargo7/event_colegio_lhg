const socket = io();

//var conteoIn;

//DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let cont = document.getElementById('cont');
let city = document.getElementById('city');
let codeIngreso = document.getElementById('nameDB').innerHTML;

socket.emit('codeUser', codeIngreso);

//datos que se envian en la ventana de chat
btn.addEventListener('click', function ()
{
    if (username.value == '')
    {
        alert('Escribe tu nombre');
    }else{
        socket.emit('chat:message', 
        {
            message: message.value,
            username: username.value,
            city: city.value,
            ingreso: codeIngreso
        });
        message.value = '';
        username.style.display = 'none';
        city.style.display = 'none';
    }

        // socket.emit('chat:message', 
        // {
        //     message: message.value,
        //     username: username.value
            
        // });
        // message.value = '';
        // username.style.display = 'none';
});

message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username);
});

message.addEventListener('keyup', function(e){
    if(e.key === 'Enter'){
        socket.emit('chat:message', {
            message: message.value,
            username: username.value,
            city: city.value,
            ingreso: codeIngreso
        });
        message.value = '';
        username.style.display = 'none';
        city.style.display = 'none';
    }
    
});


//datos que devuelve el servidor
socket.on('messageServer', function (data) {
    actions.innerHTML = '';
    output.innerHTML += `<p>
    <strong>${data.username}</strong>: ${data.message}
    </p>`;
    cont.scrollTop = cont.scrollHeight;
});


// socket.emit('dataUser', {

// });


socket.on('load old msgs', msgs => {
    
    msgs.forEach(item => {
        output.innerHTML += `<p>
        <strong>${item.username}</strong>: ${item.message}
        </p>`;
        cont.scrollTop = cont.scrollHeight; 
    });
    //console.log(msgs);
    // for(let i=0; i<msgs.length; i++){
    //     displayMsg(msgs[i]);
    // }
});
// socket.on('server:typing', function (data) {
//     actions.innerHTML = `<p><em>${data} está escribiendo</em></p>`
// });

// socket.on('userConn', function (numberClient) {
//     var conteoIn = numberClient;
//     console.log(conteoIn + 'hey');
// });

// socket.on('userDes', function (numberClientDes){
//     var conteoOut = numberClientDes
//     console.log(conteoOut + 'quedan');
// });

