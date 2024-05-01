
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid'
]);

module.exports = withTM({
   // distDir: "build",
   future: {
    webpack5: true,
  },
  trailingSlash: true,
});

