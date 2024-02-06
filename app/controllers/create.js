'use strict'

const axios = require('axios');
let contador = 0;

// Lógica para llamar a la API y generar la guía
exports.createGuide = async(req, res, next) =>{
    try{
        console.log('Crearemos la guía')
        let url = process.env.URL_CREATE_LABEL
        let body = await getShipping()
        let resp = await axios.post(url, body, {headers: {"Authorization": `Bearer ${process.env.AUTHORIZATION}`}})
        
        if(resp.data){
            if(resp['data']['meta'] === 'generate'){
                console.log('La guía se creo correctamente, id de envío ', resp['data']['data'][0]['shipmentId'])
                // Incrementa el contador
                contador++;
                // Emite el nuevo valor del contador a todos los clientes conectados
                req.app.io.emit('contador', contador);
            
                res.status(200).json({ success: true, contador });
            }

        }
    }        
    catch(error){
        console.error('Error al generar la guía:', error);
        res.status(500).json({ success: false, error: 'Error al generar la guía' });
    }
}

// Obtenemos el body que se necesita para generar una guía en este caso es un json estático
async function getShipping(){
    let order = {
        "origin": {
            "name": "Juan Hernández",
            "company": "Test Envía",
            "email": "test@hotmail.com",
            "phone": "5512345678",
            "street": "av vasconcelos",
            "number": "1400",
            "district": "mirasierra",
            "city": "Monterrey",
            "state": "NL",
            "country": "MX",
            "postalCode": "66236",
            "reference": ""
        },
        "destination": {
            "name": "oscar",
            "company": "empresa",
            "email": "osgosf8@gmail.com",
            "phone": "8116300800",
            "street": "av vasconcelos",
            "number": "1400",
            "district": "palo blanco",
            "city": "monterrey",
            "state": "NL",
            "country": "MX",
            "postalCode": "66240",
            "reference": ""
        },
        "packages": [
            {
                "content": "bolsas",
                "amount": 1,
                "type": "box",
                "weight": 10,
                "insurance": 0,
                "declaredValue": 0,
                "weightUnit": "KG",
                "lengthUnit": "CM",
                "dimensions": {
                    "length": 11,
                    "width": 15,
                    "height": 20
                }
            }
        ],
        "shipment": {
            "carrier": "quiken",
            "service": "local_express",
            "type": 1
        },
        "settings": {
            "printFormat": "PDF",
            "printSize": "STOCK_4X6",
            "comments": "comentarios de el envío"
        }
    }

    return order;
}

