require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('posts and gets todos', async() => {

      const expectation = [
        
    
          {
              "id": 4,
              "todo": "wash the dishes",
              "completed": false,
              "owner_id": 2
          },
          {
              "id": 5,
              "todo": "clean bathroom",
              "completed": false,
              "owner_id": 2
          },
          {
              "id": 6,
              "todo": "take out trash",
              "completed": false,
              "owner_id": 2
          }
      
      ];
      await fakeRequest(app)
      .post('/api/todo')
      .send(expectation[0])
      .set('Authorization', token)
      .expect(200);

    await fakeRequest(app)
      .post('/api/todo')
      .send(expectation[1])
      .set('Authorization', token)
      .expect(200);

    await fakeRequest(app)
      .post('/api/todo')
      .send(expectation[2])
      .set('Authorization', token)
      .expect(200);

    const data = await fakeRequest(app)
      .get('/api/todo')
      .set('Authorization', token)
      .expect(200);
      
    expect(data.body).toEqual(expectation);
  });


    test('updates todo boolean to true', async() => {

      const expectation =
      [{

          todo: 'wash the dishes',
          completed: true,
          id: 4,
          owner_id: 2
      }];

      const data = await fakeRequest(app)
       .put('/api/todo/4')
       .set('Authorization', token)
       .send(expectation[1])
       .expect(200);
      
       expect(data.body).toEqual(expectation);
    })

  });
});
