import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, PauseCircle, Percent, Dessert } from 'lucide-react';
import { BiCategory } from 'react-icons/bi';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface HeldOrder {
  id: string;
  items: CartItem[];
  timestamp: Date;
  total: number;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Burger",
    price: 450,
    image: "https://images.unsplash.com/photo-1560130803-aaadb4bc913e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Fast Food"
  },
  {
    id: 2,
    name: "Pizza",
    price: 500,
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Fast Food"
  },
  {
    id: 3,
    name: "Beer",
    price: 200,
    image: "https://images.unsplash.com/photo-1586993451228-09818021e309?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Drinks"
  },
  {
    id: 4,
    name: "Indian Food",
    price: 1200,
    image: "https://images.unsplash.com/photo-1548940740-204726a19be3?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Asian"
  },
  {
    id: 5,
    name: "Coffee",
    price: 430,
    image: "https://images.unsplash.com/photo-1522992319-0365e5f11656?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Beverages"
  },
  {
    id:6,
    name:"Thakali set",
    price: 800,
    image: "https://media.istockphoto.com/id/1150375890/photo/assorted-indian-food-set-on-wooden-background-dishes-and-appetisers-of-indeed-cuisine-rice.jpg?s=1024x1024&w=is&k=20&c=W-snte6fs2zKOFmzVcyZzsS7r6bMee8tU4Pr3jfiptM=",
    category :"Healthy"
  },
  {
    id: 7,
    name: "Ice Cream",
    price: 200,
    image: "https://images.unsplash.com/photo-1594488506255-a8bbfdeedbaf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Desserts"
  },
  {
  id: 8,
  name:"PaniPuri",
  price: 350,
  image: "https://media.istockphoto.com/id/2162493302/photo/exploring-the-tangy-spicy-and-refreshing-delight-of-pani-puri-indias-favourite-street-food.jpg?s=1024x1024&w=is&k=20&c=dD11W7hKHAMQ99rQHw6CQ0_ZX4ZzHgP_F6yJYRJAdeI=",
  category:"Dessert"
  },

];

const categories = ["All", "Fast Food", "Healthy", "Asian", "Beverages", "Desserts" , "Drinks"];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([]);
  const [showHeldOrders, setShowHeldOrders] = useState(false);
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const holdOrder = () => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = discount
      ? discount.type === 'percentage'
        ? (subtotal * discount.value) / 100
        : discount.value
      : 0;
    const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
    const tax = discountedSubtotal * 0.1;
    const total = discountedSubtotal + tax;

    const newHeldOrder: HeldOrder = {
      id: Date.now().toString(),
      items: [...cart],
      timestamp: new Date(),
      total: total
    };

    setHeldOrders(prev => [...prev, newHeldOrder]);
    setCart([]);
    setDiscount(null);
  };

  const resumeOrder = (order: HeldOrder) => {
    setCart(order.items);
    setHeldOrders(prev => prev.filter(o => o.id !== order.id));
    setShowHeldOrders(false);
    setDiscount(null);
  };

  const applyDiscount = () => {
    const value = parseFloat(discountInput);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }

    if (discountType === 'fixed' && value > subtotal) {
      alert("Discount amount cannot exceed the subtotal.");
      return;
    }

    setDiscount({
      type: discountType,
      value: value
    });
    setShowDiscountModal(false);
    setDiscountInput("");
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discount
    ? discount.type === 'percentage'
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const tax = discountedSubtotal * 0.1;
  const total = discountedSubtotal + tax;

  return (
    <div className="pos-container">
      <div className="products-section">
        <h1>Menu</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        
        <div className="categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => addToCart(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-name">{product.name}</div>
              <div className="product-price">Rs{product.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <div className="cart-header">
          <h2>Menu Cart</h2>
          {heldOrders.length > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={() => setShowHeldOrders(!showHeldOrders)}
              aria-label="Toggle held orders"
            >
              Held Orders ({heldOrders.length})
            </button>
          )}
        </div>

        {showHeldOrders ? (
          <div className="held-orders">
            <h3 className="held-orders-title">Held Orders</h3>
            {heldOrders.map(order => (
              <div key={order.id} className="held-order-card" onClick={() => resumeOrder(order)}>
                <div className="held-order-header">
                  <span>Order #{order.id.slice(-4)}</span>
                  <span>{order.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="held-order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="held-order-item">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>
                <div className="held-order-total">
                  Total: Rs{order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    Rs{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => addToCart(item)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs{subtotal.toFixed(2)}</span>
          </div>
          {discount && (
            <div className="summary-row discount-row">
              <span className="discount-label">
                Discount
                {discount.type === 'percentage' ? ` (Rs{discount.value}%)` : ''}
                <button className="remove-discount" onClick={removeDiscount} aria-label="Remove discount">×</button>
              </span>
              <span>-Rs{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>Rs{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Payable Amount</span>
            <span>Rs{total.toFixed(2)}</span>
          </div>
          <div className="cart-actions">
            <button 
              className="btn btn-secondary"
              onClick={holdOrder}
              disabled={cart.length === 0}
              aria-label="Hold order"
            >
              <PauseCircle size={20} />
              Hold Order
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowDiscountModal(true)}
              disabled={cart.length === 0}
              aria-label="Add discount"
            >
              <Percent size={20} />
              Add Discount
            </button>
            <button 
              className="btn btn-primary"
              disabled={cart.length === 0}
              aria-label="Proceed"
            >
              <ShoppingCart size={20} />
              Proceed
            </button>
          </div>
        </div>
      </div>

      {showDiscountModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Discount</h3>
            <div className="discount-type-selector">
              <label>
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={discountType === 'percentage'}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                />
                Percentage (%)
              </label>
              <label>
                <input
                  type="radio"
                  name="discountType"
                  value="fixed"
                  checked={discountType === 'fixed'}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                />
                Fixed Amount (Rs)
              </label>
            </div>
            <input
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              className="discount-input"
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDiscountModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={applyDiscount}>
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

