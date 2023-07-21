// Import necessary modules
const app = require('./server'); // Replace this with the path to your Express app
const request = require('supertest');
const { expect } = require('chai');

// Describe the test suite
describe('Admin Page API', () => {
  // Test the "/api/adminpage" POST endpoint
  describe('POST /api/adminpage', () => {
    it('should return "Admin exist" if the admin exists in the database', (done) => {
      // Mock request body with an existing admin
      const requestBody = { namn: 'leo', kod: '1111' };

      // Send the request to the app
      request(app)
        .post('/api/adminpage')
        .send(requestBody)
        .expect(200) // Expect HTTP status code 200
        .end((err, res) => {
          if (err) return done(err);

          // Make assertions on the response
          expect(res.body.message).to.equal('Admin exist');

          done(); // Callback to indicate the test is complete
        });
    });

    it('should return "Admin does not exist" if the admin does not exist in the database', (done) => {
      // Mock request body with a non-existing admin
      const requestBody = { namn: 'NonExistingAdminName', kod: 'AdminCode' };

      // Send the request to the app
      request(app)
        .post('/api/adminpage')
        .send(requestBody)
        .expect(200) // Expect HTTP status code 200
        .end((err, res) => {
          if (err) return done(err);

          // Make assertions on the response
          expect(res.body.message).to.equal('Admin does not exist');

          done(); // Callback to indicate the test is complete
        });
    });

    // Add more test cases if needed for other scenarios (e.g., error cases)
  });
});
