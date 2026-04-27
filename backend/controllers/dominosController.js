// In-memory storage for simulated orders
const simulatedOrders = new Map();

/**
 * Safely import and call dominos library functions.
 * Domino's API frequently blocks non-browser requests returning HTML
 * instead of JSON. This wrapper catches that and returns null.
 */
const safeDominosCall = async (fn) => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    const msg = error.message || '';
    if (msg.includes('Unexpected token') || msg.includes('not valid JSON') || msg.includes('ECONNREFUSED')) {
      console.warn('⚠️ Dominos API blocked/unavailable, using fallback data');
      return null;
    }
    throw error;
  }
};

// ─── Fallback Data ─────────────────────────────────────────

const FALLBACK_STORES = [
  {
    StoreID: 'FALLBACK-001',
    AddressDescription: 'PizzaVibe Virtual Store - Main Branch',
    Phone: '1800-123-4567',
    IsOnlineCapable: true,
    IsDeliveryStore: true,
    IsOpen: true,
    ServiceIsOpen: { Delivery: true, Carryout: true },
    MinDeliveryOrderAmount: 99,
    EstimatedWaitMinutes: { Delivery: { Min: 20, Max: 35 } },
    isFallback: true
  },
  {
    StoreID: 'FALLBACK-002',
    AddressDescription: 'PizzaVibe Virtual Store - Express Hub',
    Phone: '1800-123-4568',
    IsOnlineCapable: true,
    IsDeliveryStore: true,
    IsOpen: true,
    ServiceIsOpen: { Delivery: true, Carryout: true },
    MinDeliveryOrderAmount: 149,
    EstimatedWaitMinutes: { Delivery: { Min: 15, Max: 25 } },
    isFallback: true
  }
];

const FALLBACK_MENU = {
  categories: [
    { code: 'Pizza', name: 'Pizzas', description: 'Hand-tossed & fresh' },
    { code: 'Sides', name: 'Sides', description: 'Garlic bread, wings & more' },
    { code: 'Drinks', name: 'Beverages', description: 'Cold drinks & juices' }
  ],
  products: [
    { code: 'P_MARG', name: 'Margherita', price: 199, category: 'Pizza', size: 'Medium', description: 'Classic cheese pizza with tomato sauce' },
    { code: 'P_PEPT', name: 'Pepperoni Feast', price: 349, category: 'Pizza', size: 'Medium', description: 'Loaded with pepperoni' },
    { code: 'P_CHKN', name: 'Chicken Supreme', price: 399, category: 'Pizza', size: 'Medium', description: 'Grilled chicken with veggies' },
    { code: 'P_VEG', name: 'Veggie Paradise', price: 249, category: 'Pizza', size: 'Medium', description: 'Fresh garden vegetables' },
    { code: 'S_GB', name: 'Garlic Bread', price: 99, category: 'Sides', size: 'Regular', description: 'Crispy garlic breadsticks' },
    { code: 'D_COLA', name: 'Cola', price: 60, category: 'Drinks', size: '500ml', description: 'Chilled cola' }
  ],
  isFallback: true
};

// ─── Endpoints ─────────────────────────────────────────────

/**
 * Find nearby stores for an address
 */
export const findNearbyStores = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ success: false, message: 'Address is required' });
    }

    let validStores = null;

    // Attempt real API call
    const result = await safeDominosCall(async () => {
      const { NearbyStores } = await import('dominos');
      const nearbyStores = await new NearbyStores(address);
      return nearbyStores.stores.filter(store =>
        store.IsOnlineCapable &&
        store.IsDeliveryStore &&
        store.IsOpen &&
        store.ServiceIsOpen?.Delivery
      );
    });

    if (result && result.length > 0) {
      validStores = result;
    } else {
      // Use fallback stores with user's address attached
      validStores = FALLBACK_STORES.map(s => ({
        ...s,
        AddressDescription: `PizzaVibe Store near ${address}`
      }));
    }

    return res.status(200).json({
      success: true,
      stores: validStores,
      isFallback: !result || result.length === 0
    });
  } catch (error) {
    console.error('NearbyStores Error:', error.message);
    // Return fallback instead of error
    return res.status(200).json({
      success: true,
      stores: FALLBACK_STORES,
      isFallback: true,
      note: 'Live store data unavailable. Showing PizzaVibe stores.'
    });
  }
};

/**
 * Get a specific store's menu
 */
export const getStoreMenu = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Fallback stores bypass the real API
    if (storeId?.startsWith('FALLBACK')) {
      return res.status(200).json({ success: true, menu: FALLBACK_MENU, isFallback: true });
    }

    const result = await safeDominosCall(async () => {
      const { Menu } = await import('dominos');
      const menu = await new Menu(storeId);
      return menu.menu;
    });

    if (result) {
      return res.status(200).json({ success: true, menu: result });
    }

    return res.status(200).json({ success: true, menu: FALLBACK_MENU, isFallback: true });
  } catch (error) {
    console.error('Menu Fetch Error:', error.message);
    return res.status(200).json({ success: true, menu: FALLBACK_MENU, isFallback: true });
  }
};

/**
 * Price and Validate an Order
 */
export const validateAndPrice = async (req, res) => {
  try {
    const { customerInfo, storeID, items } = req.body;

    if (!customerInfo || !storeID || !items?.length) {
      return res.status(400).json({ success: false, message: 'Customer info, store, and items are required' });
    }

    // Fallback pricing
    if (storeID?.startsWith('FALLBACK')) {
      const total = items.reduce((sum, item) => {
        const menuItem = FALLBACK_MENU.products.find(p => p.code === item.code);
        return sum + ((menuItem?.price || 199) * (item.quantity || 1));
      }, 0);

      return res.status(200).json({
        success: true,
        amounts: {
          customer: total,
          menu: total,
          discount: 0,
          tax: Math.round(total * 0.05),
          total: Math.round(total * 1.05)
        },
        isFallback: true
      });
    }

    const result = await safeDominosCall(async () => {
      const { Order, Customer, Item } = await import('dominos');
      const customer = new Customer({
        address: customerInfo.address,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        email: customerInfo.email
      });

      const order = new Order(customer);
      order.storeID = storeID;

      items.forEach(item => {
        order.addItem(new Item({
          code: item.code,
          options: item.options || {},
          quantity: item.quantity || 1
        }));
      });

      await order.validate();
      await order.price();
      return order.amountsBreakdown;
    });

    if (result) {
      return res.status(200).json({ success: true, amounts: result });
    }

    // Fallback for real store IDs when API is blocked
    const total = items.reduce((sum, item) => sum + 299 * (item.quantity || 1), 0);
    return res.status(200).json({
      success: true,
      amounts: { customer: total, menu: total, discount: 0, tax: Math.round(total * 0.05), total: Math.round(total * 1.05) },
      isFallback: true
    });
  } catch (error) {
    console.error('Validation/Price Error:', error.message);
    return res.status(500).json({ success: false, message: 'Order validation failed. Please try again.' });
  }
};

/**
 * Place Order (Simulated)
 */
export const placeOrder = async (req, res) => {
  try {
    const { customerInfo, storeID, items } = req.body;

    if (!customerInfo?.phone || !customerInfo?.firstName) {
      return res.status(400).json({ success: false, message: 'Customer info with phone and name is required' });
    }

    const orderID = 'PV-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Calculate total from items
    const total = items?.reduce((sum, item) => {
      const menuItem = FALLBACK_MENU.products.find(p => p.code === item.code);
      return sum + ((menuItem?.price || 299) * (item.quantity || 1));
    }, 0) || 0;

    // Store in simulation map for tracking
    simulatedOrders.set(customerInfo.phone, {
      orderID,
      startTime: Date.now(),
      customerName: customerInfo.firstName,
      estimatedTime: 25,
      amount: Math.round(total * 1.05)
    });

    return res.status(200).json({
      success: true,
      message: 'Order placed successfully!',
      orderID,
      amount: Math.round(total * 1.05),
      estimatedTime: '25-30 mins'
    });
  } catch (error) {
    console.error('Place Order Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to place order. Please try again.' });
  }
};

/**
 * Track an Order by Phone
 */
export const trackOrderByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    // Check simulated orders first
    if (simulatedOrders.has(phone)) {
      const order = simulatedOrders.get(phone);
      const elapsedMs = Date.now() - order.startTime;
      const elapsedMins = elapsedMs / 60000;

      let status = 'Preparation';
      let progress = 20;
      if (elapsedMins > 0.5) { status = 'Baking'; progress = 40; }
      if (elapsedMins > 1.5) { status = 'QualityCheck'; progress = 60; }
      if (elapsedMins > 3)   { status = 'OutForDelivery'; progress = 80; }
      if (elapsedMins > 5)   { status = 'Delivered'; progress = 100; }

      return res.status(200).json({
        success: true,
        tracking: {
          OrderStatus: status,
          Progress: progress,
          EstimatedWaitMinutes: Math.max(0, 25 - Math.floor(elapsedMins)),
          DriverName: elapsedMins > 3 ? 'Rohan S.' : 'Assigning...',
          OrderID: order.orderID,
          CustomerName: order.customerName
        }
      });
    }

    // Try real Domino's tracking (likely blocked)
    const result = await safeDominosCall(async () => {
      const { Tracking } = await import('dominos');
      const tracking = new Tracking();
      return await tracking.byPhone(phone);
    });

    if (result && (!Array.isArray(result) || result.length > 0)) {
      return res.status(200).json({ success: true, tracking: result });
    }

    return res.status(404).json({
      success: false,
      message: 'No active orders found for this phone number'
    });
  } catch (error) {
    console.error('Tracking Error:', error.message);
    return res.status(404).json({
      success: false,
      message: 'No active orders found for this phone number'
    });
  }
};
