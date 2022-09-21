const controller = {};
const nodemailer = require('nodemailer');

const router = require('../routes/customer');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { name } = require('ejs');


controller.list = (req, res) => {
    
    res.render('index', {
        
    });
}

controller.eventC = (req, res) => {
    res.render('customers',{} );
}
//test
controller.test = (req, res) => {
    res.render('evenTest',{} );
}

const client_data = fs.readFileSync('src/visits.json', 'utf-8');
let dbClient = JSON.parse(client_data);

controller.save = (req, res) => {
    
    const {name} = req.body;
 
    let newCliente ={    
        id: uuidv4(),
        name
    };

    dbClient.push(newCliente);

    const json_client = JSON.stringify(dbClient);
    fs.writeFileSync('src/visits.json', json_client, 'utf-8');

    req.session.my_name = req.body.name;
    res.redirect('/streamingArteCocinayAmor2');
    
    
};


controller.delete = (req, res) => {
    dbClient = dbClient.filter(client => client.id != req.params.id);
    const json_client = JSON.stringify(dbClient);
    fs.writeFileSync('src/visits.json', json_client, 'utf-8');
    res.render('customer_view_db', {dbClient});
}

controller.stream = (req, res) => {
    
    if(req.session.my_name){
        const textUser = req.session.my_name;
        delete req.session.my_name;

        res.render('stream', {
            textUser
        });
    }else{
    res.redirect('/notRecord.html');
    
    }
    
};

controller.mostrarDBViews = (req, res) => {
    res.render('customer_view_db', {dbClient});
    
};



//-----------------------------Colegio Luis Horacio Gomez-----------------------------------

const chatDB = require('../models/chatDB');

controller.homeLuis = (req, res) => {
    res.render('homeConcert',{});
}

controller.saveCol = (req, res) => {
    console.log(req.body);

}

controller.responseCol= (req, res)=> {
    //console.log(req.query);
    res.render('response');
}

controller.confirmationCol = (req, res)=>{
    
    res.redirect('/formato_correo.html');
}

//register email
controller.sendMail = (req, res) => {
    let _key = uuidv4();
    
    res.render('sendMail', {
        _key
    });
}

//saving in database
controller.saveClient = async (req, res) => {
    //console.log(req.body);
    //let data = req.body;

    //buscar referencia en db
    const datas = req.body.id;

    const datos = await chatDB.find({pssIngreso: datas});
    
    if(datos == ''){
        
        //guardar a mongoAtlas
    const data = req.body;
    let newUser = new chatDB({
        nombre: data.name,
        correo: data.email,
        pssIngreso: data.id,
        status: 'off',
        socketIn: '',
        canalPago: data.canal
        });
        await newUser.save();

    contentHtml = `
        
        <img src="cid:banner">
        
        <h1 style="text-align: center;">Noche Artística</h1>
        <p style="margin-top: 30px; font-size: 24px; margin-bottom: 40px;">Bienvenido(a) <strong>${data.name}</strong> a la noche artística del Colegio Waldorf
        Luis Horacio Gomez. Un encuentro que invita a disfrutar de la calidez de la música y la magia de la danza. <br><br>
        <p style="font-style: italic; font-size: 20px;">
        "Cada hombre es un artista, con facultad creativa que deben ser perfeccionadas y reconocidas".<br>
        Rudolf Steiner
        </p>
        
        <div>
            <br>
            <p>--------------------------COPIA EL ID DE INGRESO-------------------------------------</p>
            <h1 id="text">${data.id}</h1>
            <p>-----------------DA CLICK EN EL TICKET VIRTUAL---------------------------------------</p>
        </div>

        <a href="https://gopraxisevent.com/authorization">
            <p style="text-align: center;">clic en el ticket</p>
            <img src="cid:imgfooter">
        </a>
          `;

    const transporter = nodemailer.createTransport({
        host: 'mail.gopraxis.co',
        port: 465,
        auth: {
            user: 'contacto@gopraxis.co',
            pass: '.*.ggleGpx2028'
        }   
    });
    const info = await transporter.sendMail({
        from: "ASOFAMILIA Colegio Waldorf LHG <contacto@gopraxis.co>",
        to: data.email,
        subject: 'Noche Artística',
        html: contentHtml,
        attachments: [
            {
                filename: 'horizontalCol.jpeg',
                path:__dirname+'/horizontalCol.jpeg',
                cid: 'banner'
            },
            {
                filename: 'ticket.jpg',
                path:__dirname+'/ticket.jpg',
                cid: 'imgfooter'
            }
        ]
    });
    console.log('Mensaje enviado', info.messageId);

    res.redirect('/registerdata.html');
    }else{
        res.send('esta referencia ya existe');
    }
}


//authorization
controller.authorization = (req, res) => {
    res.render('passLogin');
}

//direccionamiento a streaming
controller.accessEvent = async(req, res) => {

    const datauser = req.body;
    
    const datos = await chatDB.find({pssIngreso: datauser.pss});
    
    let dat = datos;
    
    if(dat == ''){
        res.redirect('/event_none.html');
    }else{
        
        let i = dat[0].pssIngreso;
        let p = await chatDB.findOne({pssIngreso: datauser.pss});
        if(p.status == 'on'){
            //res.send('Parece que recargaste la pagina, saliste de la sesion u otro usuario con tus credenciales se encuentre en el Streaming');
            res.redirect('/access-denied.html');
        }
        else
        {
            const q = {pssIngreso: datauser.pss};
            await chatDB.findOneAndUpdate(q, { status: 'on'});
    
            res.render('liveFundacion', {
                i
            });
        }
        
        //consulta a db
        // let p = await chatDB.findOne({pssIngreso: datauser.pss});
        // console.log(p.status);
        
        // await chatDB.save();
        
    }    
}

// controller.streamColegio = (req, res) => {
//     res.render('liveFundacion');
// }

controller.mostrarDBAsofamilia = async(req, res) => {

    
    const datos = await chatDB.find({}, "nombre correo canalPago created_at");
    

    res.render('userDBAsofamilia', {
        datos
    });
}

controller.repeatMail = async(req, res) => {

    
    const datos = await chatDB.find({}, "nombre correo pssIngreso");
    

    res.render('repeatSendMail', {
        datos
    });
}



controller.reenvioSend = async(req, res) => {
    const infoD = req.body;

    //envio de correo

    contentHtml = `
        
        <img src="cid:banner">
        
        <h1 style="text-align: center;">Noche Artística</h1>
        <p style="margin-top: 30px; font-size: 24px; margin-bottom: 40px;">Hola <strong>${req.body.colUser}</strong>, llegó el día de encontrarnos para compartir nuestra Noche Artística del Colegio Waldorf
        Luis Horacio Gomez. Un encuentro que invita a disfrutar de la calidez de la música y la magia de la danza. <br><br>
        <p style="font-style: italic; font-size: 20px;">
        "Cada hombre es un artista, con facultad creativa que deben ser perfeccionadas y reconocidas".<br>
        Rudolf Steiner
        </p>
        
        <div>
            <p><strong>Recuerda copiar el siguiente código. Da click en el ticket y pégalo cuanto se te solicite.</strong></p>

            <br>
            <p><strong>Nos vemos esta noche.</strong></p>
            <br>
            <p>--------------------------COPIA EL ID DE INGRESO-------------------------------------</p>
            <h1 id="text">${req.body.clave}</h1>
            <p>-----------------DA CLICK EN EL TICKET VIRTUAL---------------------------------------</p>
        </div>

        <a href="https://gopraxisevent.com/authorization">
            <p style="text-align: center;">clic en el ticket</p>
            <img src="cid:imgfooter">
        </a>
          `;

    const transporter = nodemailer.createTransport({
        host: 'mail.gopraxis.co',
        port: 465,
        auth: {
            user: 'contacto@gopraxis.co',
            pass: '.*.ggleGpx2028'
        }   
    });
    const info = await transporter.sendMail({
        from: "ASOFAMILIA Colegio Waldorf LHG <contacto@gopraxis.co>",
        to: req.body.mail,
        subject: 'Noche Artística',
        html: contentHtml,
        attachments: [
            {
                filename: 'horizontalCol.jpeg',
                path:__dirname+'/horizontalCol.jpeg',
                cid: 'banner'
            },
            {
                filename: 'ticket.jpg',
                path:__dirname+'/ticket.jpg',
                cid: 'imgfooter'
            }
        ]
    });
    console.log('Mensaje enviado', info.messageId);

    res.render('infoRepeatMail', {
        infoD
    });
}

// controller.pruebaStream = (req, res) => {
//     res.render('testLiveColegio');
// }

module.exports = controller;
