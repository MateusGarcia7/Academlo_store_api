// Models
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

const protectProductOwner = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: 'active' } });

  if (product.userId != sessionUser.id) {
    return next(new AppError('You did not create this product', 401));
  }
  next();
});

const productExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({ where: { id, status: 'active' } });

  if (!product) {
    return next(new AppError('Could not find product by given id', 404));
  }

  req.product = product;
  next();
});

module.exports = { protectProductOwner, productExists };