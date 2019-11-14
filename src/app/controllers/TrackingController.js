const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class TrackingController {
  async index(req, res) {
    const trackingCode = req.trackingCode;

    await axios.get(`https://linkcorreios.com.br/?id=${trackingCode}`)
      .then((response) => {
        if(response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html, {
            xml: {
              normalizeWhitespace: true,
            }
          });

          const header = [];

          $('table tbody tr').each(function(i, item) {
            header[i] = {
              date: $(this).text().trim(),
            }
          });

          return res.json(header);
        }
      }, (error) => {
          console.log(err)
        }
      );
    
  }
}

module.exports = new TrackingController();