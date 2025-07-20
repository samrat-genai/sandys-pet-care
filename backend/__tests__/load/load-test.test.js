const LoadTester = require('./order-load-test');

describe('Load Testing', () => {
  // Increase timeout for load tests
  jest.setTimeout(60000);

  describe('Order Creation Load Test', () => {
    test('should handle moderate load (10 concurrent requests)', async () => {
      const loadTester = new LoadTester('http://localhost:5001', 5, 10);
      const stats = await loadTester.run();
      
      expect(stats.completedRequests).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThan(80); // At least 80% success rate
      expect(stats.avgResponseTime).toBeLessThan(5000); // Average response under 5s
    });

    test('should handle light load efficiently', async () => {
      const loadTester = new LoadTester('http://localhost:5001', 2, 5);
      const stats = await loadTester.run();
      
      expect(stats.completedRequests).toBe(5);
      expect(stats.successRate).toBe(100); // Should be 100% for light load
      expect(stats.avgResponseTime).toBeLessThan(1000); // Should be fast for light load
    });

    test('should provide meaningful performance metrics', async () => {
      const loadTester = new LoadTester('http://localhost:5001', 3, 6);
      const stats = await loadTester.run();
      
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('completedRequests');
      expect(stats).toHaveProperty('errors');
      expect(stats).toHaveProperty('successRate');
      expect(stats).toHaveProperty('avgResponseTime');
      expect(stats).toHaveProperty('requestsPerSecond');
      expect(stats).toHaveProperty('p95ResponseTime');
      expect(stats).toHaveProperty('p99ResponseTime');
      
      expect(stats.totalRequests).toBe(6);
      expect(typeof stats.successRate).toBe('number');
      expect(typeof stats.avgResponseTime).toBe('number');
      expect(typeof stats.requestsPerSecond).toBe('number');
    });
  });

  describe('Performance Benchmarks', () => {
    test('should meet response time requirements under normal load', async () => {
      const loadTester = new LoadTester('http://localhost:5001', 3, 9);
      const stats = await loadTester.run();
      
      // Performance requirements
      expect(stats.avgResponseTime).toBeLessThan(2000); // Average under 2s
      expect(stats.p95ResponseTime).toBeLessThan(3000); // 95% under 3s
      expect(stats.maxResponseTime).toBeLessThan(5000); // Max under 5s
    });

    test('should maintain throughput under concurrent load', async () => {
      const loadTester = new LoadTester('http://localhost:5001', 4, 8);
      const stats = await loadTester.run();
      
      // Should process at least 1 request per second on average
      expect(stats.requestsPerSecond).toBeGreaterThan(1);
      
      // Should handle concurrency without excessive errors
      expect(stats.successRate).toBeGreaterThan(75);
    });
  });
});