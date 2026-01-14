/**
 * TemperatureService returns a placeholder temperature so previews work without external weather APIs.
 */
class TemperatureService {
  /**
   * PUBLIC_INTERFACE
   * Get a mock temperature in Celsius.
   *
   * @param {{city?: string, region?: string, country?: string}|null} location Optional location info.
   * @returns {{temperature: number, units: "C"}}
   */
  getTemperature(location) {
    // Deterministic mock based on city name length to vary a little across locations.
    const base = 22;
    const city = location && location.city ? String(location.city) : '';
    const delta = city ? (city.length % 7) - 3 : 0;
    const temperature = base + delta;

    return { temperature, units: 'C' };
  }
}

module.exports = new TemperatureService();
