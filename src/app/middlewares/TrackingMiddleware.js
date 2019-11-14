module.exports = async (req, res, next) => {
  const tracking_code = req.query.id;

  console.log(tracking_code);

  if(!tracking_code) {
    return res.status(400).json({
      status: false,
      response: "O codigo de rastreio e obrigatorio"
    })
  }

  req.trackingCode = tracking_code;
  return next();
}