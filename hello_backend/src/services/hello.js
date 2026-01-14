/**
 * HelloService provides a static hello-world response.
 */
class HelloService {
  /**
   * PUBLIC_INTERFACE
   * Get hello payload.
   * @returns {{message: string}}
   */
  getHello() {
    return { message: 'Hello World' };
  }
}

module.exports = new HelloService();
