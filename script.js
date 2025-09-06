// This event listener ensures that the script runs only after the entire HTML page has been loaded.
document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // --- 1. GLOBAL LOGIC (Runs on EVERY page) ---
    // ===================================================================
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    // --- Toast Notification Function ---
    function showToast(message, isSuccess = true) {
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');

        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    // --- Settings Modal Logic ---
    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });

        const closeModal = () => {
            modalContainer.classList.add('hidden');
        };

        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }


    // ===================================================================
    // --- 2. HOME PAGE LOGIC (index.html) ---
    // ===================================================================
    if (document.getElementById('scenes-module')) {
        const sceneButtons = document.querySelectorAll('.scene-btn');
        sceneButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                const sceneIconHTML = button.querySelector('svg').outerHTML;

                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `
                    <div class="flex flex-col items-center text-center">
                        ${sceneIconHTML}
                        <p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p>
                        <div class="mt-6 flex justify-center gap-4">
                            <button onclick="document.getElementById('modal-container').classList.add('hidden')" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                            <button onclick="alert('Activating ${sceneName}!')" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button>
                        </div>
                    </div>
                `;
                
                modalContainer.classList.remove('hidden');
            });
        });
        
        // Default voice button behavior for the home page
        voiceBtn.addEventListener('click', () => {
            showToast("Voice commands are active on the recipe page!");
        });
    }


    // ===================================================================
    // --- 3. RECIPE PAGE LOGIC (recipe.html) ---
    // ===================================================================
    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form');
        const ingredientsInput = document.getElementById('ingredients-input');
        const generateBtn = document.getElementById('generate-btn');
        const surpriseBtn = document.getElementById('surprise-btn');
        const contentContainer = document.getElementById('content-container');
        const errorMessage = document.getElementById('error-message');

        recipeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (ingredientsInput.value.trim() === '') {
                errorMessage.textContent = 'Please enter at least one ingredient.';
                return;
            }
            errorMessage.textContent = '';
            
            generateBtn.querySelector('#btn-text').classList.add('hidden');
            generateBtn.querySelector('#btn-spinner').classList.remove('hidden');
            generateBtn.disabled = true;

            setTimeout(() => {
                const ingredients = ingredientsInput.value;
                contentContainer.innerHTML = `<div class="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 animate-fade-in"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious ${ingredients.split(',')[0]} Dish!</h3><p class="text-gray-300 mb-4">Here is a delicious recipe based on your ingredients: <strong>${ingredients}</strong>.</p><ol class="list-decimal list-inside space-y-2 text-gray-400"><li>Preheat your oven and prepare your ingredients.</li><li>Combine the wet and dry ingredients in a large bowl.</li><li>Cook for 20-25 minutes or until golden brown.</li><li>Serve hot and enjoy the vibe!</li></ol></div>`;
                
                generateBtn.querySelector('#btn-text').classList.remove('hidden');
                generateBtn.querySelector('#btn-spinner').classList.add('hidden');
                generateBtn.disabled = false;
            }, 2000);
        });
        
        surpriseBtn.addEventListener('click', () => {
            const surpriseIngredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum', 'Paneer, cream, spices', 'Potato, peas, carrots'];
            const randomIndex = Math.floor(Math.random() * surpriseIngredients.length);
            ingredientsInput.value = surpriseIngredients[randomIndex];
            showToast('Ingredients surprised!');
        });
        
        // --- VOICE RECOGNITION FOR RECIPE PAGE ---
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN'; // Set language to English (India)
            recognition.interimResults = false;

            voiceBtn.addEventListener('click', () => {
                voiceBtn.classList.add('mic-listening');
                showToast("Listening for ingredients...");
                recognition.start();
            });

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                ingredientsInput.value = transcript.replace(/\.$/, ''); // Remove trailing period
                showToast(`Genie heard: ${transcript}`);
                generateBtn.click(); // Automatically submit the form
            };

            recognition.onerror = (event) => {
                showToast(`Error: ${event.error}. Please try again.`, false);
            };
            
            recognition.onend = () => {
                voiceBtn.classList.remove('mic-listening');
            };

        } else {
            voiceBtn.addEventListener('click', () => {
                showToast("Sorry, your browser doesn't support voice commands.", false);
            });
        }
    }


    // ===================================================================
    // --- 4. CHAI TIME PAGE LOGIC (chai-time.html) ---
    // ===================================================================
    if (document.getElementById('chai-module')) {
        const applyBtn = document.getElementById('apply-chai-settings');
        // ... (rest of chai-time logic) ...

        voiceBtn.addEventListener('click', () => {
            showToast("Voice commands for Chai Time are coming soon!");
        });
    }


    // ===================================================================
    // --- 5. EXPENSE TRACKER PAGE LOGIC (expenses.html) ---
    // ===================================================================
    if (document.getElementById('expense-tracker-module')) {
        const expenseForm = document.getElementById('expense-form');
        // ... (rest of expenses logic) ...
        
        voiceBtn.addEventListener('click', () => {
            showToast("Voice commands for the Expense Tracker are coming soon!");
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // --- 1. GLOBAL LOGIC (Runs on EVERY page) ---
    // ===================================================================
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');

        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });

        const closeModal = () => {
            modalContainer.classList.add('hidden');
        };

        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }


    // ===================================================================
    // --- 2. HOME PAGE LOGIC (index.html) ---
    // ===================================================================
    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        
        function activateScene(sceneName) {
            // 1. Remove any old scene classes from the body
            document.body.classList.remove(...sceneClasses);
            
            // 2. Add the new class based on the scene name
            switch (sceneName) {
                case 'Relaxation':
                    document.body.classList.add('bg-scene-relaxation');
                    break;
                case 'Focus Mode':
                    document.body.classList.add('bg-scene-focus');
                    break;
                case 'Romance':
                    document.body.classList.add('bg-scene-romance');
                    break;
                case 'Party Mode':
                    document.body.classList.add('bg-scene-party');
                    break;
            }

            // 3. Close the modal and show a confirmation toast
            modalContainer.classList.add('hidden');
            showToast(`${sceneName} scene activated!`);
        }

        const sceneButtons = document.querySelectorAll('.scene-btn');
        sceneButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                const sceneIconHTML = button.querySelector('svg').outerHTML;

                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `
                    <div class="flex flex-col items-center text-center">
                        ${sceneIconHTML}
                        <p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p>
                        <div class="mt-6 flex justify-center gap-4">
                            <button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                            <button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button>
                        </div>
                    </div>
                `;
                
                modalContainer.classList.remove('hidden');

                // Add event listeners to the new buttons inside the modal
                document.getElementById('activate-scene-btn').addEventListener('click', () => {
                    activateScene(sceneName);
                });
                document.getElementById('cancel-scene-btn').addEventListener('click', () => {
                    modalContainer.classList.add('hidden');
                });
            });
        });
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                showToast("Voice commands are active on the recipe page!");
            });
        }
    }
    // ===================================================================
    // --- 2. HOME PAGE LOGIC (index.html) ---
    // ===================================================================
    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        const heartContainer = document.getElementById('heart-container');
        let heartInterval; // To store the interval for clearing later

        // --- Heart Animation Functions ---
        function createHeart() {
            if (!heartContainer) return;
            const heart = document.createElement('span');
            heart.classList.add('floating-heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 5 + 5) + 's'; // 5-10s duration

            heartContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 10000); // Remove after 10 seconds
        }

        function startHeartAnimation() {
            clearInterval(heartInterval);
            heartInterval = setInterval(createHeart, 400); 
        }

        function stopHeartAnimation() {
            clearInterval(heartInterval);
            if (heartContainer) {
                heartContainer.innerHTML = ''; 
            }
        }

        function activateScene(sceneName) {
            document.body.classList.remove(...sceneClasses);
            stopHeartAnimation(); 

            switch (sceneName) {
                case 'Relaxation':
                    document.body.classList.add('bg-scene-relaxation');
                    break;
                case 'Focus Mode':
                    document.body.classList.add('bg-scene-focus');
                    break;
                case 'Romance':
                    document.body.classList.add('bg-scene-romance');
                    startHeartAnimation();
                    break;
                case 'Party Mode':
                    document.body.classList.add('bg-scene-party');
                    break;
            }

            modalContainer.classList.add('hidden');
            showToast(`${sceneName} scene activated!`);
        }

        const sceneButtons = document.querySelectorAll('.scene-btn');
        sceneButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                const sceneIconHTML = button.querySelector('svg').outerHTML;

                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `
                    <div class="flex flex-col items-center text-center">
                        ${sceneIconHTML}
                        <p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p>
                        <div class="mt-6 flex justify-center gap-4">
                            <button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                            <button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button>
                        </div>
                    </div>
                `;
                
                modalContainer.classList.remove('hidden');

                document.getElementById('activate-scene-btn').addEventListener('click', () => {
                    activateScene(sceneName);
                });
                document.getElementById('cancel-scene-btn').addEventListener('click', () => {
                    modalContainer.classList.add('hidden');
                });
            });
        });
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                showToast("Voice commands are active on the recipe page!");
            });
        }
    }


    // ===================================================================
    // --- 3. RECIPE PAGE LOGIC (recipe.html) ---
    // ===================================================================
    if (document.getElementById('recipe-module')) {
        // ... (All recipe logic remains the same) ...
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            // ... (All voice recognition logic remains the same) ...
        }
    }


    // ===================================================================
    // --- 4. CHAI TIME PAGE LOGIC (chai-time.html) ---
    // ===================================================================
    if (document.getElementById('chai-module') && voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            showToast("Voice commands for Chai Time are coming soon!");
        });
    }


    // ===================================================================
    // --- 5. EXPENSE TRACKER PAGE LOGIC (expenses.html) ---
    // ===================================================================
    if (document.getElementById('expense-tracker-module') && voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            showToast("Voice commands for the Expense Tracker are coming soon!");
        });
    }

    // Keep all other page logic (recipe, chai, expenses) as it was...
    // The code for those sections is omitted here for brevity but is included in the full script above.
});

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // --- 1. GLOBAL LOGIC (Runs on EVERY page) ---
    // ===================================================================
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');

        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });

        const closeModal = () => {
            modalContainer.classList.add('hidden');
        };

        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }


    // ===================================================================
    // --- 2. HOME PAGE LOGIC (index.html) ---
    // ===================================================================
    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        const heartContainer = document.getElementById('heart-container');
        let heartInterval; // To store the interval for clearing later

        function createHeart() {
            if (!heartContainer) return;
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.innerHTML = '❤️';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
            heartContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 10000);
        }

        function startHeartAnimation() {
            clearInterval(heartInterval);
            heartInterval = setInterval(createHeart, 400); 
        }

        function stopHeartAnimation() {
            clearInterval(heartInterval);
            if (heartContainer) {
                heartContainer.innerHTML = ''; 
            }
        }

        function activateScene(sceneName) {
            document.body.classList.remove(...sceneClasses);
            stopHeartAnimation(); 

            switch (sceneName) {
                case 'Relaxation':
                    document.body.classList.add('bg-scene-relaxation');
                    break;
                case 'Focus Mode':
                    document.body.classList.add('bg-scene-focus');
                    break;
                case 'Romance':
                    document.body.classList.add('bg-scene-romance');
                    startHeartAnimation();
                    break;
                case 'Party Mode':
                    document.body.classList.add('bg-scene-party');
                    break;
            }

            modalContainer.classList.add('hidden');
            showToast(`${sceneName} scene activated!`);
        }

        const sceneButtons = document.querySelectorAll('.scene-btn');
        sceneButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                const sceneIconHTML = button.querySelector('svg').outerHTML;

                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `
                    <div class="flex flex-col items-center text-center">
                        ${sceneIconHTML}
                        <p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p>
                        <div class="mt-6 flex justify-center gap-4">
                            <button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                            <button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button>
                        </div>
                    </div>
                `;
                
                modalContainer.classList.remove('hidden');

                document.getElementById('activate-scene-btn').addEventListener('click', () => {
                    activateScene(sceneName);
                });
                document.getElementById('cancel-scene-btn').addEventListener('click', () => {
                    modalContainer.classList.add('hidden');
                });
            });
        });
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                showToast("Voice commands are active on the recipe page!");
            });
        }
    }


    // ===================================================================
    // --- 3. RECIPE PAGE LOGIC (recipe.html) ---
    // ===================================================================
    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form');
        const ingredientsInput = document.getElementById('ingredients-input');
        const generateBtn = document.getElementById('generate-btn');
        const surpriseBtn = document.getElementById('surprise-btn');
        const contentContainer = document.getElementById('content-container');
        const errorMessage = document.getElementById('error-message');

        recipeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (ingredientsInput.value.trim() === '') { errorMessage.textContent = 'Please enter at least one ingredient.'; return; }
            errorMessage.textContent = '';
            generateBtn.querySelector('#btn-text').classList.add('hidden');
            generateBtn.querySelector('#btn-spinner').classList.remove('hidden');
            generateBtn.disabled = true;
            setTimeout(() => {
                const ingredients = ingredientsInput.value;
                contentContainer.innerHTML = `<div class="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 animate-fade-in"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious ${ingredients.split(',')[0]} Dish!</h3><p class="text-gray-300 mb-4">A delicious recipe for: <strong>${ingredients}</strong>.</p><ol class="list-decimal list-inside space-y-2 text-gray-400"><li>Instruction one.</li><li>Instruction two.</li><li>Instruction three.</li></ol></div>`;
                generateBtn.querySelector('#btn-text').classList.remove('hidden');
                generateBtn.querySelector('#btn-spinner').classList.add('hidden');
                generateBtn.disabled = false;
            }, 2000);
        });
        
        surpriseBtn.addEventListener('click', () => {
            const surpriseIngredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum', 'Paneer, cream, spices'];
            ingredientsInput.value = surpriseIngredients[Math.floor(Math.random() * surpriseIngredients.length)];
            showToast('Ingredients surprised!');
        });
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            voiceBtn.addEventListener('click', () => { voiceBtn.classList.add('mic-listening'); showToast("Listening for ingredients..."); recognition.start(); });
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                ingredientsInput.value = transcript.replace(/\.$/, '');
                showToast(`Genie heard: ${transcript}`);
                generateBtn.click();
            };
            recognition.onerror = (event) => { showToast(`Error: ${event.error}. Please try again.`, false); };
            recognition.onend = () => { voiceBtn.classList.remove('mic-listening'); };
        } else {
            voiceBtn.addEventListener('click', () => { showToast("Sorry, your browser doesn't support voice commands.", false); });
        }
    }


    // ===================================================================
    // --- 4. CHAI TIME PAGE LOGIC (chai-time.html) ---
    // ===================================================================
    if (document.getElementById('chai-module') && voiceBtn) {
        voiceBtn.addEventListener('click', () => { showToast("Voice commands for Chai Time are coming soon!"); });
    }


    // ===================================================================
    // --- 5. EXPENSE TRACKER PAGE LOGIC (expenses.html) ---
    // ===================================================================
    if (document.getElementById('expense-tracker-module') && voiceBtn) {
        voiceBtn.addEventListener('click', () => { showToast("Voice commands for the Expense Tracker are coming soon!"); });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // --- Global Logic (remains the same) ---
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    // ... etc.

    // ===================================================================
    // --- HOME PAGE LOGIC (index.html) ---
    // ===================================================================
    if (document.getElementById('scenes-module')) {
        // ... All your existing home page logic ...
    }


    // ===================================================================
    // --- RECIPE PAGE LOGIC (recipe.html) ---
    // ===================================================================
    if (document.getElementById('recipe-module')) {
        // ... All your existing recipe page logic ...
    }


    // ===================================================================
    // --- CHAI TIME PAGE LOGIC (chai-time.html) --- UPDATED SECTION ---
    // ===================================================================
    if (document.getElementById('chai-module')) {
        const applyBtn = document.getElementById('apply-chai-settings');
        const musicSelect = document.getElementById('music-select');
        const volumeSlider = document.getElementById('volume-slider');
        const brightnessSlider = document.getElementById('brightness-slider');
        const warmLightsToggle = document.getElementById('warm-lights-toggle');
        
        const dimmerOverlay = document.getElementById('dimmer-overlay');
        const warmOverlay = document.getElementById('warm-overlay');
        
        let youtubePlayer;

        // Map of genres to YouTube Video IDs (Long instrumental mixes)
        const musicTracks = {
            lofi: 'jfKfPfyJRdk',
            classical: 'jgpJVI3tDbY',
            ambient: 'X__qK_5r4iE',
            bollywood: 'sFmrA_tA2d4'
        };

        // This global function is called by the YouTube API script when it's ready
        window.onYouTubeIframeAPIReady = function() {
            youtubePlayer = new YT.Player('youtube-player', {
                height: '1',
                width: '1',
                events: {
                    'onReady': onPlayerReady
                }
            });
        };

        function onPlayerReady(event) {
            // Player is ready. We can now control it.
            applyBtn.disabled = false; // Enable button once player is ready
            applyBtn.textContent = 'Apply Chai Time Settings';
        }
        
        // Disable button initially until player is ready
        applyBtn.disabled = true;
        applyBtn.textContent = 'Loading Music Player...';


        // --- Event Listeners for Controls ---

        applyBtn.addEventListener('click', () => {
            if (youtubePlayer && youtubePlayer.loadVideoById) {
                const selectedTrackID = musicTracks[musicSelect.value];
                youtubePlayer.loadVideoById(selectedTrackID);
                youtubePlayer.setVolume(volumeSlider.value);
                showToast(`Now playing: ${musicSelect.options[musicSelect.selectedIndex].text}`);
            }
        });

        warmLightsToggle.addEventListener('change', () => {
            if (warmLightsToggle.checked) {
                warmOverlay.style.opacity = '1';
                showToast("Warm lights on");
            } else {
                warmOverlay.style.opacity = '0';
                showToast("Warm lights off");
            }
        });

        brightnessSlider.addEventListener('input', () => {
            // Dim up to a max of 70% black overlay
            const dimLevel = (100 - brightnessSlider.value) / 100 * 0.7;
            dimmerOverlay.style.backgroundColor = `rgba(0, 0, 0, ${dimLevel})`;
        });

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                showToast("Voice commands for Chai Time are coming soon!");
            });
        }
    }


    // ===================================================================
    // --- EXPENSE TRACKER PAGE LOGIC (expenses.html) ---
    // ===================================================================
    if (document.getElementById('expense-tracker-module')) {
        // ... All your existing expense tracker logic ...
    }
    
    // Function to show toast notifications, assumed to be here
    function showToast(message, isSuccess = true) {
        const toastEl = document.getElementById('toast');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');
        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');
        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });
        const closeModal = () => modalContainer.classList.add('hidden');
        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }

    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        const heartContainer = document.getElementById('heart-container');
        let heartInterval;
        function createHeart() { if (!heartContainer) return; const heart = document.createElement('div'); heart.classList.add('floating-heart'); heart.innerHTML = '❤️'; heart.style.left = Math.random() * 100 + 'vw'; heart.style.animationDuration = (Math.random() * 5 + 5) + 's'; heartContainer.appendChild(heart); setTimeout(() => heart.remove(), 10000); }
        function startHeartAnimation() { clearInterval(heartInterval); heartInterval = setInterval(createHeart, 400); }
        function stopHeartAnimation() { clearInterval(heartInterval); if (heartContainer) heartContainer.innerHTML = ''; }
        function activateScene(sceneName) { document.body.classList.remove(...sceneClasses); stopHeartAnimation(); switch (sceneName) { case 'Relaxation': document.body.classList.add('bg-scene-relaxation'); break; case 'Focus Mode': document.body.classList.add('bg-scene-focus'); break; case 'Romance': document.body.classList.add('bg-scene-romance'); startHeartAnimation(); break; case 'Party Mode': document.body.classList.add('bg-scene-party'); break; } modalContainer.classList.add('hidden'); showToast(`${sceneName} scene activated!`); }
        document.querySelectorAll('.scene-btn').forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `<div class="flex flex-col items-center text-center">${button.querySelector('svg').outerHTML}<p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p><div class="mt-6 flex justify-center gap-4"><button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button><button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button></div></div>`;
                modalContainer.classList.remove('hidden');
                document.getElementById('activate-scene-btn').addEventListener('click', () => activateScene(sceneName));
                document.getElementById('cancel-scene-btn').addEventListener('click', () => modalContainer.classList.add('hidden'));
            });
        });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands are active on the recipe page!"));
    }

    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form'), ingredientsInput = document.getElementById('ingredients-input'), generateBtn = document.getElementById('generate-btn'), surpriseBtn = document.getElementById('surprise-btn'), contentContainer = document.getElementById('content-container'), errorMessage = document.getElementById('error-message');
        recipeForm.addEventListener('submit', e => { e.preventDefault(); if (ingredientsInput.value.trim() === '') { errorMessage.textContent = 'Please enter at least one ingredient.'; return; } errorMessage.textContent = ''; generateBtn.querySelector('#btn-text').classList.add('hidden'); generateBtn.querySelector('#btn-spinner').classList.remove('hidden'); generateBtn.disabled = true; setTimeout(() => { contentContainer.innerHTML = `<div class="bg-gray-800/50 p-6 rounded-2xl"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious Dish!</h3><p>A delicious recipe for: <strong>${ingredientsInput.value}</strong></p></div>`; generateBtn.querySelector('#btn-text').classList.remove('hidden'); generateBtn.querySelector('#btn-spinner').classList.add('hidden'); generateBtn.disabled = false; }, 2000); });
        surpriseBtn.addEventListener('click', () => { const ingredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum']; ingredientsInput.value = ingredients[Math.floor(Math.random() * ingredients.length)]; showToast('Ingredients surprised!'); });
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            voiceBtn.addEventListener('click', () => { voiceBtn.classList.add('mic-listening'); showToast("Listening for ingredients..."); recognition.start(); });
            recognition.onresult = event => { const transcript = event.results[0][0].transcript; ingredientsInput.value = transcript.replace(/\.$/, ''); showToast(`Genie heard: ${transcript}`); generateBtn.click(); };
            recognition.onerror = event => showToast(`Error: ${event.error}. Please try again.`, false);
            recognition.onend = () => voiceBtn.classList.remove('mic-listening');
        } else if (voiceBtn) { voiceBtn.addEventListener('click', () => showToast("Sorry, your browser doesn't support voice commands.", false)); }
    }

    if (document.getElementById('chai-module')) {
        const applyBtn = document.getElementById('apply-chai-settings'), musicSelect = document.getElementById('music-select'), volumeSlider = document.getElementById('volume-slider'), brightnessSlider = document.getElementById('brightness-slider'), warmLightsToggle = document.getElementById('warm-lights-toggle'), dimmerOverlay = document.getElementById('dimmer-overlay'), warmOverlay = document.getElementById('warm-overlay');
        let youtubePlayer;
        const musicTracks = { lofi: 'jfKfPfyJRdk', classical: 'jgpJVI3tDbY', ambient: 'X__qK_5r4iE', bollywood: 'sFmrA_tA2d4' };
        window.onYouTubeIframeAPIReady = function() { youtubePlayer = new YT.Player('youtube-player', { height: '1', width: '1', events: { 'onReady': () => { applyBtn.disabled = false; applyBtn.textContent = 'Apply Chai Time Settings'; } } }); };
        applyBtn.disabled = true; applyBtn.textContent = 'Loading Music Player...';
        applyBtn.addEventListener('click', () => { if (youtubePlayer && youtubePlayer.loadVideoById) { youtubePlayer.loadVideoById(musicTracks[musicSelect.value]); youtubePlayer.setVolume(volumeSlider.value); showToast(`Now playing: ${musicSelect.options[musicSelect.selectedIndex].text}`); } });
        warmLightsToggle.addEventListener('change', () => { warmOverlay.style.opacity = warmLightsToggle.checked ? '1' : '0'; showToast(warmLightsToggle.checked ? "Warm lights on" : "Warm lights off"); });
        brightnessSlider.addEventListener('input', () => { dimmerOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(100 - brightnessSlider.value) / 100 * 0.7})`; });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for Chai Time are coming soon!"));
    }

    if (document.getElementById('expense-tracker-module')) {
        // Your existing expense tracker logic would go here
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for the Expense Tracker are coming soon!"));
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');
        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });
        const closeModal = () => modalContainer.classList.add('hidden');
        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }

    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        const heartContainer = document.getElementById('heart-container');
        let heartInterval;
        function createHeart() { if (!heartContainer) return; const heart = document.createElement('div'); heart.classList.add('floating-heart'); heart.innerHTML = '❤️'; heart.style.left = Math.random() * 100 + 'vw'; heart.style.animationDuration = (Math.random() * 5 + 5) + 's'; heartContainer.appendChild(heart); setTimeout(() => heart.remove(), 10000); }
        function startHeartAnimation() { clearInterval(heartInterval); heartInterval = setInterval(createHeart, 400); }
        function stopHeartAnimation() { clearInterval(heartInterval); if (heartContainer) heartContainer.innerHTML = ''; }
        function activateScene(sceneName) { document.body.classList.remove(...sceneClasses); stopHeartAnimation(); switch (sceneName) { case 'Relaxation': document.body.classList.add('bg-scene-relaxation'); break; case 'Focus Mode': document.body.classList.add('bg-scene-focus'); break; case 'Romance': document.body.classList.add('bg-scene-romance'); startHeartAnimation(); break; case 'Party Mode': document.body.classList.add('bg-scene-party'); break; } modalContainer.classList.add('hidden'); showToast(`${sceneName} scene activated!`); }
        document.querySelectorAll('.scene-btn').forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `<div class="flex flex-col items-center text-center">${button.querySelector('svg').outerHTML}<p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p><div class="mt-6 flex justify-center gap-4"><button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button><button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button></div></div>`;
                modalContainer.classList.remove('hidden');
                document.getElementById('activate-scene-btn').addEventListener('click', () => activateScene(sceneName));
                document.getElementById('cancel-scene-btn').addEventListener('click', () => modalContainer.classList.add('hidden'));
            });
        });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands are active on the recipe page!"));
    }

    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form'), ingredientsInput = document.getElementById('ingredients-input'), generateBtn = document.getElementById('generate-btn'), surpriseBtn = document.getElementById('surprise-btn'), contentContainer = document.getElementById('content-container'), errorMessage = document.getElementById('error-message');
        recipeForm.addEventListener('submit', e => { e.preventDefault(); if (ingredientsInput.value.trim() === '') { errorMessage.textContent = 'Please enter at least one ingredient.'; return; } errorMessage.textContent = ''; generateBtn.querySelector('#btn-text').classList.add('hidden'); generateBtn.querySelector('#btn-spinner').classList.remove('hidden'); generateBtn.disabled = true; setTimeout(() => { contentContainer.innerHTML = `<div class="bg-gray-800/50 p-6 rounded-2xl"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious Dish!</h3><p>A delicious recipe for: <strong>${ingredientsInput.value}</strong></p></div>`; generateBtn.querySelector('#btn-text').classList.remove('hidden'); generateBtn.querySelector('#btn-spinner').classList.add('hidden'); generateBtn.disabled = false; }, 2000); });
        surpriseBtn.addEventListener('click', () => { const ingredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum']; ingredientsInput.value = ingredients[Math.floor(Math.random() * ingredients.length)]; showToast('Ingredients surprised!'); });
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            voiceBtn.addEventListener('click', () => { voiceBtn.classList.add('mic-listening'); showToast("Listening for ingredients..."); recognition.start(); });
            recognition.onresult = event => { const transcript = event.results[0][0].transcript; ingredientsInput.value = transcript.replace(/\.$/, ''); showToast(`Genie heard: ${transcript}`); generateBtn.click(); };
            recognition.onerror = event => showToast(`Error: ${event.error}. Please try again.`, false);
            recognition.onend = () => voiceBtn.classList.remove('mic-listening');
        } else if (voiceBtn) { voiceBtn.addEventListener('click', () => showToast("Sorry, your browser doesn't support voice commands.", false)); }
    }

    if (document.getElementById('chai-module')) {
        const applyBtn = document.getElementById('apply-chai-settings'), musicSelect = document.getElementById('music-select'), volumeSlider = document.getElementById('volume-slider'), brightnessSlider = document.getElementById('brightness-slider'), warmLightsToggle = document.getElementById('warm-lights-toggle'), dimmerOverlay = document.getElementById('dimmer-overlay'), warmOverlay = document.getElementById('warm-overlay');
        let youtubePlayer;
        const musicTracks = { lofi: 'jfKfPfyJRdk', classical: 'jgpJVI3tDbY', ambient: 'X__qK_5r4iE', bollywood: 'sFmrA_tA2d4' };
        window.onYouTubeIframeAPIReady = function() { youtubePlayer = new YT.Player('youtube-player', { height: '1', width: '1', events: { 'onReady': () => { applyBtn.disabled = false; applyBtn.textContent = 'Apply Chai Time Settings'; } } }); };
        if (applyBtn) {
            applyBtn.disabled = true; applyBtn.textContent = 'Loading Music Player...';
            applyBtn.addEventListener('click', () => { if (youtubePlayer && youtubePlayer.loadVideoById) { youtubePlayer.loadVideoById(musicTracks[musicSelect.value]); youtubePlayer.setVolume(volumeSlider.value); showToast(`Now playing: ${musicSelect.options[musicSelect.selectedIndex].text}`); } });
            warmLightsToggle.addEventListener('change', () => { warmOverlay.style.opacity = warmLightsToggle.checked ? '1' : '0'; showToast(warmLightsToggle.checked ? "Warm lights on" : "Warm lights off"); });
            brightnessSlider.addEventListener('input', () => { dimmerOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(100 - brightnessSlider.value) / 100 * 0.7})`; });
            if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for Chai Time are coming soon!"));
        }
    }

    if (document.getElementById('expense-tracker-module')) {
        const expenseForm = document.getElementById('expense-form');
        const descriptionInput = document.getElementById('expense-description');
        const amountInput = document.getElementById('expense-amount');
        const expenseList = document.getElementById('expense-list');
        const totalExpensesEl = document.getElementById('total-expenses');
        let expenses = [];

        function renderExpenses() {
            expenseList.innerHTML = '';
            let total = 0;
            expenses.forEach(expense => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'flex justify-between items-center bg-gray-700/50 p-3 rounded-lg mb-2 animate-fade-in';
                expenseItem.innerHTML = `<span class="text-gray-300">${expense.description}</span><span class="font-semibold text-white">₹${expense.amount.toFixed(2)}</span>`;
                expenseList.appendChild(expenseItem);
                total += expense.amount;
            });
            totalExpensesEl.textContent = total.toFixed(2);
        }

        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = descriptionInput.value;
            const amount = parseFloat(amountInput.value);
            if (description.trim() === '' || isNaN(amount) || amount <= 0) {
                showToast('Please enter a valid description and amount.', false);
                return;
            }
            expenses.push({ description, amount });
            renderExpenses();
            descriptionInput.value = '';
            amountInput.value = '';
            descriptionInput.focus();
            showToast('Expense added successfully!');
        });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for the Expense Tracker are coming soon!"));
    }
});
// ===================================================================
    // --- 3. RECIPE PAGE LOGIC (recipe.html) --- (REVISED AND FIXED)
    // ===================================================================
    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form');
        const ingredientsInput = document.getElementById('ingredients-input');
        const generateBtn = document.getElementById('generate-btn');
        const surpriseBtn = document.getElementById('surprise-btn');
        const contentContainer = document.getElementById('content-container');
        const errorMessage = document.getElementById('error-message');

        recipeForm.addEventListener('submit', e => { e.preventDefault(); if (ingredientsInput.value.trim() === '') { errorMessage.textContent = 'Please enter at least one ingredient.'; return; } errorMessage.textContent = ''; generateBtn.querySelector('#btn-text').classList.add('hidden'); generateBtn.querySelector('#btn-spinner').classList.remove('hidden'); generateBtn.disabled = true; setTimeout(() => { contentContainer.innerHTML = `<div class="bg-gray-800/50 p-6 rounded-2xl"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious Dish!</h3><p>A delicious recipe for: <strong>${ingredientsInput.value}</strong></p></div>`; generateBtn.querySelector('#btn-text').classList.remove('hidden'); generateBtn.querySelector('#btn-spinner').classList.add('hidden'); generateBtn.disabled = false; }, 2000); });
        surpriseBtn.addEventListener('click', () => { const ingredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum']; ingredientsInput.value = ingredients[Math.floor(Math.random() * ingredients.length)]; showToast('Ingredients surprised!'); });
        
        // --- NEW, MORE ROBUST VOICE RECOGNITION LOGIC ---
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            let isListening = false; // Flag to prevent errors

            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            // Handle Clicks on the Voice Button
            voiceBtn.addEventListener('click', () => {
                if (isListening) {
                    recognition.stop(); // Allow user to cancel listening
                    return;
                }
                recognition.start();
            });

            // When recognition starts
            recognition.onstart = () => {
                isListening = true;
                voiceBtn.classList.add('mic-listening');
                showToast("Listening for ingredients...");
            };

            // When speech is successfully recognized
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                ingredientsInput.value = transcript.replace(/\.$/, ''); // Remove trailing period
                showToast(`Genie heard: ${transcript}`);
                generateBtn.click(); // Automatically submit the form
            };
            
            // When an error occurs
            recognition.onerror = (event) => {
                let errorMessage = `Error: ${event.error}. Please try again.`;
                if (event.error === 'not-allowed') {
                    errorMessage = "Mic access denied. Please allow it in browser settings.";
                } else if (event.error === 'no-speech') {
                    errorMessage = "No speech was detected. Try again.";
                }
                showToast(errorMessage, false);
            };

            // When recognition ends (for any reason)
            recognition.onend = () => {
                isListening = false;
                voiceBtn.classList.remove('mic-listening');
            };

        } else if (voiceBtn) {
            // If browser doesn't support the API
            voiceBtn.addEventListener('click', () => showToast("Sorry, your browser doesn't support voice commands.", false)); 
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastEl = document.getElementById('toast');

    function showToast(message, isSuccess = true) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = toastEl.className.replace(/bg-green-500|bg-red-500/, '');
        toastEl.classList.add(isSuccess ? 'bg-green-500' : 'bg-red-500');
        toastEl.classList.remove('bottom-[-100px]');
        toastEl.classList.add('bottom-8');
        setTimeout(() => {
            toastEl.classList.remove('bottom-8');
            toastEl.classList.add('bottom-[-100px]');
        }, 3000);
    }

    if (settingsBtn && modalContainer && modalCloseBtn) {
        settingsBtn.addEventListener('click', () => {
            modalTitle.textContent = "Settings";
            modalBody.innerHTML = `<p>Welcome to your settings panel. More options coming soon!</p>`;
            modalContainer.classList.remove('hidden');
        });
        const closeModal = () => modalContainer.classList.add('hidden');
        modalCloseBtn.addEventListener('click', closeModal);
        modalContainer.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    }

    if (document.getElementById('scenes-module')) {
        const sceneClasses = ['bg-scene-relaxation', 'bg-scene-focus', 'bg-scene-romance', 'bg-scene-party'];
        const heartContainer = document.getElementById('heart-container');
        let heartInterval;
        function createHeart() { if (!heartContainer) return; const heart = document.createElement('div'); heart.classList.add('floating-heart'); heart.innerHTML = '❤️'; heart.style.left = Math.random() * 100 + 'vw'; heart.style.animationDuration = (Math.random() * 5 + 5) + 's'; heartContainer.appendChild(heart); setTimeout(() => heart.remove(), 10000); }
        function startHeartAnimation() { clearInterval(heartInterval); heartInterval = setInterval(createHeart, 400); }
        function stopHeartAnimation() { clearInterval(heartInterval); if (heartContainer) heartContainer.innerHTML = ''; }
        function activateScene(sceneName) { document.body.classList.remove(...sceneClasses); stopHeartAnimation(); switch (sceneName) { case 'Relaxation': document.body.classList.add('bg-scene-relaxation'); break; case 'Focus Mode': document.body.classList.add('bg-scene-focus'); break; case 'Romance': document.body.classList.add('bg-scene-romance'); startHeartAnimation(); break; case 'Party Mode': document.body.classList.add('bg-scene-party'); break; } modalContainer.classList.add('hidden'); showToast(`${sceneName} scene activated!`); }
        document.querySelectorAll('.scene-btn').forEach(button => {
            button.addEventListener('click', () => {
                const sceneName = button.querySelector('span').textContent;
                modalTitle.textContent = `${sceneName} Scene`;
                modalBody.innerHTML = `<div class="flex flex-col items-center text-center">${button.querySelector('svg').outerHTML}<p class="mt-4 text-lg text-gray-300">Are you sure you want to activate the ${sceneName} scene?</p><div class="mt-6 flex justify-center gap-4"><button id="cancel-scene-btn" class="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">Cancel</button><button id="activate-scene-btn" class="px-6 py-2 bg-pink-600 rounded-lg hover:bg-pink-500 transition">Activate</button></div></div>`;
                modalContainer.classList.remove('hidden');
                document.getElementById('activate-scene-btn').addEventListener('click', () => activateScene(sceneName));
                document.getElementById('cancel-scene-btn').addEventListener('click', () => modalContainer.classList.add('hidden'));
            });
        });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands are active on the recipe page!"));
    }

    if (document.getElementById('recipe-module')) {
        const recipeForm = document.getElementById('recipe-form');
        const ingredientsInput = document.getElementById('ingredients-input');
        const generateBtn = document.getElementById('generate-btn');
        const surpriseBtn = document.getElementById('surprise-btn');
        const contentContainer = document.getElementById('content-container');
        const errorMessage = document.getElementById('error-message');

        recipeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (ingredientsInput.value.trim() === '') {
                errorMessage.textContent = 'Please enter at least one ingredient.';
                return;
            }
            errorMessage.textContent = '';
            generateBtn.querySelector('#btn-text').classList.add('hidden');
            generateBtn.querySelector('#btn-spinner').classList.remove('hidden');
            generateBtn.disabled = true;
            setTimeout(() => {
                contentContainer.innerHTML = `<div class="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-lg p-6 animate-fade-in"><h3 class="text-2xl font-bold text-pink-400 mb-3">Vibe-a-licious Dish!</h3><p>Here is a delicious recipe for: <strong>${ingredientsInput.value}</strong>.</p><p class="mt-2 text-gray-400">Enjoy your meal!</p></div>`;
                generateBtn.querySelector('#btn-text').classList.remove('hidden');
                generateBtn.querySelector('#btn-spinner').classList.add('hidden');
                generateBtn.disabled = false;
            }, 1500);
        });
        surpriseBtn.addEventListener('click', () => {
            const ingredients = ['Chicken, ginger, garlic', 'Tomato, onion, capsicum', 'Paneer, cream, spices'];
            ingredientsInput.value = ingredients[Math.floor(Math.random() * ingredients.length)];
            showToast('Ingredients surprised!');
        });
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            let isListening = false;
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            voiceBtn.addEventListener('click', () => {
                if (isListening) {
                    recognition.stop();
                    return;
                }
                recognition.start();
            });
            recognition.onstart = () => { isListening = true; voiceBtn.classList.add('mic-listening'); showToast("Listening for ingredients..."); };
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                ingredientsInput.value = transcript.replace(/\.$/, '');
                showToast(`Genie heard: ${transcript}`);
                generateBtn.click();
            };
            recognition.onerror = (event) => {
                let errMessage = `Error: ${event.error}.`;
                if (event.error === 'not-allowed') errMessage = "Mic access denied. Please allow it in settings.";
                else if (event.error === 'no-speech') errMessage = "No speech was detected. Please try again.";
                showToast(errMessage, false);
            };
            recognition.onend = () => { isListening = false; voiceBtn.classList.remove('mic-listening'); };
        } else if (voiceBtn) {
            voiceBtn.addEventListener('click', () => showToast("Sorry, your browser doesn't support voice commands.", false));
        }
    }

    if (document.getElementById('chai-module')) {
        const applyBtn = document.getElementById('apply-chai-settings'), musicSelect = document.getElementById('music-select'), volumeSlider = document.getElementById('volume-slider'), brightnessSlider = document.getElementById('brightness-slider'), warmLightsToggle = document.getElementById('warm-lights-toggle'), dimmerOverlay = document.getElementById('dimmer-overlay'), warmOverlay = document.getElementById('warm-overlay');
        let youtubePlayer;
        const musicTracks = { lofi: 'jfKfPfyJRdk', classical: 'jgpJVI3tDbY', ambient: 'X__qK_5r4iE', bollywood: 'sFmrA_tA2d4' };
        window.onYouTubeIframeAPIReady = function() { youtubePlayer = new YT.Player('youtube-player', { height: '1', width: '1', events: { 'onReady': () => { applyBtn.disabled = false; applyBtn.textContent = 'Apply Chai Time Settings'; } } }); };
        if (applyBtn) {
            applyBtn.disabled = true; applyBtn.textContent = 'Loading Music Player...';
            applyBtn.addEventListener('click', () => { if (youtubePlayer && youtubePlayer.loadVideoById) { youtubePlayer.loadVideoById(musicTracks[musicSelect.value]); youtubePlayer.setVolume(volumeSlider.value); showToast(`Now playing: ${musicSelect.options[musicSelect.selectedIndex].text}`); } });
            warmLightsToggle.addEventListener('change', () => { warmOverlay.style.opacity = warmLightsToggle.checked ? '1' : '0'; showToast(warmLightsToggle.checked ? "Warm lights on" : "Warm lights off"); });
            brightnessSlider.addEventListener('input', () => { dimmerOverlay.style.backgroundColor = `rgba(0, 0, 0, ${(100 - brightnessSlider.value) / 100 * 0.7})`; });
            if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for Chai Time are coming soon!"));
        }
    }

    if (document.getElementById('expense-tracker-module')) {
        const expenseForm = document.getElementById('expense-form'), descriptionInput = document.getElementById('expense-description'), amountInput = document.getElementById('expense-amount'), expenseList = document.getElementById('expense-list'), totalExpensesEl = document.getElementById('total-expenses');
        let expenses = [];
        function renderExpenses() { expenseList.innerHTML = ''; let total = 0; expenses.forEach(expense => { const expenseItem = document.createElement('div'); expenseItem.className = 'flex justify-between items-center bg-gray-700/50 p-3 rounded-lg mb-2 animate-fade-in'; expenseItem.innerHTML = `<span class="text-gray-300">${expense.description}</span><span class="font-semibold text-white">₹${expense.amount.toFixed(2)}</span>`; expenseList.appendChild(expenseItem); total += expense.amount; }); totalExpensesEl.textContent = total.toFixed(2); }
        expenseForm.addEventListener('submit', (e) => { e.preventDefault(); const description = descriptionInput.value; const amount = parseFloat(amountInput.value); if (description.trim() === '' || isNaN(amount) || amount <= 0) { showToast('Please enter a valid description and amount.', false); return; } expenses.push({ description, amount }); renderExpenses(); descriptionInput.value = ''; amountInput.value = ''; descriptionInput.focus(); showToast('Expense added successfully!'); });
        if (voiceBtn) voiceBtn.addEventListener('click', () => showToast("Voice commands for the Expense Tracker are coming soon!"));
    }
});