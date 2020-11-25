const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) =>
  layout({
    content: `
      <div>
        <h1>Your id is: ${req.session.userId}</h1>
        <form method="POST">
          <input name="email" placeholder="email" />
          ${getError(errors, 'email')}
          <input name="password" placeholder="password" />
          ${getError(errors, 'password')}
          <input name="passwordConfirmation" placeholder="password confirmation" />
          ${getError(errors, 'passwordConfirmation')}
          <button>Sign Up</button>
        </form>
      </div>
      `,
  });
