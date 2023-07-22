process.env.NODE_ENV = 'test'
const request = require('supertest')

const app = require('../app')
let items = require('../fakeDb')
const { afterEach } = require('node:test')

let milk = { name: 'milk', price: 4.99 }

beforeEach(() => {
  items.push(milk)
})

afterEach(() => {
  items.length = 0
})

describe('GET /items', () => {
  it('gets all items', async () => {
    const res = await request(app).get('/items')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [milk] })
  })
})

describe('POST /items', () => {
  it('creates an item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'bread', price: 3.99 })
    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({ item: { name: 'bread', price: 3.99 } })
  })
  it('responds with 400 if name is missing', async () => {
    const res = await request(app).post('/items').send({})
    expect(res.statusCode).toBe(400)
  })
})

describe('GET /items/:name', () => {
  it('gets the item by name', async () => {
    const res = await request(app).get(`/items/${milk.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: { name: 'milk', price: 4.99 } })
  })
  it('responds with 404 if name is not valid', async () => {
    const res = await request(app).get('/items/squidjuice')
    expect(res.statusCode).toBe(404)
  })
})

describe('/PATCH /items/:name', () => {
  test("Updating an item's name", async () => {
    const res = await request(app)
      .patch(`/items/${milk.name}`)
      .send({ name: 'oat-milk' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: { name: 'oat-milk', price: 4.99 } })
  })
  test('Responds with 404 for invalid name', async () => {
    const res = await request(app)
      .patch(`/items/cream`)
      .send({ name: 'oat-milk', price: 4.99 })
    expect(res.statusCode).toBe(404)
  })
})

describe('/DELETE /items/:name', () => {
  test('Deleting a item', async () => {
    const res = await request(app).delete(`/items/${milk.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test('Responds with 404 for deleting invalid item', async () => {
    const res = await request(app).delete(`/items/calamari`)
    expect(res.statusCode).toBe(404)
  })
})
