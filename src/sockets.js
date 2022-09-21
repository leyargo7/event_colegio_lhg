

const router = require('./routes/customer');

const fs = require('fs');
const chatDB = require('./models/chatDB');
const userDB = require('./models/datosUsers');
var UserConnected;
const client_dataC = fs.readFileSync('src/conexiones.json', 'utf-8');
let dbConexion = JSON.parse(client_dataC);

const client_dataD = fs.readFileSync('src/desconexiones.json', 'utf-8');
    let dbDesConexion = JSON.parse(client_dataD);

module.exports = function (io){
    
    // let userConnected = 0;
    // io.on('connection', (socket) =>  {
    //     console.log('new user connected');
    //     userConnected = socket.client.conn.server.clientsCount;
    //     console.log('inicio ' + userConnected);
        
    //     socket.on('chat:message', (data) => {
    //         io.sockets.emit('messageServer', data);
    //     });
    //     // socket.on('dataUser', (nombreUsuario) =>{
            
            
    //     // });
        

    //     socket.on('disconnect', ()=>{
            
    //         userConnected = userConnected - 1;
    //         console.log('salida ' + userConnected);

    //     });
    // });

    io.on('connection', async socket =>  {
        
        socket.on('codeUser', async info => {
            //console.log(info) => llega referencia

            let dataClave = await chatDB.findOne({pssIngreso: info});
            
            const que = {pssIngreso: info};
            await chatDB.findOneAndUpdate(que, { socketIn: socket.id});
            //console.log('Encontre al cliente ' + dataClave);
            //ya llega la clave al socketIn DB
        });

        UserConnected = socket.client.conn.server.clientsCount;
        countSocket = socket.id;
        console.log('new user connected ' + countSocket);
        
        let dataMessages = await userDB.find({});
        socket.emit('load old msgs', dataMessages);
        

        socket.on('chat:message', async data => {
            
            //guardar a mongoAtlas
            var newMsg = userDB({
                message: data.message,
                username: data.username,
                ciudad: data.city,
                codeIngreso: data.ingreso
            });
            await newMsg.save();
            // var newMsg = new chatDB({
            //     message: data.message,
            //     pais: data.numberSession
            // });
            // await newMsg.save();

            io.sockets.emit('messageServer', data);
            
        });

        socket.on('dataUser', (datos) =>{
            
            // let fecha= new Date();
            // let hora_actual = fecha.getHours();
            // let minutos = fecha.getMinutes();
            // let m = hora_actual + ':' + minutos;
            
            // let newConn ={    
            //     id: socket.id,
            //     nombreUsuario: datos.infoU,
            //     sesion: datos.infoS,
            //     horaEntrada: m
            // };
        
            // dbConexion.push(newConn);
            // const json_client = JSON.stringify(dbConexion);
            // fs.writeFileSync('src/conexiones.json', json_client, 'utf-8');
            
        });
        

        socket.on('disconnect', async ()=>{
            
            UserConnected = UserConnected - 1;
            console.log('user desconnected ' + socket.id);

            let identificadorSocket = socket.id;
            const que = {socketIn: identificadorSocket};
            await chatDB.findOneAndUpdate(que, { status: 'off'});

        //     let fecha= new Date();
        //     let hora_actual = fecha.getHours();
        //     let minutos = fecha.getMinutes();
        //     let n = hora_actual + ':' + minutos;

    
        // let newDes ={    
        //     id: socket.id,
        //     horaSalida: n
        // };

        // dbDesConexion.push(newDes);
        // const json_client = JSON.stringify(dbDesConexion);
        // fs.writeFileSync('src/desconexiones.json', json_client, 'utf-8');
        // });
        });
    });
}

/*
router.get('/gpxconnect', function (req, res){
    
    //let d = UserConnected;
    res.render('connect', {
        //d,
        //dbConexion,
        //dbDesConexion

    });
});*/