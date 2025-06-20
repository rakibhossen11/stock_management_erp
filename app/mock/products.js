const mockProducts = [
    {
      id: '1',
      name: 'Premium Laptop',
      code: 'LT-1001',
      description: 'High-performance business laptop with 16GB RAM and 1TB SSD',
      category: 'Electronics',
      price: 1299.99,
      cost: 899.99,
      stock: 45,
      reorderLevel: 10,
      active: true,
      createdAt: '2023-05-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Ergonomic Keyboard',
      code: 'KB-2001',
      description: 'Wireless ergonomic keyboard for comfortable typing',
      category: 'Accessories',
      price: 89.99,
      cost: 45.50,
      stock: 120,
      reorderLevel: 25,
      active: true,
      createdAt: '2023-06-20T14:30:00Z'
    },
    {
      id: '3',
      name: '4K Monitor',
      code: 'MN-3001',
      description: '27-inch 4K UHD monitor with HDR support',
      category: 'Electronics',
      price: 399.99,
      cost: 275.00,
      stock: 18,
      reorderLevel: 5,
      active: true,
      createdAt: '2023-07-10T09:15:00Z'
    },
    {
      id: '4',
      name: 'Office Chair',
      code: 'CH-4001',
      description: 'Executive ergonomic office chair with lumbar support',
      category: 'Furniture',
      price: 249.99,
      cost: 150.00,
      stock: 8,
      reorderLevel: 3,
      active: false,
      createdAt: '2023-08-05T11:45:00Z'
    }
  ];
  
  export default mockProducts;