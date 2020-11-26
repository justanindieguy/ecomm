const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) =>
  layout({
    content: `
      <form method="POST">
        <input placeholder="Title" name="title" />
      </form>
    `,
  });
