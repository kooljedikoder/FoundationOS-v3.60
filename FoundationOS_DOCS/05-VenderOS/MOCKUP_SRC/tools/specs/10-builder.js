const L = require('../lib');
const { panel } = L;
const pages = [{
  id: 'builder', tabs: [
    { label: 'New Form', existing: 'builder-new' },
    { label: 'Existing Forms', existing: 'builder-existing' },
    { label: 'Pages', id: 'pages', blocks: [panel('Pages as data', 'layout-template', '<div id="fosPagesBody"><p style="font-size:13px">Loading the page schemas...</p></div>', 'Every page in the product is a JSON schema: header, KPI strip, tabs and blocks. Open one, change it, preview it and save it. Saved pages are stored in the database and appear in the menu. This is the rule for every app: if a page is not in a schema, the builder cannot see it.')] }
  ]
}];
module.exports = { pages, newPages: [] };
