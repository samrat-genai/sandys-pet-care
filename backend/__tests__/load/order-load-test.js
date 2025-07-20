const axios = require('axios');
const mongoose = require('mongoose');

class LoadTester {
  constructor(baseURL = 'http://localhost:5001', concurrency = 10, totalRequests = 100) {
    this.baseURL = baseURL;
    this.concurrency = concurrency;
    this.totalRequests = totalRequests;
    this.completedRequests = 0;
    this.errors = 0;
    this.responseTimes = [];
    this.startTime = 0;
  }

  generateTestOrder() {
    return {
      user: new mongoose.Types.ObjectId(),
      orderItems: [{
        name: `Load Test Product ${Math.random().toString(36).substr(2, 9)}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.round((Math.random() * 100 + 10) * 100) / 100,
        product: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        address: `Test Address ${Math.floor(Math.random() * 1000)}`,
        city: 'Kolkata',
        postalCode: '700001',
        country: 'India'
      },
      paymentMethod: 'cash-on-delivery',
      taxPrice: 0,
      shippingPrice: 40,
      totalPrice: 0,
      isPaid: false
    };
  }

  async makeRequest() {
    const order = this.generateTestOrder();
    order.totalPrice = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + order.shippingPrice;
    
    const startTime = Date.now();
    
    try {
      const response = await axios.post(`${this.baseURL}/api/orders`, order, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseTime = Date.now() - startTime;
      this.responseTimes.push(responseTime);
      
      if (response.status === 201) {
        this.completedRequests++;
        return { success: true, responseTime, orderId: response.data._id };
      } else {
        this.errors++;
        return { success: false, responseTime, error: `Status: ${response.status}` };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.errors++;
      return { success: false, responseTime, error: error.message };
    }
  }

  async runConcurrentBatch(batchSize) {
    const promises = [];
    for (let i = 0; i < batchSize; i++) {
      promises.push(this.makeRequest());
    }
    return Promise.all(promises);
  }

  calculateStats() {
    const totalTime = Date.now() - this.startTime;
    const avgResponseTime = this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
    const minResponseTime = Math.min(...this.responseTimes);
    const maxResponseTime = Math.max(...this.responseTimes);
    
    // Calculate percentiles
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    return {
      totalRequests: this.totalRequests,
      completedRequests: this.completedRequests,
      errors: this.errors,
      successRate: (this.completedRequests / this.totalRequests) * 100,
      totalTimeMs: totalTime,
      requestsPerSecond: (this.completedRequests / totalTime) * 1000,
      avgResponseTime: Math.round(avgResponseTime),
      minResponseTime,
      maxResponseTime,
      p50ResponseTime: p50,
      p95ResponseTime: p95,
      p99ResponseTime: p99
    };
  }

  async run() {
    console.log(`Starting load test:`);
    console.log(`- Base URL: ${this.baseURL}`);
    console.log(`- Total requests: ${this.totalRequests}`);
    console.log(`- Concurrency: ${this.concurrency}`);
    console.log(`- Target: Order creation endpoint`);
    console.log('\\n');

    this.startTime = Date.now();
    
    // Calculate number of batches
    const numberOfBatches = Math.ceil(this.totalRequests / this.concurrency);
    
    for (let batch = 0; batch < numberOfBatches; batch++) {
      const batchSize = Math.min(this.concurrency, this.totalRequests - (batch * this.concurrency));
      
      console.log(`Running batch ${batch + 1}/${numberOfBatches} (${batchSize} requests)...`);
      
      const batchResults = await this.runConcurrentBatch(batchSize);
      
      // Log any errors in this batch
      const batchErrors = batchResults.filter(result => !result.success);
      if (batchErrors.length > 0) {
        console.log(`  Batch ${batch + 1} errors: ${batchErrors.length}`);
        batchErrors.slice(0, 3).forEach(error => {
          console.log(`    - ${error.error}`);
        });
      }
      
      // Small delay between batches to avoid overwhelming the server
      if (batch < numberOfBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const stats = this.calculateStats();
    
    console.log('\\n=== LOAD TEST RESULTS ===');
    console.log(`Total requests: ${stats.totalRequests}`);
    console.log(`Completed: ${stats.completedRequests}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Success rate: ${stats.successRate.toFixed(2)}%`);
    console.log(`Total time: ${(stats.totalTimeMs / 1000).toFixed(2)}s`);
    console.log(`Requests/second: ${stats.requestsPerSecond.toFixed(2)}`);
    console.log('\\nResponse times (ms):');
    console.log(`  Average: ${stats.avgResponseTime}`);
    console.log(`  Min: ${stats.minResponseTime}`);
    console.log(`  Max: ${stats.maxResponseTime}`);
    console.log(`  50th percentile: ${stats.p50ResponseTime}`);
    console.log(`  95th percentile: ${stats.p95ResponseTime}`);
    console.log(`  99th percentile: ${stats.p99ResponseTime}`);
    
    return stats;
  }
}

// Export for use in tests
module.exports = LoadTester;

// Run if called directly
if (require.main === module) {
  const loadTester = new LoadTester(
    process.env.TEST_URL || 'http://localhost:5001',
    parseInt(process.env.CONCURRENCY) || 5,
    parseInt(process.env.TOTAL_REQUESTS) || 50
  );
  
  loadTester.run()
    .then(stats => {
      if (stats.successRate < 95) {
        console.log('\\n❌ Load test failed: Success rate below 95%');
        process.exit(1);
      } else if (stats.avgResponseTime > 2000) {
        console.log('\\n⚠️  Load test warning: Average response time above 2s');
        process.exit(1);
      } else {
        console.log('\\n✅ Load test passed!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('Load test failed with error:', error);
      process.exit(1);
    });
}