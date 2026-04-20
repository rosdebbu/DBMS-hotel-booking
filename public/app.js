const API_URL = 'http://localhost:3000/api';
let selectedRoomPrice = 0;
let selectedRoomId = null;

// Room Images map based on type
const roomImages = {
    'Standard': 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
    'Deluxe': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'Suite': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'
};

const roomFeatures = {
    'Standard': ['Free WiFi', 'AC', 'TV'],
    'Deluxe': ['Free WiFi', 'AC', 'TV', 'City View', 'Breakfast Included'],
    'Suite': ['Free WiFi', 'AC', 'TV', 'Ocean View', 'Breakfast Included', 'Mini Bar', 'Bathtub']
};

document.addEventListener("DOMContentLoaded", () => {
    fetchRooms();
});

function switchView(viewId) {
    document.getElementById('rooms-view').classList.add('hidden');
    document.getElementById('guests-view').classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
}

async function fetchRooms() {
    switchView('rooms-view');
    try {
        const response = await fetch(`${API_URL}/rooms`);
        const rooms = await response.json();
        const grid = document.getElementById('rooms-grid');
        grid.innerHTML = '';

        rooms.forEach((room) => {
            const isAvailable = room.availability_status === 'Available';
            const imageUrl = roomImages[room.room_type] || roomImages['Standard'];
            const features = roomFeatures[room.room_type] || roomFeatures['Standard'];
            
            // Tailwind feature tags
            let featureHTML = features.map(f => `<span class="bg-blue-50 text-primary text-[11px] font-bold px-2 py-1 rounded-md">✓ ${f}</span>`).join('');
            
            // Tailwind Availability Tag
            let statusBadge = isAvailable
                ? `<div class="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-md text-xs font-bold shadow-sm">✔ Available</div>`
                : `<div class="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-md text-xs font-bold shadow-sm">❌ Sold Out</div>`;

            // Card Builder
            grid.innerHTML += `
                <div class="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                    <div class="w-full md:w-2/5 h-64 md:h-auto bg-cover bg-center overflow-hidden object-cover group-hover:scale-[1.03] transition-transform duration-500" style="background-image: url('${imageUrl}')"></div>
                    
                    <div class="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">${room.room_type} Room</h3>
                                    <p class="text-gray-500 text-sm mt-1">EaseMyStay Prime Properties • Room ${room.room_id}</p>
                                </div>
                                ${statusBadge}
                            </div>
                            
                            <div class="flex flex-wrap gap-2 mt-4 mb-6">
                                ${featureHTML}
                            </div>
                        </div>
                        
                        <div class="flex justify-between items-end pt-5 border-t border-dashed border-gray-300 mt-auto">
                            <div>
                                <div class="text-3xl font-bold text-gray-900 leading-none mb-1">₹${room.price_per_night} <span class="text-sm font-normal text-gray-500">/ night</span></div>
                                <div class="text-xs font-bold text-green-600">+ Free Cancellation</div>
                            </div>
                            <button class="${isAvailable ? 'bg-primary hover:bg-primaryDark text-white shadow-md hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-8 py-3 rounded-full font-bold transition-all" ${!isAvailable ? 'disabled' : ''} 
                                onclick="openModal(${room.room_id}, ${room.price_per_night})">
                                ${isAvailable ? 'Book Now' : 'Sold Out'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        alert("Failed to connect to the database API!");
    }
}

async function fetchReservations() {
    switchView('guests-view');
    try {
        const response = await fetch(`${API_URL}/reservations`);
        const reservations = await response.json();
        const tbody = document.getElementById('reservations-body');
        tbody.innerHTML = '';

        reservations.forEach(r => {
            const checkIn = new Date(r.check_in).toLocaleDateString();
            const checkOut = new Date(r.check_out).toLocaleDateString();
            tbody.innerHTML += `
                <tr class="hover:bg-gray-50 transition-colors group border-b border-gray-100 last:border-none">
                    <td class="p-4 font-semibold text-gray-800">${r.name}</td>
                    <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ${r.room_type}
                        </span>
                    </td>
                    <td class="p-4 text-gray-600">${checkIn}</td>
                    <td class="p-4 text-gray-600">${checkOut}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
    }
}

function openModal(roomId, price) {
    selectedRoomId = roomId;
    selectedRoomPrice = price;
    document.getElementById('modal-room-id').innerText = `${roomId}`;
    document.getElementById('modal-room-price').innerText = `₹${price} / night`;
    document.getElementById('booking-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('booking-modal').classList.remove('active');
    document.getElementById('booking-form').reset();
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        id_proof: document.getElementById('id_proof').value,
        check_in: document.getElementById('check_in').value,
        check_out: document.getElementById('check_out').value,
        payment_method: document.getElementById('payment_method').value,
        room_id: selectedRoomId,
        price_per_night: selectedRoomPrice
    };

    try {
        const btn = e.target.querySelector('button[type="submit"]');
        const oldText = btn.innerText;
        btn.innerText = "Processing Payment...";
        btn.disabled = true;

        const response = await fetch(`${API_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (response.ok) {
            alert(`🎉 Booking Confirmed! Payment Processed.\nReservation ID: ${result.booking_id}`);
            closeModal();
            fetchRooms(); // refresh view
        } else {
            alert(`❌ Database Error: ${result.error}`);
        }

        btn.innerText = oldText;
        btn.disabled = false;
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit booking!");
    }
});

function filterBookings() {
    const input = document.getElementById("booking-search").value.toLowerCase();
    const rows = document.querySelectorAll("#reservations-body tr");
    
    rows.forEach(row => {
        const guestName = row.cells[0].innerText.toLowerCase();
        if (guestName.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
