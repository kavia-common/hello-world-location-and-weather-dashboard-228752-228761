/**
 * LocationService provides a minimal IP-based lookup.
 *
 * This is intentionally a placeholder implementation so the app works without external geo IP keys.
 */
class LocationService {
  /**
   * PUBLIC_INTERFACE
   * Resolve an approximate location from an IP address.
   *
   * @param {string|null} ip Client IP (may be null/undefined).
   * @returns {{city: string, region: string, country: string}}
   */
  getLocationByIp(ip) {
    // Treat common local/private addresses as "Localhost"
    const normalized = (ip || '').trim();

    const isLocal =
      normalized === '127.0.0.1' ||
      normalized === '::1' ||
      normalized.startsWith('::ffff:127.') ||
      normalized.startsWith('10.') ||
      normalized.startsWith('192.168.') ||
      normalized.startsWith('172.16.') ||
      normalized.startsWith('172.17.') ||
      normalized.startsWith('172.18.') ||
      normalized.startsWith('172.19.') ||
      normalized.startsWith('172.2') || // covers 172.20-172.29
      normalized.startsWith('172.3'); // covers 172.30-172.31

    if (isLocal || !normalized) {
      return {
        city: 'Localhost',
        region: 'Local',
        country: 'Local',
      };
    }

    // Very small deterministic mapping just to show behavior for different IPs in demos.
    // This is not a real geoip implementation.
    const lastChar = normalized[normalized.length - 1];
    const bucket = lastChar ? lastChar.charCodeAt(0) % 3 : 0;

    if (bucket === 0) {
      return { city: 'New York', region: 'NY', country: 'US' };
    }
    if (bucket === 1) {
      return { city: 'London', region: 'England', country: 'GB' };
    }
    return { city: 'Tokyo', region: 'Tokyo', country: 'JP' };
  }
}

module.exports = new LocationService();
