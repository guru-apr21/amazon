const orderItems = [
  { name: "Hello", price: 10, quantity: 2 },
  { name: "Welcome", price: 10, quantity: 9 },
];

const line_items = orderItems.map((p) => {
  return {
    price_data: {
      currency: "inr",
      product_data: {
        name: p.name,
      },
      unit_amount: p.price,
    },
    quantity: p.quantity,
  };
});

console.log(line_items[0]);
