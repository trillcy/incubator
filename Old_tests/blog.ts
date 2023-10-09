import request from 'supertest'

import { RouterPaths } from '../src/app'
import { startApp } from '../src/index'

describe(RouterPaths.blogs, () => {
  const app = startApp()
  // beforeAll(async () => {
  //   await request(app).delete(`${RouterPaths.testing}/all-data`).expect(204)
  // })

  afterAll((done) => {
    done()
  })

  it('create authorisation post -> incorrect name', async () => {
    const testObj = {
      nam: '    ',
      description: 'description-1',
      websiteUrl: `https://www.incubator.com`,
    }
    const basicHeader = 'Basic YWRtaW46cXdlcnR5'
    const expectObject = await request(app)
      .post(RouterPaths.blogs)
      .set('Authorization', basicHeader)
      .send(testObj)
      .expect(400)
  })

  /*
    it('create incorrect post -> incorrect name', async () => {
    const testObj = {
      name: null,
      description: 'description-1',
      websiteUrl: `https://www.incubator.com`,
    }

    const expectObject = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj)
      .expect(404)
  })
  
  it('create correct post -> 1, correct get {id}', async () => {
    const testObj = {
      name: 'name-1',
      description: 'description-1',
      websiteUrl: `http://www.incubator.com`,
    }

    const expectObject = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj)
      .expect(201)

    const createdObject = expectObject.body
    // console.log('25+++', createdObject)
    // console.log('31+++', newDb.body)
    const testObj_2 = {
      name: 'name-2',
      description: 'description-2',
      websiteUrl: `http://www.incubator-222.com`,
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const createdObject_2 = expectObject_2.body
    console.log('42+++blogs', createdObject_2)
    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('44+++', newDb.body)

    const blogId = `${expectObject_2.body.id}`

    const blogObject = await request(app)
      .get(`${RouterPaths.blogs}/${blogId}`)
      .expect(200)
    console.log('51+++', blogObject.body)
  })

  it('create correct post -> 2, incorrect delete {id}', async () => {
    const testObj_1 = {
      name: 'name-1',
      description: 'description-1',
      websiteUrl: `http://www.incubator.com`,
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      name: 'name-2',
      description: 'description-2',
      websiteUrl: `http://www.incubator-222.com`,
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const blogId = `${expectObject_1.body.id}--`
    console.log('112++++', blogId)

    const blogObject = await request(app)
      .delete(`${RouterPaths.blogs}/${blogId}`)
      .expect(404)

    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('119+++', newDb.body)
  })

  it('create correct post -> 2, correct delete {id}', async () => {
    const testObj_1 = {
      name: 'name-1',
      description: 'description-1',
      websiteUrl: `http://www.incubator.com`,
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      name: 'name-2',
      description: 'description-2',
      websiteUrl: `http://www.incubator-222.com`,
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const blogId = `${expectObject_1.body.id}`
    console.log('78++++', blogId)

    const blogObject = await request(app)
      .delete(`${RouterPaths.blogs}/${blogId}`)
      .expect(204)

    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('84+++', newDb.body)
  })

  it('check get -> correct getAll', async () => {
    await request(app).get(RouterPaths.blogs).expect(200)
  })

  it('create correct post -> 2, incorrect put {id}', async () => {
    const testObj_1 = {
      name: 'name-1',
      description: 'description-1',
      websiteUrl: `http://www.incubator.com`,
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      name: 'name-2',
      description: 'description-2',
      websiteUrl: `http://www.incubator-222.com`,
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const blogId = `${expectObject_1.body.id}--`
    console.log('150++++', blogId)

    const testPutObj = {
      name: 'test',
      description: 'test',
      websiteUrl: `test`,
    }

    const blogObject = await request(app)
      .put(`${RouterPaths.blogs}/${blogId}`)
      .send(testPutObj)
      .expect(404)

    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('164+++', newDb.body)
  })
  
  it('create correct post -> 2, correct put {id}', async () => {
    const testObj_1 = {
      name: 'name-1',
      description: 'description-1',
      websiteUrl: `http://www.incubator.com`,
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      name: 'name-2',
      description: 'description-2',
      websiteUrl: `http://www.incubator-222.com`,
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const blogId = `${expectObject_1.body.id}`

    const testPutObj = {
      name: 'test',
      description: 'test',
      websiteUrl: `test`,
    }

    const blogObject = await request(app)
      .put(`${RouterPaths.blogs}/${blogId}`)
      .send(testPutObj)
      .expect(204)

    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
  })
*/
  // ======
})
