const axios = require('axios');
const cheerio = require('cheerio');

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

          let hasError = $('div .alert.alert-warning p').text();
          if (hasError) {
            hasError = hasError.split('.');
            return res.status(404).json({
              success: false,
              response: `${hasError[0]}.${hasError[1]}. ${hasError[2]}.`
            })
          }

          const modality = $('.container-fluid h1').text().split('(')[1].split(')')[0].trim();
          const trackingCode = $('.container-fluid h1').text().split('Correios')[1].split('(')[0].trim();
          const timeline = [];

          $('.container-fluid ul li').each(function(i, item) {
            var status = $(this).find('b').text().split('Entrega');

            if(status.length > 1) {
              status = `${status[0]} - Entrega${status[1]}`;
            } else {
              status = status[0];
            }

            const date = $(this).find('span').text().trim();

            let details = $(this).find('div').text().split('De');
            details = details[details.length - 1].split('Para');

            const from = details[0] ? details[0].trim() : details[1].trim();
            const to = details[1] ? details[1].trim() : '';

            timeline[i] = {
              date,
              status,
              details: {
                from,
                to
              }
            }
          });

          return res.json({
            success: true,
            response: {
              modality,
              trackingCode,
              timeline
            }
          });
        }
      }, (error) => {
          return res.status(500).json({
            success: false,
            response: 'Não foi possível atender a solicitação no momento, tente novamente mais tarde.'
          })
        }
      );
    
  }
}

module.exports = new TrackingController();