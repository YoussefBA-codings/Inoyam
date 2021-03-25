const program = require('commander');

program
  .option('-s, , --scan --id_site_source < integer > ', 'Lancer le scan d\'un bot', parseInt)
  .option('-m, --maj --id_site_source <integer>', 'Lancer la maj d\'un bot', parseInt)
  .parse(process.argv);

const options = program.opts();

if (options.scan) require('./services/processService/scan.service')(options.scan)
else require('./services/processService/maj.service')(options.maj)

