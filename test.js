const request = require('supertest');
const { expect } = require('chai');
const app = require('./Webbsidan/AdminPage/adminPage'); // Uppdatera sökvägen till filen som skapar din Express-app
module.exports = request

describe('POST /api/tabort', () => {
  it('ska returnera ett svar med status 200 när data finns och tas bort', (done) => {
    const testData = { namn: 'leo' };

    request(app)
      .post('/api/tabort')
      .send(testData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.deep.equal({ status: 'success', data: 'Data to remove successfully.' });
        done();
      });
  });

  it('ska returnera ett svar med status 404 när data inte finns', (done) => {
    const testData = { namn: 'idk' };

    request(app)
      .post('/api/tabort')
      .send(testData)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.deep.equal({ status: 'error', message: 'Data not found.' });
        done();
      });
  });
});
