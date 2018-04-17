
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mockReq =  require('sinon-express-mock').mockReq;
const mockRes =  require('sinon-express-mock').mockRes;

chai.config.includeStack = true;


const AccessControl = require('accesscontrol');
const grantsObject = require('./fixtures/rules.json');
const ac = new AccessControl(grantsObject);

const AccessControlMiddleware = require('../index');

const accessControlMiddleware = new AccessControlMiddleware(ac);


describe('## next error arguments check', () => {
  it('## should throw error if invalid action provide', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ resource : 'video', action: 'invalid-action' })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
    
    expect(typeof next.args[0]).to.be.equal('object');
  })

  it('## should throw error if insufficient operand provides', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'create',
      checkOwnerShip : true,
      operands : [],
    })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
    
    expect(typeof next.args[0]).to.be.equal('object');
  })
});


describe('## Admin permission check ', () => {

  it('## admin can view any video', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ resource : 'video', action: 'read' })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })


  it('## admin can view his own video', () => {
    const request = {
      user : {
        role : 'admin',
        _id : '123456'
      },
      params : {
        userId : '123456'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'read',
      checkOwnerShip : true,
      operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
     })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })


  it('## admin can create any video', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ resource : 'video', action: 'create' })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })

  it('## admin can create his own video', () => {
    const request = {
      user : {
        role : 'admin',
        _id : '123456'
      },
      params : {
        userId : '123456'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'create',
      checkOwnerShip : true,
      operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
     })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })


  it('## admin can update any video', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ resource : 'video', action: 'update' })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })

  it('## admin can update his own video', () => {
    const request = {
      user : {
        role : 'admin',
        _id : '123456'
      },
      params : {
        userId : '123456'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'update',
      checkOwnerShip : true,
      operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
     })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })



  it('## admin can delete any video', () => {
    const request = {
      user : {
        role : 'admin'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ resource : 'video', action: 'delete' })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })

  it('## admin can update his own video', () => {
    const request = {
      user : {
        role : 'admin',
        _id : '123456'
      },
      params : {
        userId : '123456'
      }
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'delete',
      checkOwnerShip : true,
      operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
     })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })

});

describe('## User permission check ', () => {
  
    it('## user cannot view any video', () => {
      const request = {
        user : {
          role : 'user'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ resource : 'video', action: 'read' })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(false);
    })
  
  
    it('## user can view his own video', () => {
      const request = {
        user : {
          role : 'user',
          _id : '123456'
        },
        params : {
          userId : '123456'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ 
        resource : 'video',
        action: 'read',
        checkOwnerShip : true,
        operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
       })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(true);
    })
  
  
    it('## user cannot create any video', () => {
      const request = {
        user : {
          role : 'user'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ resource : 'video', action: 'create' })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(false);
    })
  
    it('## user can create his own video', () => {
      const request = {
        user : {
          role : 'admin',
          _id : '123456'
        },
        params : {
          userId : '123456'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ 
        resource : 'video',
        action: 'create',
        checkOwnerShip : true,
        operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
       })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(true);
    })
  
  
    it('## user cannot update any video', () => {
      const request = {
        user : {
          role : 'user'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ resource : 'video', action: 'update' })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(false);
    })
  
    it('## user can update his own video', () => {
      const request = {
        user : {
          role : 'user',
          _id : '123456'
        },
        params : {
          userId : '123456'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ 
        resource : 'video',
        action: 'update',
        checkOwnerShip : true,
        operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
       })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(true);
    })
  
  
  
    it('## user cannot delete any video', () => {
      const request = {
        user : {
          role : 'user'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ resource : 'video', action: 'delete' })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(false);
    })
  
    it('## user can update his own video', () => {
      const request = {
        user : {
          role : 'user',
          _id : '123456'
        },
        params : {
          userId : '123456'
        }
      };
  
      const req = mockReq(request);
      const res = mockRes();
      const next = sinon.spy();
  
      middleware = accessControlMiddleware.check({ 
        resource : 'video',
        action: 'delete',
        checkOwnerShip : true,
        operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
       })(req, res, next);
  
      expect(next.calledOnce).to.be.equal(true);
    })
  
  });

describe('## comparison of operands', () => {

  it('## should value of operands with different data type.', () => {
    const request = {
      user : {
        role: 'user',
        _id: 123456
      },
      params : {
        userId: '123456'
      } 
    };

    const req = mockReq(request);
    const res = mockRes();
    const next = sinon.spy();

    middleware = accessControlMiddleware.check({ 
      resource : 'video',
      action: 'delete',
      checkOwnerShip : true,
      operands : [{ source : 'user', key : '_id' }, { source : 'params', key : 'userId' }]
     })(req, res, next);

    expect(next.calledOnce).to.be.equal(true);
  })
})
  

