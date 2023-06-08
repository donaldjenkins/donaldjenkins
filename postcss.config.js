const csso = require('postcss-csso')({
  restructure: true
});
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./hugo_stats.json'],
  defaultExtractor: content => {
    const els = JSON.parse(content).htmlElements;
    return [
      ...(els.tags || []),
      ...(els.classes || []),
      ...(els.ids || []),
    ];
  },
  safelist: ['data-theme'],
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? [csso, purgecss] : [])
  ]
};
