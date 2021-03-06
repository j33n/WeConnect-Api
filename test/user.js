//During the test the env variable is set to test
process.env.NODE_ENV = "test";

let mongoose = require("mongoose");
let User = require("../api/models/User");

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let api = require("../server");
let should = chai.should();

let user = require("./utils/data.json").user;

chai.use(chaiHttp);
//Our parent block
describe("Users", () => {
  beforeEach(done => {
    //Before each test we empty the database
    User.remove({}, err => {
      done();
    });
  });
  /*
  * Test user registration
  */
  describe("User registration", () => {
    it("it should register a user", done => {
      chai
        .request(api)
        .post("/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Your account was created successfuly");
          done();
        });
    });
  });
  /*
  * Test user can authenticate
  */
  describe("User can authenticate", () => {
    it("it should not authenticate invalid data", done => {
      chai
        .request(api)
        .post("/auth/login")
        .send({ email: "fakeuser@test.com", password: "fake" })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("User does not exist, check your email input");
          done();
        });
    });
  });
});
