import request from 'supertest'

import { RouterPaths, app } from '../src/app'

describe(RouterPaths.posts, () => {
  beforeAll(async () => {
    await request(app).delete(`${RouterPaths.testing}/all-data`).expect(204)
  })

  afterAll((done) => {
    done()
  })

  it('create user; create correctpost1,2 -> 1, correct get all', async () => {
    // создаем корректный BLOG - 2 шт
    const testObj = {
      login: 'aer',
      email: 'andreiincubator@gmail.com',
      password: '12345678',
    }
    console.log('21+++test.posts') //, accessToken)

    const expectObject = await request(app)
      .post(RouterPaths.users)
      .send(testObj)
      .expect(201)
    // auth/login
    console.log('28+++test.posts') //, accessToken)

    const loginObject = { loginOrEmail: 'aer', password: '12345678' }
    const expectObject_2 = await request(app)
      .post(`${RouterPaths.auth}/login`)
      .set('User-Agent', '127:0:0:1')
      .send(loginObject)
      .expect(200)

    // const accessToken = expectObject_2.body.accessToken
    // const refreshToken = expectObject_2
    console.log('44+++posts') //, refreshToken)
  })

  /*
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
  /*
  it('add incorrect post -> title, author === wrong, availableResolutions: null', async () => {
    const testObj = {
      title: null,
      author: 'string-2',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject = await request(app)
      .post(RouterPaths.blogs)
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
      .post(RouterPaths.blogs)
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
      .post(RouterPaths.blogs)
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
      .post(RouterPaths.blogs)
      .send(testObj)
      .expect(400)
  })


    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    console.log('133+++', videoId)
    const newDb = await request(app).get(RouterPaths.blogs).expect(200)
    // console.log('31+++', newDb.body)
    const videoObject = await request(app)
      .get(`${RouterPaths.blogs}/${videoId}`)
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
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_3)
      .expect(201)

    const videoId = +expectObject_2.body.id + 22
    const videoObject = await request(app)
      .get(`${RouterPaths.blogs}/${videoId}`)
      .expect(404)
  })

  it('check put/:id -> correct updating element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P144', 'P1440', 'P2160'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P240'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.blogs)
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
      .put(`${RouterPaths.blogs}/${videoId}`)
      .send(testPutObj)
      .expect(204)
    const videoDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('139+++', videoDb.body)
  })
  it('check put/:id -> incorrect updating element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P144', 'P1440'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P144', 'P1440', 'P2160'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P240'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.blogs)
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
      .put(`${RouterPaths.blogs}/${videoId}`)
      .send(testPutObj)
      .expect(400)
    const videoDb = await request(app).get(RouterPaths.blogs).expect(200)
    console.log('139+++', videoDb.body)
  })
  
  it('check delete/:id -> correct deleting element', async () => {
    const testObj_1 = {
      title: 'string-1',
      author: 'string-1',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_1 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_1)
      .expect(201)

    const testObj_2 = {
      title: 'string-2',
      author: 'string-2',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_2 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_2)
      .expect(201)

    const testObj_3 = {
      title: 'string-3',
      author: 'string-3',
      availableResolutions: ['P1344', 'P1440', 'Phg'],
    }

    const expectObject_3 = await request(app)
      .post(RouterPaths.blogs)
      .send(testObj_3)
      .expect(201)

    const videoId = expectObject_2.body.id
    const newDb = await request(app)
      .delete(`${RouterPaths.blogs}/${videoId}`)
      .expect(204)
    // console.log('31+++', newDb.body)
    const videoDb = await request(app).get(`${RouterPaths.blogs}`).expect(200)
  })
  */
})
