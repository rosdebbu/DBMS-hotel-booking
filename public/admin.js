const API_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
    switchTab('dashboard');
    fetchDashboardStats();
});

function switchTab(tab) {
    // Hide all
    ['dashboard', 'reservations', 'guests'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).className = "block px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all font-semibold";
    });

    // Show active
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    document.getElementById(`nav-${tab}`).className = "block px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md transition-all";

    // Set Header titles and fetch data
    if (tab === 'dashboard') {
        document.getElementById('header-title').innerText = "System Overview";
        fetchDashboardStats();
    } else if (tab === 'reservations') {
        document.getElementById('header-title').innerText = "Reservations Manager [CRUD]";
        fetchReservations();
    } else if (tab === 'guests') {
        document.getElementById('header-title').innerText = "Guest Directory [CRUD]";
        fetchGuests();
    }
}

// ---------------------------
// FETCH FUNCTIONS
// ---------------------------

async function fetchDashboardStats() {
    try {
        const rRes = await fetch(`${API_URL}/rooms`);
        const rooms = await rRes.json();
        const bookedRooms = rooms.filter(r => r.availability_status === 'Booked').length;
        document.getElementById('dash-booked-count').innerText = bookedRooms;

        const gRes = await fetch(`${API_URL}/admin/guests`);
        const guests = await gRes.json();
        document.getElementById('dash-guest-count').innerText = guests.length;
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

async function fetchReservations() {
    try {
        const response = await fetch(`${API_URL}/admin/reservations`);
        const reservations = await response.json();
        const tbody = document.getElementById('admin-reservations-table');
        tbody.innerHTML = '';

        reservations.forEach(r => {
            const checkIn = new Date(r.check_in).toLocaleDateString();
            const checkOut = new Date(r.check_out).toLocaleDateString();
            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono text-slate-500 font-bold">#${r.booking_id}</td>
                    <td class="p-4 font-bold text-slate-800">${r.guest_name}</td>
                    <td class="p-4 text-primary font-bold">Room ${r.room_id} <span class="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded ml-1">${r.room_type}</span></td>
                    <td class="p-4 text-slate-600">${checkIn} → ${checkOut}</td>
                    <td class="p-4 font-bold text-green-700">₹${r.total_amount} <span class="text-xs text-slate-400 font-normal">(${r.payment_method || 'N/A'})</span></td>
                    <td class="p-4 text-right">
                        <button onclick="cancelBooking(${r.booking_id})" class="text-xs font-bold uppercase bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            Cancel Booking
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching admin reservations:", error);
    }
}

async function fetchGuests() {
    try {
        const response = await fetch(`${API_URL}/admin/guests`);
        const guests = await response.json();
        const tbody = document.getElementById('admin-guests-table');
        tbody.innerHTML = '';

        guests.forEach(g => {
            tbody.innerHTML += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono text-slate-500 font-bold">#${g.guest_id}</td>
                    <td class="p-4 font-bold text-slate-800">
                        ${g.name}
                        <div class="text-xs text-slate-400 font-normal mt-1">${g.address} • ID: ${g.id_proof}</div>
                    </td>
                    <td class="p-4 font-medium text-slate-600">
                        📞 ${g.phone}<br>
                        ✉️ ${g.email}
                    </td>
                    <td class="p-4 text-right">
                        <button onclick="deleteGuest(${g.guest_id})" class="text-xs font-bold uppercase bg-slate-800 text-white px-3 py-1 rounded hover:bg-red-600 transition-all shadow-sm">
                            Delete Profile
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching administrative guests:", error);
    }
}

// ---------------------------
// DELETE / CRUD ACTIONS
// ---------------------------

async function cancelBooking(bookingId) {
    if (!confirm(`Are you absolutely sure you want to completely CANCEL booking #${bookingId}? This will delete the financial record and free the room instantly.`)) return;

    try {
        const response = await fetch(`${API_URL}/admin/reservations/${bookingId}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ ${result.message}`);
            fetchReservations(); // Refresh the table
        } else {
            alert(`❌ Error: ${result.error}`);
        }
    } catch (e) {
        alert("Failed to hit API.");
    }
}

async function deleteGuest(guestId) {
    if (!confirm(`WARNING: Deleting Guest #${guestId} will permanently erase their profile. Proceed?`)) return;

    try {
        const response = await fetch(`${API_URL}/admin/guests/${guestId}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (response.ok) {
            alert(`✅ Profile Deleted successfully.`);
            fetchGuests();
        } else {
            alert(`⛔ Database Integrity Error:\n${result.error}`);
        }
    } catch (e) {
        alert("Failed to hit API.");
    }
}
