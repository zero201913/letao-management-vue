// 测试生成的订单数据是否可以正常导入系统

// 模拟导入订单数据
function testImportOrders(orders) {
  console.log('开始测试订单数据导入...');

  // 检查订单数据是否存在
  if (!orders || orders.length === 0) {
    console.error('订单数据为空');
    return false;
  }

  console.log(`共测试 ${orders.length} 条订单数据`);

  // 检查订单数据结构
  const requiredFields = [
    'order_id', 'order_no', 'user_id', 'merchant_id',
    'order_amount', 'payment_amount', 'order_status',
    'payment_method', 'paid_time', 'shipping_no',
    'is_deleted', 'created_at', 'updated_at'
  ];

  let validCount = 0;
  let invalidCount = 0;

  orders.forEach((order, index) => {
    const orderIndex = index + 1;
    let isValid = true;
    let errorMessages = [];

    // 检查必填字段
    requiredFields.forEach(field => {
      if (order[field] === undefined) {
        isValid = false;
        errorMessages.push(`缺少必填字段: ${field}`);
      }
    });

    // 检查订单编号唯一性
    if (isValid) {
      const duplicateOrder = orders.find(o => o.order_no === order.order_no && o.order_id !== order.order_id);
      if (duplicateOrder) {
        isValid = false;
        errorMessages.push(`订单编号重复: ${order.order_no}`);
      }
    }

    // 检查订单状态是否在有效范围内
    if (isValid && (order.order_status < 1 || order.order_status > 7)) {
      isValid = false;
      errorMessages.push(`订单状态无效: ${order.order_status}`);
    }

    // 检查支付方式是否在有效范围内
    if (isValid && order.payment_method && (order.payment_method < 1 || order.payment_method > 5)) {
      isValid = false;
      errorMessages.push(`支付方式无效: ${order.payment_method}`);
    }

    // 检查金额是否合理
    if (isValid) {
      if (order.order_amount < 0) {
        isValid = false;
        errorMessages.push(`订单金额无效: ${order.order_amount}`);
      }
      if (order.payment_amount < 0) {
        isValid = false;
        errorMessages.push(`支付金额无效: ${order.payment_amount}`);
      }
      if (order.payment_amount > order.order_amount) {
        isValid = false;
        errorMessages.push(`支付金额大于订单金额`);
      }
    }

    // 检查时间字段
    if (isValid) {
      const createdAt = new Date(order.created_at);
      const updatedAt = new Date(order.updated_at);

      if (isNaN(createdAt.getTime())) {
        isValid = false;
        errorMessages.push(`创建时间无效: ${order.created_at}`);
      }
      if (isNaN(updatedAt.getTime())) {
        isValid = false;
        errorMessages.push(`更新时间无效: ${order.updated_at}`);
      }
      if (updatedAt < createdAt) {
        isValid = false;
        errorMessages.push(`更新时间早于创建时间`);
      }

      if (order.paid_time) {
        const paidTime = new Date(order.paid_time);
        if (isNaN(paidTime.getTime())) {
          isValid = false;
          errorMessages.push(`支付时间无效: ${order.paid_time}`);
        }
        if (paidTime < createdAt) {
          isValid = false;
          errorMessages.push(`支付时间早于创建时间`);
        }
      }
    }

    // 检查是否删除字段
    if (isValid && (order.is_deleted !== 0 && order.is_deleted !== 1)) {
      isValid = false;
      errorMessages.push(`是否删除字段无效: ${order.is_deleted}`);
    }

    // 记录结果
    if (isValid) {
      validCount++;
    } else {
      invalidCount++;
      console.error(`订单 ${orderIndex} (${order.order_no}) 无效:`, errorMessages);
    }
  });

  // 输出测试结果
  console.log('\n测试结果:');
  console.log(`有效订单: ${validCount} 条`);
  console.log(`无效订单: ${invalidCount} 条`);
  console.log(`成功率: ${((validCount / orders.length) * 100).toFixed(2)}%`);

  if (invalidCount === 0) {
    console.log('✅ 所有订单数据都有效，可以正常导入系统');
    return true;
  } else {
    console.error('❌ 部分订单数据无效，需要修正后才能导入系统');
    return false;
  }
}

// 模拟生成测试数据
function generateTestOrders(count = 10) {
  console.log(`生成 ${count} 条测试订单数据...`);

  const orders = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const orderDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const orderStatus = Math.floor(Math.random() * 7) + 1;
    const paymentMethod = Math.floor(Math.random() * 5) + 1;

    // 生成订单编号
    const orderNo = `ORD${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}${String(i).padStart(4, '0')}`;

    // 生成订单金额
    const orderAmount = parseFloat((Math.random() * 1000 + 1).toFixed(2));
    const paymentAmount = parseFloat((orderAmount * (Math.random() * 0.1 + 0.9)).toFixed(2));

    // 生成时间字段
    const createdAt = orderDate;
    const updatedAt = new Date(createdAt);
    updatedAt.setMinutes(updatedAt.getMinutes() + Math.floor(Math.random() * 30));

    let paidTime = null;
    if ([2, 3, 4, 6, 7].includes(orderStatus)) {
      paidTime = new Date(createdAt);
      paidTime.setMinutes(paidTime.getMinutes() + Math.floor(Math.random() * 15));
    }

    const order = {
      order_id: i,
      order_no: orderNo,
      user_id: Math.floor(Math.random() * 1000) + 1,
      merchant_id: Math.floor(Math.random() * 20) + 1,
      order_amount: orderAmount,
      payment_amount: paymentAmount,
      order_status: orderStatus,
      payment_method: paymentMethod,
      paid_time: paidTime ? paidTime.toISOString() : null,
      shipping_no: [3, 4].includes(orderStatus) ? `SF${Math.floor(Math.random() * 10000000000)}` : null,
      is_deleted: 0,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString()
    };

    orders.push(order);
  }

  return orders;
}

// 运行测试
function runTests() {
  console.log('====================================');
  console.log('订单数据导入测试');
  console.log('====================================');

  // 生成测试数据
  const testOrders = generateTestOrders(20);

  // 测试导入
  const importResult = testImportOrders(testOrders);

  console.log('====================================');
  console.log('测试完成');
  console.log('====================================');

  return importResult;
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testImportOrders,
    generateTestOrders,
    runTests
  };
} else if (typeof window !== 'undefined') {
  // 在浏览器环境中运行
  window.testOrders = {
    testImportOrders,
    generateTestOrders,
    runTests
  };
}

// 直接运行测试
runTests();
