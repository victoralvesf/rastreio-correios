module.exports = async (req, res, next) => {
  const regex = /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/gi;
  const tracking_code = req.query.id;

  if(!tracking_code) {
    return res.status(400).json({
      status: false,
      response: "O código de rastreio é obrigatório."
    })
  }
  
  const trackingCodeIsValid = regex.test(tracking_code);

  if (!trackingCodeIsValid) {
    return res.status(400).json({
      success: false,
      response: "O código de rastreio deve possuir 13 caracteres, sendo 4 letras e 9 números, por exemplo: AA123456789XX."
    })
  }

  req.trackingCode = tracking_code;
  return next();
}