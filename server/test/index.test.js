import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

describe('Test API v1 Endpoint', () => {
  it('should return error if endpoint does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/not')
      .set({
        'Content-type': 'application/json',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.statusCode).to.equal(404);
        expect(res.body.status).to.equal(404);
        assert.isObject(res.body, 'Response is not an object');
        assert.strictEqual(res.statusCode, 404, 'Status code is not 404');
        assert.strictEqual(res.body.status, 404, 'Status is not be 404');
        assert.strictEqual(res.body.error, 'Not Found');
        assert.isNull(err, 'Expect error to not exist');
        done();
      });
  });

  it('should return success if endpoint exist', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .set({
        'Content-type': 'application/json',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.statusCode).to.equal(200);
        expect(res.body.message).to.equal('Welcome to Automart API');
        expect(res.body.status).to.equal('success');
        assert.isObject(res.body, 'Expect response to be an object');
        assert.strictEqual(res.statusCode, 200, 'Status code should be 200');
        assert.strictEqual(res.body.status, 'success', 'Status code should be success');
        assert.strictEqual(res.body.message, 'Welcome to Automart API', 'Message should be Welcome to Automart API');
        assert.isNull(err, 'Expect error to not exist');
        done();
      });
  });
});