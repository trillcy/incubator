import request from 'supertest'

import { RouterPaths, startApp } from '../src/app'

describe(RouterPaths.videos, () => {
  const app = startApp()
  beforeAll(async () => {
    await request(app).delete(`${RouterPaths.testing}/all-data`).expect(204)
  })

  afterAll((done) => {
    done()
  })
  /*
  it('check get -> IS_ARRAY for all videos', async () => {
    await request(app).get(RouterPaths.videos).expect(200, [])
  })

  it('create correct post -> 1', async () => {
    const testObj = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(201)

    const createdObject = expectObject.body
    // console.log('25+++', createdObject)
    const newDb = await request(app).get(RouterPaths.videos).expect(200)
    // console.log('31+++', newDb.body)
  })

  it('add correct post -> 2', async () => {
    const testObj = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(201)

    const createdObject = expectObject.body
    // console.log('25+++', createdObject)
    const newDb = await request(app).get(RouterPaths.videos).expect(200)
    // console.log('31+++', newDb.body)
  })
  
  it('add incorrect post -> title, author === wrong, availableResolutions: null', async () => {
    const testObj = {
      title: null,
      author: 'string-2',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(400)
  })
  
  it('add incorrect post -> author === null', async () => {
    const testObj = {
      title: 'string-2',
      author: null,
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(400)
  })
  
  it('add incorrect post -> author.length > 20', async () => {
    const testObj = {
      title: 'string-2',
      author: 'hfsfhasfghs/iafhrasghs/h sfhs;fhshf lsefhs;ifhshfs;f',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(400)
  })
  it('add incorrect post -> availableResolutions !== array', async () => {
    const testObj = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: { id: ['P1344', 'P1440', 'Phg'] },
    }

    const expectObject = await request(app)
      .post(RouterPaths.videos)
      .send(testObj)
      .expect(400)
  })

  it('check get/:id -> correct reciving element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    console.log('133+++', videoId)
    const newDb = await request(app).get(RouterPaths.videos).expect(200)
    // console.log('31+++', newDb.body)
    const videoObject = await request(app)
      .get(`${RouterPaths.videos}/${videoId}`)
      .expect(200)
    console.log('139+++', videoObject.body)
  })

  it(`check get/:id -> can't find element`, async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_3)
      .expect(201)

    const videoId = +expectObject_2.body.id + 22
    const videoObject = await request(app)
      .get(`${RouterPaths.videos}/${videoId}`)
      .expect(404)
  })
*/
  it('check put/:id -> correct updating element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P144', 'P1440', 'P2160'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P240'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    console.log('218+++', videoId)
    const testPutObj = {
      title: 'string-put',
      author: 'string-put',
      availableResolutions: ['P480', 'P144', 'P1440'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: '2023-09-17T12:59:54.440Z',
    }
    await request(app)
      .put(`${RouterPaths.videos}/${videoId}`)
      .send(testPutObj)
      .expect(204)
    const videoDb = await request(app).get(RouterPaths.videos).expect(200)
    console.log('139+++', videoDb.body)
  })
  it('check put/:id -> incorrect updating element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P144', 'P1440', 'P2160'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P240'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    console.log('218+++', videoId)
    const testPutObj = {
      title: null,
      author: 'string-put',
      availableResolutions: ['P480', 'P144', 'P1440'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: '2023-09-17T12:59:54.440Z',
    }
    await request(app)
      .put(`${RouterPaths.videos}/${videoId}`)
      .send(testPutObj)
      .expect(400)
    const videoDb = await request(app).get(RouterPaths.videos).expect(200)
    console.log('139+++', videoDb.body)
  })
  /*
  it('check delete/:id -> correct deleting element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.videos)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    const newDb = await request(app)
      .delete(`${RouterPaths.videos}/${videoId}`)
      .expect(204)
    // console.log('31+++', newDb.body)
    const videoDb = await request(app).get(`${RouterPaths.videos}`).expect(200)
  })
  */
})
