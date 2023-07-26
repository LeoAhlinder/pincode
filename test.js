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


describe('New User API', () => {
  // Test the "/api/ny-anvandare" POST endpoint
  describe('POST /api/ny-anvandare', () => {
    it('should create a new user and return the correct response', (done) => {
      // Mock request body with the required fields
      const requestBody = { Namn: 'cat', Kod: '4444', lon: 50000 };

      // Send the request to the app
      request(app)
        .post('/api/ny-anvandare')
        .send(requestBody)
        .expect(200) // Expect HTTP status code 200
        .end((err, res) => {
          if (err) return done(err);

          // Make assertions on the response
          expect(res.body.message).to.equal('true');
          expect(res.body.lon).to.equal(requestBody.lon);

          done(); // Callback to indicate the test is complete
        });
    });

    it('should return an error if required fields are missing', (done) => {
      // Mock request body with missing required fields
      const requestBody = { Namn: 'John Doe' }; // Missing "Kod" and "lon"

      // Send the request to the app
      request(app)
        .post('/api/ny-anvandare')
        .send(requestBody)
        .expect(500) // Expect HTTP status code 500 for internal server error
        .end((err, res) => {
          if (err) return done(err);
          done(); // Callback to indicate the test is complete
        });
    });
    // Add more test cases if needed for other scenarios
  });
});

describe("new Admin",() =>{
  describe("POST /api/newadmin",() =>{
    it("should create admin with corresponing data", (done) =>{
    //Data i want to send in for testing
    const data = {namn: "Leo",kod:"8"};

    request(app)
      .post("/api/newadmin")
      .send(data)
      .expect(200)
      .end((err,res)=>{
        if (err) return done(err);

        expect(res.body.message).to.equal("Admin created");
        done();
      });
    });
    it("should return error if not all fields present",(done) =>{
      const data = {namn: "Leo"}

    request(app)
      .post("/api/newadmin")
      .send(data)
      .expect(500)
      .end((err,res)=>{
        if (err) return done(err);
        done();
      });
    });
  });
});