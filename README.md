# accesscontrol-middleware
> config your express routes to have role and attribute based access control.

This middleware helps to config express routes to check permission granted with [accesscontol](https://github.com/onury/accesscontrol).

## Installing / Getting started

Install via npm

```shell
npm install accesscontrol-middleware --save
```

Now define roles and grants via [accesscontol](https://github.com/onury/accesscontrol).

```js
const ac = new AccessControl();
ac.grant('user')                    // define new or modify existing role. also takes an array.
    .createOwn('profile')             // equivalent to .createOwn('profile', ['*'])
    .deleteOwn('profile')
    .readAny('profile')
  .grant('admin')                   // switch to another role without breaking the chain
    .extend('user')                 // inherit role capabilities. also takes an array
    .updateAny('profile')
    .deleteAny('profile');
```
Initialize AccessControlMiddleware

```js
const AccessControlMiddleware = require('accesscontrol-middleware');

const accessControlMiddleware = new AccessControlMiddleware(ac);
```
config any express route

```js

route.put('/profile/:userId',
  accessControlMiddleware.check({ 
    resource : 'profile',
    action : 'update',
    checkOwnerShip : true, // optional if false or not provided will check any permission of action
    operands : [
      { source : 'user', key : '_id' },  // means req.user._id (use to check ownership)
      { source : 'params', key : 'userId' } // means req.params.userId (use to check ownership)
    ]
  }),
  controller.updateProfile);
```

## Tests

```shell
npm test
```
