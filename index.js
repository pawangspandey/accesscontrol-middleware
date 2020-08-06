
class AccessControlMiddleware {
  /**
   * @param {object} accessControl access control rules object.
   */

  constructor(accessControl) {
    this._accessControl = accessControl;
  }

  /**
   * check permission
   * @param {object} params parameters.
   * @param {string} params.resource resource name.
   * @param {string} params.action action would be any of create, read, update & delete.
   * @param {boolean} params.checkOwnerShip flag to check ownership on resource.
   * @param {Object[]} params.operands operands which will compare to check ownership.
   * @param {string} params.operands.source source to get operand value (body, params, query, and whichever present in req object).
   * @param {string} params.operands.key key to get operand value.
   * @returns {function} middleware to append in express.js route.
   */

  check ({ resource, action, checkOwnerShip = false, operands = [], customResponse = null}) {

    return (req, res, next) => {

      const actions = {};
      
      switch (action) {
  
        case 'create' : 
        actions.any = 'createAny';
        actions.own = 'createOwn';
        break;
  
        case 'update' : 
        actions.any = 'updateAny';
        actions.own = 'updateOwn';
        break;
  
  
        case 'read' : 
        actions.any = 'readAny';
        actions.own = 'readOwn';
        break;
  
  
        case 'delete' : 
        actions.any = 'deleteAny';
        actions.own = 'deleteOwn';
        break;
  
        default:
        return next(new Error('invalid action'));
      }

      // as most passport strategy assign user object to req.
      const role = req.user.role; 
      let permission = {};

      permission = this._accessControl.can(role);

      if (checkOwnerShip) {

        if (operands.length !== 2) {
          return next(new Error('must be two operands to check ownership'))
        }

        const firstOperand = req[operands[0].source][operands[0].key];

        const secondOperand = req[operands[1].source][operands[1].key];

        if (firstOperand.toString() === secondOperand.toString()) {
          permission = permission[actions.own](resource);
        }
        else {
          permission = permission[actions.any](resource);
        }

      } else {
        permission = permission[actions.any](resource);
      }

      if (permission.granted) {
        return next();
      } 
      else {
        return res.status(403).send(customResponse);
      }
    };
  }

}

module.exports = AccessControlMiddleware;
