const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// Receive a POST request to add an item to a cart.
router.post('/cart/products', async (req, res) => {
  // Figure out the cart.
  let cart;

  if (!req.session.cartId) {
    // We don't have a cart, we need to create one,
    // and store the cart id on the req.sesssion.cartId property.
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart! Let's get it from the repository.
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );

  if (existingItem) {
    // Increment quantity and save cart.
    existingItem.quantity++;
  } else {
    // Add new product id to items array.
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await cartsRepo.update(cart.id, { items: cart.items });

  res.redirect('/cart');
});

// Receive a GET request to show all items in cart.
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }

  const cart = await cartsRepo.getOne(req.session.cartId);
  const promises = [];

  for (const item of cart.items) {
    promises.push(productsRepo.getOne(item.id));
  }

  const products = await Promise.all(promises);
  cart.items.forEach((item, i) => {
    item.product = products[i];
  });

  res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a POST request to delete an item from a cart.
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);

  await cartsRepo.update(req.session.cartId, { items });

  res.redirect('/cart');
});

module.exports = router;
