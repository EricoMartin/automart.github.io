export default (req, res, next) => {
  const {
    manufacturer, model, state, status, year, body_type, price,
  } = req.body;


  if (!manufacturer) {
    return res.status(400).json({
      status: 400,
      error: 'Manufacturer cannot be empty',
    });
  }

  if (!model) {
    return res.status(400).json({
      status: 400,
      error: 'Model cannot be empty',
    });
  }

  if (!body_type) {
    return res.status(400).json({
      status: 400,
      error: 'Body type cannot be empty',
    });
  }

  if (!state) {
    return res.status(400).json({
      status: 400,
      error: 'Vehicle state cannot be empty',
    });
  }
  if (!status) {
    return res.status(400).json({
      status: 400,
      error: 'Vehicle status cannot be empty',
    });
  }

  if (!year) {
    return res.status(400).json({
      status: 400,
      error: 'Enter a valid year',
    });
  }

  if (parseInt(year, 10).toString().length < 4 || parseInt(year, 10).toString().length > 4) {
    return res.status(400).json({
      status: 400,
      error: 'Input a valid year',
    });
  }

  if (manufacturer.split('').some(x => Number.isInteger(parseInt(x, 10)))) {
    return res.status(400).json({
      status: 400,
      error: 'Manufacturer field cannot contain number(s)',
    });
  }

  if (state.split('').some(x => Number.isInteger(parseInt(x, 10)))) {
    return res.status(400).json({
      status: 400,
      error: 'Car state field cannot contain number(s)',
    });
  }

  if (Number.isNaN(parseInt(price, 10))) {
    return res.status(400).json({
      status: 400,
      error: 'Enter a valid price',
    });
  }

  return next();
};
