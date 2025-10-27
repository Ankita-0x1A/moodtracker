
// 1. GLOBAL STATE (The App's Memory)
// These variables store all the dynamic data for the application.

let totalXP = 0;
let moodCount = 0;
let journalCount = 0;
let habits = []; // Stores objects like { id, name, isCompleted, streak }
let completedHabitsToday = 0;
let currentSelectedMood = { name: 'Neutral', score: 3 };
const moodHistory = []; // Stores objects for the mood history list
const journalEntries = []; // Stores objects for journal history



// 2. CORE UI UPDATE FUNCTIONS


// Function to update all the numbers on the Dashboard page
function updateDashboard() {
    // 1. Update XP and Level
    document.getElementById('total-xp').textContent = totalXP;
    document.getElementById('user-level').textContent = Math.floor(totalXP / 100) + 1;
    document.getElementById('xp-to-next').textContent = 100 - (totalXP % 100);

    // 2. Update Dashboard Stat Cards
    document.getElementById('mood-count-display').textContent = moodCount;
    document.getElementById('journal-count-display').textContent = journalCount;
    document.getElementById('habit-count-display').textContent = completedHabitsToday;
}

// Function to control which page/module is visible
function showPage(pageId, clickedButton) {
    // Hide all content modules
    document.querySelectorAll('.page-content').forEach(el => {
        el.classList.add('hidden');
    });
    // Show the selected module
    document.getElementById(pageId).classList.remove('hidden');

    // Update navigation button styles (active/inactive)
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    clickedButton.classList.add('bg-blue-600', 'text-white');
    clickedButton.classList.remove('bg-gray-200', 'text-gray-700');

    // Re-render the habit list when entering the habit page
    if (pageId === 'habit') {
        renderHabitList();
    }
}



// 3. MOOD TRACKER FUNCTIONS


// Called when an emoji button is clicked
function selectMood(name, score, clickedButton) {
    currentSelectedMood = { name, score };
    document.getElementById('selected-mood-name').textContent = name;
    
    // Highlight the selected emoji button
    document.querySelectorAll('.mood-emoji').forEach(btn => {
        btn.classList.remove('bg-blue-200', 'ring-4', 'ring-blue-500');
        btn.classList.add('bg-gray-100');
    });
    clickedButton.classList.add('bg-blue-200', 'ring-4', 'ring-blue-500');
    clickedButton.classList.remove('bg-gray-100');
}

// Called when the "Log Mood" button is clicked
function logMood() {
    // 1. Update State (Variables)
    totalXP += 5; // Award 5 XP
    moodCount += 1; // Increment log count

    // 2. Add to History
    const logEntry = {
        mood: currentSelectedMood.name,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        // Find the emoji that is currently highlighted
        emoji: document.querySelector('#mood-selector .bg-blue-200').textContent.trim()
    };
    moodHistory.push(logEntry);

    // 3. Update UI
    updateDashboard();
    renderMoodHistory();
    alert(`Logged mood: ${currentSelectedMood.name}! Earned 5 XP.`);
}

// Renders the list of mood logs
function renderMoodHistory() {
    const container = document.getElementById('mood-history-list');
    if (moodHistory.length === 0) return;

    container.innerHTML = moodHistory.map(m => `
        <div class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-blue-50">
            <span class="text-2xl">${m.emoji}</span>
            <div class="flex-grow ml-4">
                <p class="font-semibold text-gray-800">${m.mood}</p>
            </div>
            <span class="text-sm text-gray-500">${m.date} at ${m.time}</span>
        </div>
    `).reverse().join(''); // Reverse to show latest first
}


// 4. HABIT TRACKER FUNCTIONS

// Called when "Add Habit" is clicked
function addHabit() {
    const nameInput = document.getElementById('new-habit-name');
    const name = nameInput.value.trim();
    if (!name) return;

    // Add a new habit object to the 'habits' array
    habits.push({ id: Date.now().toString(), name: name, isCompleted: false, streak: 0 });
    nameInput.value = '';
    renderHabitList();
}

// Called when the + / ✅ button next to a habit is clicked
function toggleHabitCompletion(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || habit.isCompleted) return; // Exit if already completed

    // 1. Update State
    habit.isCompleted = true; // Mark as completed
    habit.streak += 1; // Increase streak
    totalXP += 50; // Award 50 XP
    completedHabitsToday += 1; // Update dashboard counter

    // 2. Update UI
    updateDashboard();
    renderHabitList(); // Re-render to show the checkmark
    alert(`Great job on ${habit.name}! Earned 50 XP. Streak: ${habit.streak}`);
}

// Called when "Delete" is clicked
function deleteHabit(id) {
    // Remove habit from the array
    habits = habits.filter(h => h.id !== id);
    // Update UI
    renderHabitList();
    updateDashboard();
}

// Renders the list of habits from the 'habits' array
function renderHabitList() {
    const container = document.getElementById('habit-list-container');
    if (habits.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic text-center py-4">Add your first habit!</p>';
        return;
    }

    container.innerHTML = habits.map(h => {
        const btnClasses = h.isCompleted 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-green-100';
        const checkmark = h.isCompleted ? `✅` : `➕`;

        return `
            <div class="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-green-50">
                <div class="flex items-center space-x-3 flex-grow min-w-0">
                    <button
                        onclick="toggleHabitCompletion('${h.id}')"
                        class="w-8 h-8 rounded-full border-2 transition-colors flex items-center justify-center font-bold text-lg ${btnClasses}"
                        ${h.isCompleted ? 'disabled' : ''}
                    >
                        ${checkmark}
                    </button>
                    <span class="font-medium text-gray-700 truncate ${h.isCompleted ? 'line-through text-gray-500' : ''}">${h.name}</span>
                </div>
                <div class="flex items-center space-x-3 flex-shrink-0">
                    <span class="text-sm font-bold text-green-600">🔥 ${h.streak} day streak</span>
                    <button onclick="deleteHabit('${h.id}')" class="text-xs text-red-500 hover:text-red-700 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 5. JOURNAL FUNCTIONS

// Called when the "Save Entry" button is clicked
function saveJournal() {
    const title = document.getElementById('journal-title').value.trim();
    const content = document.getElementById('journal-content').value.trim();
    
    if (!title && !content) return;

    // 1. Update State
    journalCount += 1; // Increment entry count
    totalXP += 10; // Award 10 XP
    
    // 2. Save Entry to array
    journalEntries.push({
        title: title || "(No Title)",
        content: content,
        date: new Date().toLocaleDateString()
    });

    // 3. Clear Form and Update UI
    document.getElementById('journal-title').value = '';
    document.getElementById('journal-content').value = '';
    updateDashboard();
    renderJournalHistory();
    alert("Journal entry saved! Earned 10 XP.");
}

// Renders the list of journal entries
function renderJournalHistory() {
    const container = document.getElementById('journal-history-list');
    if (journalEntries.length === 0) return;

    container.innerHTML = journalEntries.map(e => `
        <div class="p-3 bg-white rounded-xl shadow-sm border border-purple-50">
            <div class="flex justify-between items-start">
                <p class="font-semibold text-gray-800 truncate">${e.title}</p>
                <span class="text-xs text-gray-500 flex-shrink-0 ml-2">${e.date}</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 mt-1 mb-2">${e.content}</p>
        </div>
    `).reverse().join(''); // Reverse to show latest first
}