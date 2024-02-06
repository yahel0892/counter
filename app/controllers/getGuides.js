'use strict'

const axios = require('axios')

exports.getGuides = async(req, res, next) =>{
    try{
        var result = [];
        var date = new Date();
        var month = (date.getMonth()+1).toString().padStart(2, '0');
        var year = date.getFullYear().toString();
        var url = `${process.env.URL_GET_GUIDES}/${month}/${year}`

        let resp = await axios.get(url, {headers: {"Authorization": `Bearer ${process.env.AUTHORIZATION}`}})
        if(resp['data']){
            var formatter = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })

            var dataFilter = resp['data']['data'].filter(element => element['status'] === 'Created')
            
            for(var e of dataFilter){
                if(/^[0-9]+$/.test(e['tracking_number'])){
                    let createdDate = await dateFormater(e['created_at']);
                    let service = e['service'].split('_').join(' ');
                    let name = e['name'].charAt(0).toUpperCase() + e['name'].slice(1);

                    let element = {
                        followUp: `${name} ${service.charAt(0).toUpperCase() + service.slice(1)}, ${e['tracking_number']}`,
                        status: 'Creado',
                        origin: `${e['sender_name']}, ${e['sender_postalcode']}, ${e['sender_city']}, ${e['sender_state']}, ${e['sender_country']}`,
                        destination: `${e['consignee_name']}, ${e['consignee_postalcode']}, ${e['consignee_city']}, ${e['consignee_state']}, ${e['consignee_country']}`,
                        package: 'Bolsas',
                        guide: `${formatter.format(e.total)}`,
                        user: `${e.created_by_name}, ${createdDate}` 
                    }

                    result.push(element)
                }
            }
            res.send(result)
        }
    }
    catch(error){
        console.error('Error al obteber las guías:', error);
        res.status(500).json({ success: false, error: 'Error al obtener las guías' });
    }
}

async function dateFormater(date){
    var day = new Date(date).getDate().toString().padStart(2, '0');
    var month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    var year = new Date(date).getFullYear().toString().slice(-2);
    var hours = new Date(date).getHours().toString().padStart(2, '0');
    var minutes = new Date(date).getMinutes().toString().padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return formattedDate;
}