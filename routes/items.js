const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

// [{“name”: “popsicle”, “price”: 1.45}, {“name”:”cheerios”, “price”: 3.40}]

router.get('/', (req, res) => {
  return res.json({ items })
})

router.post('/', (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError('Item name is required', 400)
    const newItem = { name: req.body.name, price: req.body.price }
    items.push(newItem)
    return res.status(201).json({ item: newItem })
  } catch (e) {
    return next(e)
  }
})

router.get('/:name', (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name)
    console.log(foundItem)
    if (foundItem === undefined) throw new ExpressError('Item not found', 404)
    return res.json({ item: foundItem })
  } catch (e) {
    return next(e)
  }
})

router.patch('/:name', (req, res, next) => {
  try {
    const foundItem = items.find((item) => item.name === req.params.name)
    if (foundItem === undefined) throw new ExpressError('Item not found', 404)
    foundItem.name = req.body.name
    return res.json({ item: foundItem })
  } catch (e) {
    return next(e)
  }
})

router.delete('/:name', (req, res, next) => {
  try {
    const foundItemIndex = items.findIndex(
      (item) => item.name === req.params.name
    )
    if (foundItemIndex === -1) throw new ExpressError('Item not found', 404)
    items.splice(foundItemIndex, 1)
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return next(e)
  }
})

module.exports = router
