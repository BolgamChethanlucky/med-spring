// ==========================================
// 1. HERO ANIMATIONS (Parallax Grid)
// ==========================================
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

window.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateHero() {
  currentX += (targetX - currentX) * 0.1;
  currentY += (targetY - currentY) * 0.1;

  const gridBg = document.getElementById('grid-bg');
  if (gridBg) {
    const offsetX = ((currentX / window.innerWidth) - 0.5) * 16 * 0.06;
    const offsetY = ((currentY / window.innerHeight) - 0.5) * 16 * 0.06;
    gridBg.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  requestAnimationFrame(animateHero);
}
animateHero();

// ==========================================
// 2. MOBILE MENU LOGIC
// ==========================================
const openBtn = document.getElementById('open-menu-btn');
const closeBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navItems = document.querySelectorAll('.mobile-nav-item');

function toggleMenu(show) {
  if (show) {
    document.body.style.overflow = 'hidden';
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
  } else {
    document.body.style.overflow = 'auto';
    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
  }
}

if(openBtn) openBtn.addEventListener('click', () => toggleMenu(true));
if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
navItems.forEach(item => item.addEventListener('click', () => toggleMenu(false)));


// ==========================================
// 3. APOTHECARY LOGIC
// ==========================================
(function () {
  "use strict";

  const CATEGORY_META = {
    minor:     { label: "Minor",      short: "MINOR",     tone: "sage"  },
    doctor:    { label: "Physician",  short: "PHYSICIAN", tone: "amber" },
    emergency: { label: "Emergency",  short: "EMERGENCY", tone: "rust"  },
    crisis:    { label: "Crisis",     short: "CRISIS",    tone: "rust"  }
  };

  const QUICK_TERMS = ["Common Cold", "Headache", "Allergies", "Heartburn", "Fever"];
  
  // DOM Elements
  const searchInput = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");
  const suggestionsBox = document.getElementById("suggestions");
  const resultsRegion = document.getElementById("results");
  const chipsBox = document.getElementById("quick-chips");
  const azDirectory = document.getElementById("az-directory");
  const toggleAzBtn = document.getElementById("toggle-az-btn");
  const filterBtns = document.querySelectorAll('.filter-btn');
  const guideSection = document.getElementById("guide");
  
  let currentFilter = 'all';
  let isAzMode = false;
  let activeSuggestionIndex = -1;
  let currentSuggestions = [];

  // User State / Personal Ledger Storage
  let currentUser = null; 
  let userBookings = [];
  let userOrders = [];
  let bookmarkedAilments = new Set();

  function normalize(str) { return (str || "").toLowerCase().trim(); }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getMockPrice(str, min, max) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % (max - min)) + min;
  }

  // --- WORKING NAVBAR QUICK ACTIONS ---
  const navBookLink = document.getElementById('nav-book-link');
  const mobileBookLink = document.getElementById('mobile-book-link');
  const navOrderLink = document.getElementById('nav-order-link');
  const mobileOrderLink = document.getElementById('mobile-order-link');

  function triggerBookAppointmentMode() {
    toggleMenu(false);
    // Instantly open booking modal for a default top specialist in Hyderabad
    openBookingModal("Dr. Sudhir Kumar", "Apollo Hospitals", "Jubilee Hills, Hyderabad", "₹950");
  }

  function triggerOrderMedicinesMode() {
    toggleMenu(false);
    // Instantly open the order modal for Paracetamol 500mg
    openOrderModal("Paracetamol 500mg", "45");
  }

  if(navBookLink) navBookLink.addEventListener('click', triggerBookAppointmentMode);
  if(mobileBookLink) mobileBookLink.addEventListener('click', triggerBookAppointmentMode);
  if(navOrderLink) navOrderLink.addEventListener('click', triggerOrderMedicinesMode);
  if(mobileOrderLink) mobileOrderLink.addEventListener('click', triggerOrderMedicinesMode);


  // --- PERSONAL LEDGER / USER DASHBOARD DRAWER LOGIC ---
  const userLedgerBtn = document.getElementById('user-ledger-btn');
  const userLedgerDrawer = document.getElementById('user-ledger-drawer');
  const userLedgerContent = document.getElementById('user-ledger-content');
  const closeLedgerBtn = document.getElementById('close-ledger-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  const drawerUserName = document.getElementById('drawer-user-name');
  const drawerUserInitials = document.getElementById('drawer-user-initials');
  const bookmarkCount = document.getElementById('bookmark-count');
  const bookmarkedList = document.getElementById('bookmarked-list');
  const bookingCount = document.getElementById('booking-count');
  const userBookingsList = document.getElementById('user-bookings-list');
  const orderCount = document.getElementById('order-count');
  const userOrdersList = document.getElementById('user-orders-list');

  function openUserLedger() {
    if(!currentUser) {
      openAuthModal(false);
      return;
    }
    renderLedgerData();
    userLedgerDrawer.classList.remove('opacity-0', 'pointer-events-none');
    userLedgerContent.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeUserLedger() {
    userLedgerDrawer.classList.add('opacity-0', 'pointer-events-none');
    userLedgerContent.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  function renderLedgerData() {
    drawerUserName.textContent = currentUser;
    drawerUserInitials.textContent = currentUser.charAt(0).toUpperCase();

    bookmarkCount.textContent = bookmarkedAilments.size;
    if (bookmarkedAilments.size === 0) {
      bookmarkedList.innerHTML = `<p class="text-white/30 text-xs italic bg-white/5 p-3 rounded-xl">No saved ailments yet. Click the bookmark icon on any index card.</p>`;
    } else {
      bookmarkedList.innerHTML = "";
      bookmarkedAilments.forEach(name => {
        const item = document.createElement('div');
        item.className = "bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs text-white";
        item.innerHTML = `
          <span class="font-bold">${escapeHtml(name)}</span>
          <button class="text-blue-400 hover:text-blue-300 font-mono text-[10px]">View →</button>
        `;
        item.querySelector('button').addEventListener('click', () => {
          closeUserLedger();
          const found = AILMENTS.find(a => a.name === name);
          if(found) selectAilment(found);
        });
        bookmarkedList.appendChild(item);
      });
    }

    bookingCount.textContent = userBookings.length;
    if (userBookings.length === 0) {
      userBookingsList.innerHTML = `<p class="text-white/30 text-xs italic bg-white/5 p-3 rounded-xl">No appointments booked yet.</p>`;
    } else {
      userBookingsList.innerHTML = "";
      userBookings.forEach(b => {
        const div = document.createElement('div');
        div.className = "bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1";
        div.innerHTML = `
          <div class="flex justify-between font-bold text-white"><span class="truncate">${escapeHtml(b.doctor)}</span><span class="text-blue-400">${b.price}</span></div>
          <div class="text-white/60 truncate">${escapeHtml(b.hospital)}</div>
          <div class="text-white/40 font-mono text-[10px]">📅 ${b.date} at ${b.time}</div>
        `;
        userBookingsList.appendChild(div);
      });
    }

    orderCount.textContent = userOrders.length;
    if (userOrders.length === 0) {
      userOrdersList.innerHTML = `<p class="text-white/30 text-xs italic bg-white/5 p-3 rounded-xl">No medicine orders placed yet.</p>`;
    } else {
      userOrdersList.innerHTML = "";
      userOrders.forEach(o => {
        const div = document.createElement('div');
        div.className = "bg-white/5 border border-white/10 rounded-xl p-3 text-xs space-y-1";
        div.innerHTML = `
          <div class="flex justify-between font-bold text-white"><span>${escapeHtml(o.medicine)} (x${o.qty})</span><span class="text-green-400">₹${o.total}</span></div>
          <div class="text-white/40 font-mono text-[10px]">🚚 Status: <span class="text-green-400">Out for Delivery (14m)</span></div>
        `;
        userOrdersList.appendChild(div);
      });
    }
  }

  if(userLedgerBtn) userLedgerBtn.addEventListener('click', openUserLedger);
  if(closeLedgerBtn) closeLedgerBtn.addEventListener('click', closeUserLedger);
  if(userLedgerDrawer) userLedgerDrawer.addEventListener('click', (e) => {
    if(e.target === userLedgerDrawer) closeUserLedger();
  });
  if(logoutBtn) logoutBtn.addEventListener('click', () => {
    currentUser = null;
    userLedgerBtn.classList.add('hidden');
    document.getElementById('desktop-login-btn').classList.remove('hidden');
    document.getElementById('desktop-signup-btn').classList.remove('hidden');
    closeUserLedger();
  });

  // --- AUTHENTICATION MODAL LOGIC ---
  const authModal = document.getElementById('auth-modal');
  const authContent = document.getElementById('auth-modal-content');
  const closeAuthModalBtn = document.getElementById('close-auth-modal-btn');
  const authForm = document.getElementById('auth-form');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleBtn = document.getElementById('auth-toggle-btn');
  const authTitle = document.getElementById('auth-modal-title');
  const authSubtitle = document.getElementById('auth-modal-subtitle');
  const authNameContainer = document.getElementById('auth-name-container');
  const authNameInput = document.getElementById('auth-name');
  const authEmailInput = document.getElementById('auth-email');
  
  let isSignUpMode = false;

  function openAuthModal(isSignUpInit) {
    isSignUpMode = isSignUpInit;
    updateAuthUI();
    authModal.classList.remove('opacity-0', 'pointer-events-none');
    authContent.classList.remove('scale-95');
    authContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden'; 
    toggleMenu(false); 
  }

  function closeAuthModal() {
    authModal.classList.add('opacity-0', 'pointer-events-none');
    authContent.classList.remove('scale-100');
    authContent.classList.add('scale-95');
    document.body.style.overflow = ''; 
    authForm.reset();
  }

  function updateAuthUI() {
    if (isSignUpMode) {
      authTitle.textContent = "Create Account";
      authSubtitle.textContent = "Join Anamesis to save your ledger and bookings.";
      authSubmitBtn.textContent = "Sign Up";
      authToggleBtn.textContent = "Already have an account? Log in";
      authNameContainer.classList.remove('hidden');
      authNameInput.required = true;
    } else {
      authTitle.textContent = "Welcome Back";
      authSubtitle.textContent = "Log in to your Anamesis account.";
      authSubmitBtn.textContent = "Log In";
      authToggleBtn.textContent = "Don't have an account? Sign up";
      authNameContainer.classList.add('hidden');
      authNameInput.required = false;
    }
  }

  if(authToggleBtn) {
    authToggleBtn.addEventListener('click', () => {
      isSignUpMode = !isSignUpMode;
      updateAuthUI();
    });
  }

  if(closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
  if(authModal) authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal(); 
  });

  if(authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      currentUser = isSignUpMode && authNameInput.value ? authNameInput.value : (authEmailInput.value.split('@')[0] || "Chethan");
      
      const originalText = authSubmitBtn.textContent;
      authSubmitBtn.textContent = "Success ✓";
      authSubmitBtn.classList.replace('bg-blue-600', 'bg-green-500');
      
      setTimeout(() => {
        closeAuthModal();
        document.getElementById('desktop-login-btn').classList.add('hidden');
        document.getElementById('desktop-signup-btn').classList.add('hidden');
        userLedgerBtn.classList.remove('hidden');
        document.getElementById('nav-username').textContent = currentUser;

        setTimeout(() => {
          authSubmitBtn.textContent = originalText;
          authSubmitBtn.classList.replace('bg-green-500', 'bg-blue-600');
        }, 500);
      }, 1000);
    });
  }

  const desktopLogin = document.getElementById('desktop-login-btn');
  const desktopSignup = document.getElementById('desktop-signup-btn');
  const mobileLogin = document.getElementById('mobile-login-btn');
  const mobileSignup = document.getElementById('mobile-signup-btn');

  if(desktopLogin) desktopLogin.addEventListener('click', () => openAuthModal(false));
  if(desktopSignup) desktopSignup.addEventListener('click', () => openAuthModal(true));
  if(mobileLogin) mobileLogin.addEventListener('click', () => openAuthModal(false));
  if(mobileSignup) mobileSignup.addEventListener('click', () => openAuthModal(true));

  // --- CONSULT PHARMACIST AI CHAT MODAL LOGIC ---
  const chatModal = document.getElementById('chat-modal');
  const chatContent = document.getElementById('chat-modal-content');
  const closeChatModalBtn = document.getElementById('close-chat-modal-btn');
  const consultPharmacistBtn = document.getElementById('consult-pharmacist-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const triageChips = document.querySelectorAll('.triage-chip');

  function openChatModal() {
    chatModal.classList.remove('opacity-0', 'pointer-events-none');
    chatContent.classList.remove('scale-95');
    chatContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden';
  }

  function closeChatModal() {
    chatModal.classList.add('opacity-0', 'pointer-events-none');
    chatContent.classList.remove('scale-100');
    chatContent.classList.add('scale-95');
    document.body.style.overflow = '';
  }

  if(consultPharmacistBtn) consultPharmacistBtn.addEventListener('click', openChatModal);
  if(closeChatModalBtn) closeChatModalBtn.addEventListener('click', closeChatModal);
  if(chatModal) chatModal.addEventListener('click', (e) => {
    if(e.target === chatModal) closeChatModal();
  });

  function appendChatMessage(sender, text) {
    const isAi = sender === 'AI';
    const div = document.createElement('div');
    div.className = `flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`;
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full ${isAi ? 'bg-blue-600/30 border border-blue-400/30 text-blue-300' : 'bg-purple-600/30 border border-purple-400/30 text-purple-300'} flex items-center justify-center text-xs font-bold shrink-0">${sender}</div>
      <div class="${isAi ? 'bg-white/5 border border-white/10 text-white/90' : 'bg-blue-600 text-white'} rounded-2xl p-3.5 max-w-[80%] leading-relaxed text-sm">${escapeHtml(text)}</div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserQuery(query) {
    appendChatMessage('You', query);
    chatInput.value = "";

    setTimeout(() => {
      const q = normalize(query);
      let reply = "I understand. For symptoms like that, I recommend resting, staying hydrated, and browsing our index for OTC relief or specialist care in Hyderabad.";
      
      if (q.includes('headache') || q.includes('migraine')) {
        reply = "Severe or recurring headaches could be tension or migraines. Try Paracetamol 500mg and consider consulting Dr. Sudhir Kumar at Apollo Hospitals (Jubilee Hills).";
      } else if (q.includes('heartburn') || q.includes('acid') || q.includes('stomach')) {
        reply = "Acid reflux can often be managed with antacids or dietary care. For persistent issues, Dr. Nageshwar Reddy at AIG Hospitals (Gachibowli) is a top gastroenterologist.";
      } else if (q.includes('fever') || q.includes('cold') || q.includes('cough')) {
        reply = "For viral cold and fever, rest and hydration are key. Basic OTC options like Paracetamol can help manage temperature. Talk to an ENT specialist if symptoms persist past 3 days.";
      } else if (q.includes('uti') || q.includes('burning')) {
        reply = "Burning urination often points to a urinary tract infection. Drink plenty of water and consider visiting Dr. P.V. Murthy at Care Hospitals (Banjara Hills).";
      }

      appendChatMessage('AI', reply);
    }, 600);
  }

  if(chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if(chatInput.value.trim()) handleUserQuery(chatInput.value);
    });
  }

  triageChips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleUserQuery(chip.getAttribute('data-symptom'));
    });
  });

  // --- DOCTOR BOOKING MODAL LOGIC WITH MAP ---
  const bookingModal = document.getElementById('booking-modal');
  const bookingContent = document.getElementById('booking-modal-content');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalDocInfo = document.getElementById('modal-doctor-info');
  const modalHospitalLoc = document.getElementById('modal-hospital-loc');
  const appointmentForm = document.getElementById('appointment-form');
  const aptSubmitBtn = document.getElementById('apt-submit-btn');

  let activeBookingDoc = null;

  function openBookingModal(name, hospital, location, priceStr) {
    activeBookingDoc = { name, hospital, price: priceStr };
    modalDocInfo.textContent = `${name} • ${hospital} • Consultation: ${priceStr}`;
    modalHospitalLoc.textContent = `${hospital} (${location})`;
    aptSubmitBtn.textContent = `Pay ${priceStr} & Confirm`;
    bookingModal.classList.remove('opacity-0', 'pointer-events-none');
    bookingContent.classList.remove('scale-95');
    bookingContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden'; 
  }

  function closeBookingModal() {
    bookingModal.classList.add('opacity-0', 'pointer-events-none');
    bookingContent.classList.remove('scale-100');
    bookingContent.classList.add('scale-95');
    document.body.style.overflow = ''; 
    appointmentForm.reset();
  }

  if(closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
  if(bookingModal) bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal(); 
  });

  if(appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      const dateVal = document.getElementById('apt-date').value;
      const timeVal = document.getElementById('apt-time').value;

      if(activeBookingDoc) {
        userBookings.push({
          doctor: activeBookingDoc.name,
          hospital: activeBookingDoc.hospital,
          price: activeBookingDoc.price,
          date: dateVal,
          time: timeVal
        });
      }

      const originalText = aptSubmitBtn.textContent;
      aptSubmitBtn.textContent = "Booking Confirmed ✓";
      aptSubmitBtn.classList.replace('bg-blue-600', 'bg-green-500');
      
      setTimeout(() => {
        closeBookingModal();
        setTimeout(() => {
          aptSubmitBtn.textContent = originalText;
          aptSubmitBtn.classList.replace('bg-green-500', 'bg-blue-600');
        }, 500);
      }, 1500);
    });
  }

  // --- MEDICINE ORDERING SMART CART LOGIC ---
  const orderModal = document.getElementById('order-modal');
  const orderContent = document.getElementById('order-modal-content');
  const closeOrderModalBtn = document.getElementById('close-order-modal-btn');
  const orderForm = document.getElementById('order-form');
  const orderSubmitBtn = document.getElementById('order-submit-btn');
  
  const modalMedName = document.getElementById('modal-medicine-name');
  const modalMedUnitPrice = document.getElementById('modal-medicine-unit-price');
  const qtyDisplay = document.getElementById('qty-display');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');

  let activeOrderMed = "";
  let cartItemPrice = 0;
  let cartQty = 1;

  function updateCartUI() {
    qtyDisplay.textContent = cartQty;
    const total = cartItemPrice * cartQty;
    summarySubtotal.textContent = `₹${total}`;
    summaryTotal.textContent = `₹${total}`;
    orderSubmitBtn.textContent = `Pay ₹${total} & Checkout`;
  }

  qtyMinus.addEventListener('click', (e) => {
    e.preventDefault();
    if(cartQty > 1) { cartQty--; updateCartUI(); }
  });

  qtyPlus.addEventListener('click', (e) => {
    e.preventDefault();
    if(cartQty < 10) { cartQty++; updateCartUI(); }
  });

  function openOrderModal(medicineName, price) {
    activeOrderMed = medicineName;
    cartItemPrice = parseInt(price);
    cartQty = 1; 
    modalMedName.textContent = medicineName;
    modalMedUnitPrice.textContent = `₹${cartItemPrice} / unit`;
    updateCartUI(); 
    
    orderModal.classList.remove('opacity-0', 'pointer-events-none');
    orderContent.classList.remove('scale-95');
    orderContent.classList.add('scale-100');
    document.body.style.overflow = 'hidden'; 
  }

  function closeOrderModal() {
    orderModal.classList.add('opacity-0', 'pointer-events-none');
    orderContent.classList.remove('scale-100');
    orderContent.classList.add('scale-95');
    document.body.style.overflow = ''; 
    orderForm.reset();
  }

  if(closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeOrderModal);
  if(orderModal) orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal(); 
  });

  if(orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault(); 
      userOrders.push({
        medicine: activeOrderMed,
        qty: cartQty,
        total: cartItemPrice * cartQty
      });

      const originalText = orderSubmitBtn.textContent;
      orderSubmitBtn.textContent = "Order Placed ✓";
      orderSubmitBtn.classList.replace('bg-blue-600', 'bg-green-500');
      
      setTimeout(() => {
        closeOrderModal();
        setTimeout(() => {
          orderSubmitBtn.textContent = originalText;
          orderSubmitBtn.classList.replace('bg-green-500', 'bg-blue-600');
        }, 500);
      }, 1500);
    });
  }

  // --- EVENT DELEGATION ---
  document.addEventListener('click', (e) => {
    const docCard = e.target.closest('.doctor-card');
    if (docCard) {
      const docName = docCard.getAttribute('data-doc-name');
      const docHospital = docCard.getAttribute('data-doc-hospital');
      const docLocation = docCard.getAttribute('data-doc-location');
      const docPrice = docCard.getAttribute('data-doc-price');
      openBookingModal(docName, docHospital, docLocation, docPrice);
    }
    
    const medItem = e.target.closest('.medicine-item');
    if (medItem) {
      const medName = medItem.getAttribute('data-med-name');
      const medPrice = medItem.getAttribute('data-med-price');
      openOrderModal(medName, medPrice);
    }

    const bookmarkBtn = e.target.closest('.bookmark-btn');
    if (bookmarkBtn) {
      e.stopPropagation(); 
      const ailmentName = bookmarkBtn.getAttribute('data-ailment');
      if(bookmarkedAilments.has(ailmentName)) {
        bookmarkedAilments.delete(ailmentName);
        bookmarkBtn.classList.replace('text-amber-400', 'text-white/40');
      } else {
        bookmarkedAilments.add(ailmentName);
        bookmarkBtn.classList.replace('text-white/40', 'text-amber-400');
      }
    }
  });

  // --- FILTERS LOGIC ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-white/10', 'text-white');
        b.classList.add('text-white/50');
      });
      const target = e.currentTarget;
      target.classList.remove('text-white/50');
      target.classList.add('active', 'bg-white/10', 'text-white');
      
      currentFilter = target.getAttribute('data-cat');
      
      if (isAzMode) {
        renderAZDirectory();
      } else {
        renderFilteredList();
      }
    });
  });

  // --- RENDERING HELPERS ---
  function buildSummaryCard(item) {
    const meta = CATEGORY_META[item.category] || CATEGORY_META.minor;
    const isBookmarked = bookmarkedAilments.has(item.name);
    const card = document.createElement('div');
    card.className = "summary-card liquid-glass group relative";

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-2">
            <h3 class="text-2xl sm:text-3xl font-instrument text-white tracking-tight leading-tight mb-2">${escapeHtml(item.name)}</h3>
          </div>
          <div class="flex items-center gap-2">
            <button class="bookmark-btn p-1.5 rounded-full hover:bg-white/10 transition-colors ${isBookmarked ? 'text-amber-400' : 'text-white/40'}" data-ailment="${escapeHtml(item.name)}" title="Bookmark">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
            <span class="stamp tone-${meta.tone} text-[0.6rem] shrink-0">${meta.short}</span>
          </div>
        </div>
        <p class="text-white/60 text-sm font-light line-clamp-3">${escapeHtml(item.overview)}</p>
      </div>
      <div class="mt-4 pt-4 border-t border-white/10 text-xs font-mono text-white/70 font-semibold group-hover:text-white transition-colors flex justify-between items-center">
        Read Full Entry <span class="text-lg">→</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      isAzMode = false;
      azDirectory.classList.add('hidden', 'opacity-0');
      resultsRegion.classList.remove('hidden');
      chipsBox.style.display = 'flex';
      guideSection.style.display = 'block';
      
      resultsRegion.innerHTML = "";
      resultsRegion.appendChild(buildCard(item));
      window.scrollTo({ top: window.innerHeight - 50, behavior: 'smooth' });
    });
    
    return card;
  }

  function renderFilteredList() {
    if(!resultsRegion || typeof AILMENTS === 'undefined') return;
    resultsRegion.innerHTML = "";
    guideSection.style.display = 'none'; 
    
    let items = AILMENTS;
    if (currentFilter !== 'all') {
      if (currentFilter === 'emergency') {
        items = items.filter(i => i.category === 'emergency' || i.category === 'crisis');
      } else {
        items = items.filter(i => i.category === currentFilter);
      }
    }

    if (items.length === 0) {
      resultsRegion.innerHTML = `<p class="text-white/40 text-center py-10 font-mono text-sm">No ledger entries found for this category.</p>`;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6';
    items.forEach(item => grid.appendChild(buildSummaryCard(item)));
    resultsRegion.appendChild(grid);
  }

  // --- A-Z DIRECTORY WITH STICKY ALPHABET JUMP BAR ---
  function renderAZDirectory() {
    if(!azDirectory || typeof AILMENTS === 'undefined') return;
    azDirectory.innerHTML = "";
    
    let items = AILMENTS;
    if (currentFilter !== 'all') {
      if (currentFilter === 'emergency') {
        items = items.filter(i => i.category === 'emergency' || i.category === 'crisis');
      } else {
        items = items.filter(i => i.category === currentFilter);
      }
    }

    if (items.length === 0) {
      azDirectory.innerHTML = `<p class="text-white/40 text-center py-10 font-mono text-sm">No entries match your filter.</p>`;
      return;
    }

    items.sort((a, b) => a.name.localeCompare(b.name));
    const grouped = items.reduce((acc, item) => {
      const letter = item.name.charAt(0).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(item);
      return acc;
    }, {});

    const sortedLetters = Object.keys(grouped).sort();

    const jumpNavContainer = document.createElement('div');
    jumpNavContainer.className = "sticky top-[90px] z-[45] w-full mb-10 flex justify-center px-4 pointer-events-none";

    const jumpNav = document.createElement('div');
    jumpNav.className = "liquid-glass bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto border border-white/10 overflow-x-auto max-w-full hide-scrollbar snap-x";
    
    sortedLetters.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = "w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white/60 hover:text-white hover:bg-blue-500 transition-colors snap-center";
      btn.textContent = letter;
      btn.addEventListener('click', () => {
        const targetSection = document.getElementById(`az-section-${letter}`);
        if (targetSection) {
          const yOffset = -160; 
          const y = targetSection.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      jumpNav.appendChild(btn);
    });
    
    jumpNavContainer.appendChild(jumpNav);
    azDirectory.appendChild(jumpNavContainer);

    for (const letter of sortedLetters) {
      const section = document.createElement('div');
      section.id = `az-section-${letter}`;
      section.className = "mb-16";
      
      const header = document.createElement('h2');
      header.className = "az-letter-header";
      header.textContent = letter;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5';
      
      grouped[letter].forEach(item => {
        grid.appendChild(buildSummaryCard(item));
      });
      
      section.appendChild(grid);
      azDirectory.appendChild(section);
    }
  }

  const navIndexLinks = document.querySelectorAll('.nav-index-link');
  navIndexLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu(false); 
      if (!isAzMode) {
        toggleAzBtn.click(); 
      } else {
        window.scrollTo({ top: azDirectory.offsetTop - 100, behavior: 'smooth' });
      }
    });
  });

  if (toggleAzBtn) {
    toggleAzBtn.addEventListener('click', () => {
      isAzMode = !isAzMode;
      if (isAzMode) {
        toggleAzBtn.innerHTML = `<span class="text-lg leading-none">✕</span> Close Dictionary`;
        toggleAzBtn.classList.add('bg-white/10', 'text-white');
        
        resultsRegion.classList.add('hidden');
        chipsBox.style.display = 'none';
        guideSection.style.display = 'none';
        
        azDirectory.classList.remove('hidden');
        setTimeout(() => azDirectory.classList.remove('opacity-0'), 50);
        
        renderAZDirectory();
        window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
      } else {
        toggleAzBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> <span>A-Z Dictionary</span>`;
        toggleAzBtn.classList.remove('bg-white/10', 'text-white');
        
        azDirectory.classList.add('opacity-0');
        setTimeout(() => {
          azDirectory.classList.add('hidden');
          resultsRegion.classList.remove('hidden');
          chipsBox.style.display = 'flex';
          guideSection.style.display = 'block';
          resultsRegion.innerHTML = ""; 
        }, 300);
      }
    });
  }

  function listBlock(title, items) {
    if (!items || !items.length) return "";
    return `<div class="mb-8">
      <h3 class="text-white/40 text-[0.75rem] uppercase tracking-[0.15em] mb-4 font-mono">${escapeHtml(title)}</h3>
      <ul class="ledger-list text-white/80 space-y-2">
        ${items.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
      </ul>
    </div>`;
  }

  function medicineBlock(items) {
    const meds = items && items.length ? items : [
      "Paracetamol 500mg", 
      "Ibuprofen", 
      "Consult a pharmacist before combining medications."
    ];
    return `
      <div class="mb-8 p-6 rounded-2xl liquid-glass">
        <h3 class="text-white/80 text-[0.75rem] uppercase tracking-[0.15em] mb-4 font-mono flex items-center justify-between">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Basic OTC Medicines
          </span>
          <span class="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded font-mono">⚡ Rapid Delivery in 14 mins</span>
        </h3>
        <ul class="text-white/70 space-y-2 list-none m-0 p-0">
          ${meds.map((s) => {
            if (s.toLowerCase().includes("consult") || s.toLowerCase().includes("doctor")) {
              return `<li class="text-white/40 text-sm italic mt-4">${escapeHtml(s)}</li>`;
            }
            const medPrice = getMockPrice(s, 20, 150); 
            return `
              <li class="medicine-item group flex flex-col sm:flex-row sm:items-center justify-between gap-2" data-med-name="${escapeHtml(s)}" data-med-price="${medPrice}">
                <div class="flex items-center gap-2">
                  <span class="text-blue-400">•</span>
                  <span>${escapeHtml(s)}</span>
                </div>
                <div class="flex items-center gap-2 ml-4 sm:ml-0">
                  <span class="text-[10px] uppercase text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded shrink-0">₹${medPrice}</span>
                  <span class="text-[10px] font-bold uppercase text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">Order ⚡</span>
                </div>
              </li>`;
          }).join("")}
        </ul>
      </div>
    `;
  }

  function doctorBlock(category, ailmentName) {
    if(category === "emergency" || category === "crisis") return "";
    
    const query = normalize(ailmentName);
    let doctors = [];

    if (query.includes("headache") || query.includes("migraine")) {
      doctors = [
        { name: "Dr. Sudhir Kumar", hospital: "Apollo Hospitals", location: "Jubilee Hills, Hyderabad", specialty: "Neurologist", rating: "4.9 (142 reviews)", exp: "16 Yrs Exp" },
        { name: "Dr. S. Dash", hospital: "KIMS Hospital", location: "Secunderabad, Hyderabad", specialty: "Neurology Specialist", rating: "4.8 (98 reviews)", exp: "12 Yrs Exp" }
      ];
    } else if (query.includes("uti") || query.includes("urinary")) {
      doctors = [
        { name: "Dr. P. V. Murthy", hospital: "Care Hospitals", location: "Banjara Hills, Hyderabad", specialty: "Urologist", rating: "4.9 (210 reviews)", exp: "20 Yrs Exp" },
        { name: "Dr. Rooma Sinha", hospital: "Apollo Health City", location: "Jubilee Hills, Hyderabad", specialty: "Gynecologist", rating: "4.8 (115 reviews)", exp: "14 Yrs Exp" }
      ];
    } else if (query.includes("heartburn") || query.includes("acid") || query.includes("stomach") || query.includes("ulcer")) {
      doctors = [
        { name: "Dr. Nageshwar Reddy", hospital: "AIG Hospitals", location: "Gachibowli, Hyderabad", specialty: "Gastroenterologist", rating: "5.0 (540 reviews)", exp: "28 Yrs Exp" },
        { name: "Dr. Santosh Enaganti", hospital: "KIMS Hospital", location: "Kondapur, Hyderabad", specialty: "Gastroenterologist", rating: "4.7 (88 reviews)", exp: "11 Yrs Exp" }
      ];
    } else if (query.includes("cold") || query.includes("allergy") || query.includes("allergies") || query.includes("sinus") || query.includes("cough")) {
      doctors = [
        { name: "Dr. V. V. Ramana", hospital: "Yashoda Hospitals", location: "Somajiguda, Hyderabad", specialty: "ENT Specialist", rating: "4.8 (160 reviews)", exp: "15 Yrs Exp" },
        { name: "Dr. Srinivas Kishore", hospital: "AIG Hospitals", location: "Gachibowli, Hyderabad", specialty: "ENT Surgeon", rating: "4.9 (94 reviews)", exp: "13 Yrs Exp" }
      ];
    } else {
      doctors = [
        { name: "Dr. Rajesh Kumar", hospital: "Apollo Health City", location: "Jubilee Hills, Hyderabad", specialty: "General Physician", rating: "4.9 (310 reviews)", exp: "18 Yrs Exp" },
        { name: "Dr. Sneha Reddy", hospital: "KIMS Hospital", location: "Secunderabad, Hyderabad", specialty: "Internal Medicine", rating: "4.8 (140 reviews)", exp: "10 Yrs Exp" }
      ];
    }

    let html = `
      <div class="mt-8 pt-8 border-t border-white/10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
          <h3 class="text-white/80 text-[0.75rem] uppercase tracking-[0.15em] font-mono flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Top Specialists Near You
          </h3>
          <span class="text-[0.65rem] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">📍 Hyderabad, Telangana</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    `;

    doctors.forEach(doc => {
      const avatarUrl = `https://i.pravatar.cc/150?u=${encodeURIComponent(doc.name)}`;
      const docPrice = getMockPrice(doc.name, 500, 1200);
      
      html += `
        <div class="doctor-card relative overflow-hidden group flex items-start gap-4 p-4" data-doc-name="${escapeHtml(doc.name)}" data-doc-hospital="${escapeHtml(doc.hospital)}" data-doc-location="${escapeHtml(doc.location)}" data-doc-price="₹${docPrice}">
          
          <div class="absolute -inset-2 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none"></div>
          
          <div class="relative shrink-0">
            <img src="${avatarUrl}" class="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-400 transition-colors shadow-lg" alt="${doc.name}" loading="lazy">
            <div class="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-[#121315]" title="Available Now">
               <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>

          <div class="flex flex-col gap-1 overflow-hidden w-full relative z-10">
            <div class="flex justify-between items-start w-full">
              <div class="flex flex-col overflow-hidden pr-2">
                <span class="font-bold text-white text-sm sm:text-base truncate">${doc.name}</span>
                <span class="text-xs text-blue-300 font-mono truncate">${doc.specialty} • <span class="text-white/60">${doc.exp}</span></span>
              </div>
              <span class="text-[11px] font-bold uppercase text-white/80 bg-white/10 border border-white/10 px-2 py-0.5 rounded shadow-sm shrink-0">₹${docPrice}</span>
            </div>

            <div class="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-0.5">
              <span>⭐ ${doc.rating}</span>
            </div>
            
            <div class="flex justify-between items-end mt-2 gap-2">
              <span class="text-white/60 text-xs flex items-center gap-1.5 truncate">
                <svg class="w-3.5 h-3.5 shrink-0 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span class="truncate">${doc.hospital} (${doc.location})</span>
              </span>
              <button class="text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded transition-colors shadow-md shadow-blue-500/20 shrink-0">Book</button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  // --- FULL CARD BUILDER ---
  function buildCard(item) {
    const meta = CATEGORY_META[item.category] || CATEGORY_META.minor;
    const isUrgent = item.category === "emergency" || item.category === "crisis";
    const isBookmarked = bookmarkedAilments.has(item.name);

    let body = `<p class="text-white/90 text-lg border-b border-white/10 pb-8 mb-8 leading-relaxed font-light">${escapeHtml(item.overview)}</p>`;

    if (isUrgent) {
      body += listBlock("What it can look like", item.symptoms);
      body += `
        <div class="liquid-glass border !border-[#d16a4f]/40 !bg-[#d16a4f]/10 rounded-2xl p-6 mt-6">
          <h3 class="text-[#d16a4f] text-[0.75rem] uppercase tracking-[0.15em] mb-3">What to do</h3>
          <p class="text-white/90 text-base leading-relaxed">${escapeHtml(item.action)}</p>
        </div>
      `;
    } else {
      body += listBlock("Common symptoms", item.symptoms);
      body += listBlock("General self-care", item.selfCare);
      body += medicineBlock(item.remedies);
      if (item.category !== "minor") {
        body += listBlock("How it's typically managed", item.management);
      }
      body += listBlock("Talk to a doctor if", item.seekCareIf);
      body += doctorBlock(item.category, item.name);
    }

    const card = document.createElement("article");
    card.className = `index-card liquid-glass relative overflow-hidden ${isUrgent ? 'border border-[#d16a4f]/50' : ''}`;
    
    card.innerHTML = `
      <div class="flex justify-between items-center mb-8 relative z-10">
        <span class="text-white/40 text-sm font-mono tracking-widest uppercase">No. ${item.id}</span>
        <div class="flex items-center gap-3">
          <button class="bookmark-btn flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full liquid-glass hover:bg-white/10 transition-colors ${isBookmarked ? 'text-amber-400 border-amber-400/40 bg-amber-400/10' : 'text-white/60'}" data-ailment="${escapeHtml(item.name)}">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            <span>${isBookmarked ? 'Bookmarked' : 'Bookmark Entry'}</span>
          </button>
          <span class="stamp tone-${meta.tone}">${meta.short}</span>
        </div>
      </div>
      <h2 class="font-instrument text-5xl md:text-6xl mb-8 text-white relative z-10">${escapeHtml(item.name)}</h2>
      <div class="relative z-10">${body}</div>
    `;
    
    return card;
  }

  // --- SEARCH LOGIC ---
  function searchAilments(query) {
    const q = normalize(query);
    if (!q) return [];
    if (typeof AILMENTS === 'undefined') return [];

    let itemsToSearch = AILMENTS;
    if (currentFilter !== 'all') {
      if (currentFilter === 'emergency') {
        itemsToSearch = itemsToSearch.filter(i => i.category === 'emergency' || i.category === 'crisis');
      } else {
        itemsToSearch = itemsToSearch.filter(i => i.category === currentFilter);
      }
    }

    const scored = itemsToSearch.map((item) => {
      let score = 0;
      const nameNorm = normalize(item.name);
      if (nameNorm === q) score = 100;
      else if (nameNorm.startsWith(q)) score = 80;
      else if (nameNorm.includes(q)) score = 60;

      for (const alias of item.aliases || []) {
        const a = normalize(alias);
        if (a === q) score = Math.max(score, 95);
        else if (a.startsWith(q)) score = Math.max(score, 75);
      }
      return { item, score };
    }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

    return scored.map((x) => x.item);
  }

  function renderSuggestions(items) {
    currentSuggestions = items;
    activeSuggestionIndex = -1;
    if(!suggestionsBox) return;
    
    suggestionsBox.innerHTML = "";
    if (!items.length) {
      suggestionsBox.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }

    items.slice(0, 6).forEach((item, i) => {
      const meta = CATEGORY_META[item.category] || CATEGORY_META.minor;
      const row = document.createElement("li");
      row.className = "suggestion text-sm text-white/90";
      row.id = "suggestion-" + i;
      row.setAttribute("role", "option");
      row.innerHTML = `
        <span class="suggestion-name">${escapeHtml(item.name)}</span>
        <span class="stamp tone-${meta.tone} scale-[0.8] origin-right">${meta.short}</span>
      `;
      row.addEventListener("mousedown", (e) => {
        e.preventDefault();
        selectAilment(item);
      });
      suggestionsBox.appendChild(row);
    });

    suggestionsBox.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");
  }

  function moveActiveSuggestion(delta) {
    if (!currentSuggestions.length) return;
    const max = Math.min(currentSuggestions.length, 6) - 1;
    activeSuggestionIndex = Math.min(max, Math.max(-1, activeSuggestionIndex + delta));
    [...suggestionsBox.children].forEach((el, i) => {
      el.classList.toggle("is-active", i === activeSuggestionIndex);
    });
  }

  function selectAilment(item) {
    if(searchInput) searchInput.value = item.name;
    renderSuggestions([]);
    
    isAzMode = false;
    azDirectory.classList.add('hidden', 'opacity-0');
    resultsRegion.classList.remove('hidden');
    chipsBox.style.display = 'flex';
    guideSection.style.display = 'block';
    
    if(!resultsRegion) return;
    resultsRegion.innerHTML = "";
    resultsRegion.appendChild(buildCard(item));
    window.scrollTo({ top: window.innerHeight - 50, behavior: 'smooth' });
  }

  function runSearch(query) {
    const matches = searchAilments(query);
    renderSuggestions([]);
    
    isAzMode = false;
    azDirectory.classList.add('hidden', 'opacity-0');
    resultsRegion.classList.remove('hidden');
    chipsBox.style.display = 'flex';
    
    if(!resultsRegion) return;
    resultsRegion.innerHTML = "";
    
    if (matches.length === 1) {
      guideSection.style.display = 'block';
      resultsRegion.appendChild(buildCard(matches[0]));
      window.scrollTo({ top: window.innerHeight - 50, behavior: 'smooth' });
    } else if (matches.length > 1) {
      guideSection.style.display = 'none'; 
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6';
      matches.forEach(item => grid.appendChild(buildSummaryCard(item)));
      resultsRegion.appendChild(grid);
      window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
    } else {
      guideSection.style.display = 'block';
      resultsRegion.innerHTML = `<p class="text-white/40 text-center py-10 font-mono text-sm">No results found for "${escapeHtml(query)}".</p>`;
      window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
    }
  }

  if(searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value;
      if (!q.trim()) {
        renderSuggestions([]);
        return;
      }
      renderSuggestions(searchAilments(q));
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActiveSuggestion(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActiveSuggestion(-1);
      } else if (e.key === "Escape") {
        renderSuggestions([]);
      } else if (e.key === "Enter") {
        if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
          e.preventDefault();
          selectAilment(currentSuggestions[activeSuggestionIndex]);
        }
      }
    });
  }

  if(searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runSearch(searchInput.value);
    });
  }

  document.addEventListener("click", (e) => {
    if (suggestionsBox && searchInput && !suggestionsBox.contains(e.target) && e.target !== searchInput) {
      renderSuggestions([]);
    }
  });

  function renderChips() {
    if(!chipsBox) return;
    chipsBox.innerHTML = "";
    QUICK_TERMS.forEach((term) => {
      const btn = document.createElement("button");
      btn.className = "chip liquid-glass px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-colors";
      btn.textContent = term;
      btn.addEventListener("click", () => {
        searchInput.value = term;
        runSearch(term);
      });
      chipsBox.appendChild(btn);
    });
  }
  
  renderChips();
})();