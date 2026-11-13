import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const BANK = {
  bank: "First Bank",
  accountName: "Oladeji Peace Simeon",
  accountNumber: "3216809728"
};

const demoProducts = [
  { id: "demo-1", name: "Everyday Sneakers", price: 28000, category: "Fashion", description: "Comfortable everyday footwear.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-2", name: "Classic Wristwatch", price: 18500, category: "Accessories", description: "A clean, versatile everyday watch.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-3", name: "Wireless Headphones", price: 42000, category: "Electronics", description: "Enjoy music and calls on the go.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" },
  { id: "demo-4", name: "Home Decor Set", price: 15000, category: "Home", description: "Simple pieces for a welcoming space.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80" }
];

function money(value) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value || 0);
}

export default function App() {
  const [products, setProducts] = useState(demoProducts);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      if (!supabase) return;
      const { data, error } = await supabase.from("Products").select("*").eq("status", "approved");
      if (!error && data?.length) {
        setProducts(data.map(p => ({
          id: p.id, name: p.name || p.product_name || "Product",
          price: Number(p.price || 0), category: p.category || "Other",
          description: p.description || "", image: p.image_url || p.image || ""
        })));
      }
    }
    loadProducts();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map(p => p.category).filter(Boolean))], [products]);
  const visibleProducts = products.filter(p =>
    (category === "All" || p.category === category) &&
    `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function signIn(e) {
    e.preventDefault();
    if (!supabase) return setMessage("Add your Supabase URL and key in the .env file first.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in successfully.");
  }
  async function signUp(e) {
    e.preventDefault();
    if (!supabase) return setMessage("Add your Supabase URL and key in the .env file first.");
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: customerName } } });
    setMessage(error ? error.message : "Account created. Check your email if confirmation is enabled.");
  }
  async function applyAsVendor(e) {
    e.preventDefault();
    if (!supabase || !user) return setMessage("Please sign in and connect Supabase before applying.");
    const { error } = await supabase.from("Stores").insert([{ name: storeName, owner_id: user.id, status: "pending" }]);
    setMessage(error ? error.message : "Your vendor application has been submitted for admin approval.");
    if (!error) setVendorOpen(false);
  }
  async function submitOrder(e) {
    e.preventDefault();
    if (!user || !supabase) return setMessage("Please sign in and connect Supabase before placing an order.");
    // Confirm your Orders table column names before using live payments.
    const { error } = await supabase.from("Orders").insert([{
      customer_id: user.id,
      total_amount: total,
      payment_method: "bank_transfer",
      payment_status: "pending",
      delivery_phone: phone
    }]);
    setMessage(error ? `Order could not be saved: ${error.message}` : "Order submitted. Make your transfer and send proof to the marketplace administrator.");
    if (!error) { setCart([]); setCheckoutOpen(false); }
  }

  return (
    <div className="app">
      <div className="topline">WELCOME TO KINGS & QUEEN MARKETPLACE</div>
      <header className="header">
        <a className="brand" href="#"><span className="crown">♛</span><span>KINGS <b>&</b> QUEEN<small>MARKETPLACE</small></span></a>
        <nav><a href="#shop">Shop</a><a href="#how">How it works</a><a href="#sell">Sell with us</a></nav>
        <div className="header-actions">
          <button className="ghost" onClick={() => setAuthOpen(true)}>{user ? "My account" : "Sign in"}</button>
          <button className="cart-btn" onClick={() => setCheckoutOpen(true)}>Cart ({cart.reduce((n, i) => n + i.quantity, 0)})</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">A MARKETPLACE FOR EVERYONE</p>
            <h1>Discover more.<br/><em>Shop with confidence.</em></h1>
            <p>Find products you love and connect with trusted sellers in one convenient marketplace.</p>
            <a className="primary-link" href="#shop">Explore products <span>→</span></a>
          </div>
          <div className="hero-art"><div className="hero-card"><span>♛</span><strong>Good finds.<br/>Great value.</strong><small>KINGS & QUEEN</small></div></div>
        </section>

        <section className="section" id="shop">
          <div className="section-heading"><div><p className="eyebrow">THE MARKETPLACE</p><h2>Explore products</h2></div><input className="search" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="filters">{categories.map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{c}</button>)}</div>
          <div className="products">
            {visibleProducts.map(p => <article className="product" key={p.id}>
              <div className="product-image">{p.image ? <img src={p.image} alt={p.name}/> : <span>♛</span>}</div>
              <div className="product-info"><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><strong>{money(p.price)}</strong><button onClick={() => setCart(old => { const found = old.find(i => i.id === p.id); return found ? old.map(i => i.id === p.id ? {...i, quantity:i.quantity+1} : i) : [...old, {...p, quantity:1}]; })}>Add to cart</button></div></div>
            </article>)}
          </div>
          {!visibleProducts.length && <p className="empty">No products match your search yet.</p>}
          <p className="demo-note">Sample products are shown until approved products are available in your connected Supabase database.</p>
        </section>

        <section className="sell" id="sell"><div><p className="eyebrow">GROW YOUR BUSINESS</p><h2>Have something to sell?</h2><p>Join Kings & Queen as a vendor and reach more customers.</p></div><button className="light-btn" onClick={() => user ? setVendorOpen(true) : setAuthOpen(true)}>Become a vendor <span>→</span></button></section>
        <section className="how section" id="how"><p className="eyebrow">SIMPLE & SECURE</p><h2>Shopping made easy</h2><div className="steps"><div><b>01</b><h3>Discover</h3><p>Browse products across different categories.</p></div><div><b>02</b><h3>Add to cart</h3><p>Choose what you need and review your order.</p></div><div><b>03</b><h3>Pay by transfer</h3><p>Use the displayed bank details and await payment verification.</p></div></div></section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="crown">♛</span><span>KINGS <b>&</b> QUEEN<small>MARKETPLACE</small></span></a><p>Shop. Sell. Grow.</p><small>© {new Date().getFullYear()} Kings & Queen Marketplace.</small></footer>

      {message && <div className="toast" onClick={() => setMessage("")}>{message} <b>×</b></div>}
      {authOpen && <div className="overlay" onClick={() => setAuthOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setAuthOpen(false)}>×</button><p className="eyebrow">YOUR ACCOUNT</p><h2>Welcome</h2>{user ? <><p>You are signed in as {user.email}</p><button className="primary" onClick={() => supabase?.auth.signOut()}>Sign out</button></> : <><form onSubmit={signUp}><label>Full name</label><input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your name"/><label>Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/><label>Password</label><input type="password" required minLength="6" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"/><button className="primary" type="submit">Create account</button></form><button className="text-btn" onClick={signIn}>Already registered? Sign in</button></>}</div></div>}
      {vendorOpen && <div className="overlay" onClick={() => setVendorOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setVendorOpen(false)}>×</button><p className="eyebrow">SELL ON KINGS & QUEEN</p><h2>Vendor application</h2><form onSubmit={applyAsVendor}><label>Store name</label><input required value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="Your business name"/><button className="primary">Submit for approval</button></form></div></div>}
      {checkoutOpen && <div className="overlay" onClick={() => setCheckoutOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setCheckoutOpen(false)}>×</button><p className="eyebrow">YOUR ORDER</p><h2>Shopping cart</h2>{cart.length ? cart.map(i => <div className="cart-line" key={i.id}><span>{i.name} × {i.quantity}</span><b>{money(i.price*i.quantity)}</b></div>) : <p>Your cart is empty.</p>}<div className="total"><b>Total</b><b>{money(total)}</b></div>{cart.length > 0 && <><h3>Bank transfer details</h3><div className="bank"><p><b>Bank:</b> {BANK.bank}</p><p><b>Account name:</b> {BANK.accountName}</p><p><b>Account number:</b> {BANK.accountNumber}</p></div><form onSubmit={submitOrder}><label>Phone number for delivery</label><input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number"/><button className="primary">Place order</button></form><small>Payment is subject to admin verification. Paystack integration will be added later.</small></>}</div></div>}
    </div>
  );
}
