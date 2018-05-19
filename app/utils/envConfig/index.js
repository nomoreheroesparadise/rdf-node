const flatten = require('flat');

function init(MicroserviceName, settings) {
  const settingsFlat = flatten(settings, { delimiter: '_' });
  const settingsEntries = Object.keys(settingsFlat);
  const printSettings = process.argv.includes('--print-env');

  settingsEntries.forEach((entry) => {
    const ENV_OPTION = `${MicroserviceName}_${entry.toUpperCase()}`;
    if (process.env[ENV_OPTION] != null) {
      const option = process.env[ENV_OPTION];
      if (!isNaN(option)) {
        settingsFlat[entry] = Number(option);
      } else if (option === 'true' || option === 'false') {
        settingsFlat[entry] = option === 'true';
      } else {
        settingsFlat[entry] = option;
      }
    } else {
      process.env[ENV_OPTION] = settingsFlat[entry];
    }
    if (printSettings) {
      console.log(` $ ${ENV_OPTION} = ${process.env[ENV_OPTION]}`);
    }
  });

  return flatten.unflatten(settingsFlat, { delimiter: '_' });
}

module.exports = init;
