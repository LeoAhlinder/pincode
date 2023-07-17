const supertest = require('supertest');
const chai = require('chai');
const server = require('./server'); // Adjust the path to your server.js file

const request = supertest.agent(server);
const expect = chai.expect;

describe('POST /api/adminpage', () => {
  it('should respond with "Admin exist" when valid admin credentials are provided', (done) => {
    const admin = {
      namn: 'validAdminName',
      kod: 'validAdminPassword'
    };

    request.post('/api/adminpage')
      .send(admin)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('Admin exist');
      })
      .end(done);
  });

  it('should respond with "Admin does not exist" when invalid admin credentials are provided', (done) => {
    const admin = {
      namn: 'invalidAdminName',
      kod: 'invalidAdminPassword'
    };

    request.post('/api/adminpage')
      .send(admin)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('Admin does not exist');
      })
      .end(done);
  });

  // Add more test cases for other scenarios if needed
});
