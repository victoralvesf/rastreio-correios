const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class TrackingController {
  async index(req, res) {
    const trackingCode = req.trackingCode;
    
    await axios.get(`https://rastreamentocorreios.info/consulta/${trackingCode}`)
      .then((response) => {
        if(response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html, {
            xml: {
              normalizeWhitespace: true,
            }
          });

          const header = [];

          const object = $('.container-fluid h1').text().split('Correios')[1];

          $('.container-fluid ul li').each(function(i, item) {
            header[i] = {
              date: $(this).find('span').text().trim(),
              status: $(this).find('b').text().trim(),
              details: {
                from: $(this).find('div').text().split('Para')[0],
                to: $(this).find('div').text().split('Para')[1] ? 'Para' + $(this).find('div').text().split('Para')[1] : '',
              }
            }
          });

          return res.json({
            status: true,
            object,
            header
          });
        }
      }, (error) => {
          console.log(err)
        }
      );
    
  }
}

module.exports = new TrackingController();