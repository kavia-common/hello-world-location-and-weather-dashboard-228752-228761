const helloService = require('../services/hello');
const locationService = require('../services/location');
const temperatureService = require('../services/temperature');
const requestLogService = require('../services/requestLog');

class ApiController {
  async hello(req, res) {
    const payload = helloService.getHello();

    await requestLogService.logRequest({
      route: '/api/hello',
      timestamp: Date.now(),
      ip: req.ip || null,
      userAgent: req.get('user-agent') || null,
    });

    return res.status(200).json(payload);
  }

  async location(req, res) {
    const location = locationService.getLocationByIp(req.ip);

    await requestLogService.logRequest({
      route: '/api/location',
      timestamp: Date.now(),
      ip: req.ip || null,
      userAgent: req.get('user-agent') || null,
      location: JSON.stringify(location),
    });

    return res.status(200).json(location);
  }

  async temperature(req, res) {
    // Temperature can be computed based on location (mock); we keep it simple and deterministic.
    const location = locationService.getLocationByIp(req.ip);
    const result = temperatureService.getTemperature(location);

    await requestLogService.logRequest({
      route: '/api/temperature',
      timestamp: Date.now(),
      ip: req.ip || null,
      userAgent: req.get('user-agent') || null,
      location: JSON.stringify(location),
      temperature: result.temperature,
      units: result.units,
    });

    return res.status(200).json(result);
  }
}

module.exports = new ApiController();
