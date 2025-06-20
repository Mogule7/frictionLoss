const DOM = {
    // Forms and Steps
    form1: document.getElementById('form1'),
    form2: document.getElementById('form2'),
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),

    // Main UI Elements
    manualSubmit: document.getElementById('manualSubmit'),
    feedback: document.getElementById('feedback'),
    explanation: document.getElementById('explanation'),
    answer: document.getElementById('answer'),
    resetBtn: document.getElementById('resetBtn'),
    clearForm1: document.getElementById('clear'),
    randomUnselected: document.getElementById('randomUnselected'),

    // Scenario Controls
    scenario: document.getElementById('scenario'),
    randomScenario: document.getElementById('randomScenario'),
    randomScenarioGroup: document.getElementById('randomScenarioGroup'),

    // Hose Layout Groups
    hoseGroups: document.getElementById('hoseGroups'),
    layout1Group: document.getElementById('layout1Group'),
    layout2Group: document.getElementById('layout2Group'),
    layout3Group: document.getElementById('layout3Group'),
    layoutGPMDefault: document.getElementById('layoutGPMDefault'),
    layout3GPM: document.getElementById('layout3GPM'),

    // Nozzle
    nozzleGroup: document.getElementById('nozzleGroup'),
    defaultGPM: document.getElementById('defaultGPM'),
    defaultGPM2: document.getElementById('defaultGPM2'),

    // Quantity
    quantityGroups: document.getElementById('quantityGroups'),
    quantityOther1: document.getElementById('quantityOther1'),
    quantityOther2: document.getElementById('quantityOther2'),
    quantityRadios1: document.getElementById('quantityGroup1'),
    quantityRadios2: document.getElementById('quantityGroup2'),

    // Constant Input Mode
    constQuantitySelect: document.getElementById('constQuantitySelect'),
    constGpmEntry: document.getElementById('constGpmEntry'),
    constQuantityEntry: document.getElementById('constQuantityEntry'),

    // Radios
    layoutRadios: document.querySelectorAll('input[name="layout"]'),
    quantityRadios: document.querySelectorAll('input[name="quantity"]'),
    nozzleSelection: document.querySelectorAll('input[name="nozzle"]')
};

const activeTimers = {};
const shownOnce = new Set();

let correctAnswer = 0;
let minRange = 0;
let maxRange = 0;

function myRound (pumpPressure) {
    return Math.round(pumpPressure / 5) * 5;
}

function frictionLoss (coefficient, quantity, length) {
    return Math.round(coefficient * ((quantity / 100) ** 2) * (length / 100))
}

function attackPressure (quantity, sections, nozzle, layout) {
    let coefficient = 15.5;
    if (layout === 2) {
        coefficient = 2;
    }

    return frictionLoss(coefficient, quantity, sections) + (50 * nozzle);
}

function supplyPressure(quantity, bigLength, smallLength, nozzle){
    const smallPressure = attackPressure(quantity, smallLength, nozzle, 3)

    quantity = quantity * 2
    const highPressure = 350
    let bigPressure;
    if (quantity >= highPressure) {
        bigPressure = frictionLoss(2, quantity, bigLength) + 10
    } else {
        bigPressure = frictionLoss(2, quantity, bigLength)
    }

    return bigPressure + smallPressure
}

function getLayout() {
    const layout = document.querySelector('input[name="layout"]:checked');
    return layout ? layout.value : null;
}

function getQuantity() {
    const selected = document.querySelector('input[name="quantity"]:checked');

    let quantity;
    if(selected.value !== "other") quantity = selected.value;
    else if(DOM.quantityOther2.classList.contains("hidden")) quantity = DOM.quantityOther1.value;
    else if(DOM.quantityOther1.classList.contains("hidden")) quantity = DOM.quantityOther2.value;

    return quantity ? quantity : null;
}

function getNozzle() {
    const nozzle = document.querySelector('input[name="nozzle"]:checked');
    return nozzle ? nozzle.value : null;
}

function handleLayoutChange() {
    DOM.randomScenarioGroup.classList.remove('hidden');
    DOM.hoseGroups.classList.remove('hidden');
    DOM.quantityGroups.classList.remove('hidden');
    DOM.quantityRadios.forEach(radio => radio.checked = false);
    DOM.quantityOther1.classList.add('hidden');
    DOM.quantityOther2.classList.add('hidden');
    DOM.randomUnselected.classList.add('hidden');
    let layout = getLayout();

    switch (layout) {
        case "1":
            DOM.randomScenarioGroup.classList.add('hidden');
            DOM.layout1Group.classList.remove('hidden');
            DOM.layout2Group.classList.add('hidden');
            DOM.layout3Group.classList.add('hidden');
            DOM.nozzleGroup.classList.remove('hidden');
            DOM.quantityRadios1.classList.remove('hidden');
            DOM.quantityRadios2.classList.add('hidden');
            DOM.layoutGPMDefault.classList.remove('hidden');
            DOM.layout3GPM.classList.add('hidden');
            DOM.randomUnselected.classList.remove('hidden');
            break;
        case "2":
            DOM.randomScenarioGroup.classList.add('hidden');
            DOM.layout1Group.classList.add('hidden');
            DOM.layout2Group.classList.remove('hidden');
            DOM.layout3Group.classList.add('hidden');
            DOM.nozzleGroup.classList.remove('hidden');
            DOM.quantityRadios1.classList.add('hidden');
            DOM.quantityRadios2.classList.remove('hidden');
            DOM.layoutGPMDefault.classList.remove('hidden');
            DOM.layout3GPM.classList.add('hidden');
            DOM.randomUnselected.classList.remove('hidden');
            break;
        case "3":
            DOM.randomScenarioGroup.classList.add('hidden');
            DOM.layout1Group.classList.add('hidden');
            DOM.layout2Group.classList.add('hidden');
            DOM.layout3Group.classList.remove('hidden');
            DOM.nozzleGroup.classList.remove('hidden');
            DOM.quantityRadios1.classList.remove('hidden');
            DOM.quantityRadios2.classList.add('hidden');
            DOM.layoutGPMDefault.classList.add('hidden');
            DOM.layout3GPM.classList.remove('hidden');
            DOM.randomUnselected.classList.remove('hidden');
            break;
        default:
            DOM.layout1Group.classList.add('hidden');
            DOM.layout2Group.classList.add('hidden');
            DOM.layout3Group.classList.add('hidden');
            DOM.nozzleGroup.classList.add('hidden');
            DOM.quantityRadios1.classList.add('hidden');
            DOM.quantityRadios2.classList.add('hidden');
            DOM.layoutGPMDefault.classList.add('hidden');
            DOM.layout3GPM.classList.add('hidden');
            DOM.hoseGroups.classList.add('hidden');
            DOM.randomUnselected.classList.add('hidden');
    }
}

function handleQuantityChange() {
    const selectedQuantity = document.querySelector('input[name="quantity"]:checked');

    if (selectedQuantity?.value === 'other') {
        const layout = getLayout();
        DOM.quantityOther2.classList.add('hidden');
        DOM.quantityOther1.classList.add('hidden');
        if (layout === '2') {
            DOM.quantityOther2.classList.remove('hidden');
            DOM.quantityOther1.classList.add('hidden');
        } else {
            DOM.quantityOther2.classList.add('hidden');
            DOM.quantityOther1.classList.remove('hidden');
        }
    }
}

function isRadioGroupChecked(name) {
    return document.querySelector(`input[name="${name}"]:checked`) !== null;
}

function highlightInvalid(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(r => r.parentElement.style.color = 'red');
}

function handleConstQuantitySelect() {
    if (DOM.constQuantitySelect.checked) {
        DOM.constQuantityEntry.classList.remove('hidden');
        DOM.constGpmEntry.value = "95"
    } else {
        DOM.constQuantityEntry.classList.add('hidden');
    }
}

function isLayoutValid() {
    return !!document.querySelector('input[name="layout"]:checked');
}

function isNozzleValid() {
    return !!document.querySelector('input[name="nozzle"]:checked');
}

function isQuantityValid() {
    const quantityRadio = document.querySelector('input[name="quantity"]:checked');
    const quantity1Visible = !DOM.quantityOther1.classList.contains('hidden');
    const quantity2Visible = !DOM.quantityOther2.classList.contains('hidden');
    const quantity1Value = DOM.quantityOther1.value.trim();
    const quantity2Value = DOM.quantityOther2.value.trim();

    if (quantityRadio && quantityRadio.value !== 'other') {
        return true;
    }

    const other1HasValue = quantity1Visible && quantity1Value !== '';
    const other2HasValue = quantity2Visible && quantity2Value !== '';

    return other1HasValue || other2HasValue;
}

function isHoseValid() {
    const hose = document.querySelector('input[name="hose"]:checked');
    const hose1 = document.querySelector('input[name="hose1"]:checked');
    const hose2 = document.querySelector('input[name="hose2"]:checked');

    // layout 1 or 2 uses hose only, layout 3 uses hose1 and hose2
    if (hose && !hose1 && !hose2) return true;
    return !!(hose1 && hose2);


}

function checkFormCompletion() {
    const layoutValid = isLayoutValid();
    const hoseValid = isHoseValid();
    const quantityValid = isQuantityValid();
    const nozzleValid = isNozzleValid();

    const allValid = layoutValid && hoseValid && quantityValid && nozzleValid;

    const manualSubmit = document.getElementById('manualSubmit');

    if (allValid) {
        manualSubmit.classList.remove('hidden');
        DOM.randomUnselected.classList.add('hidden');
    } else {
        manualSubmit.classList.add('hidden');
        if (!layoutValid) {
            DOM.randomUnselected.classList.add('hidden');
        } else {
            DOM.randomUnselected.classList.remove('hidden');
        }
    }
}

function randomizeLayout() {
    const layouts = Array.from(document.querySelectorAll('input[name="layout"]'));
    const gpm = parseInt(DOM.constGpmEntry.value);
    const useConst = DOM.constQuantitySelect.checked;

    let selectedLayout;

    if (useConst) {
        if (gpm > 200) {
            selectedLayout = layouts[1]; // layout 2.5"
        } else if (gpm < 95) {
            selectedLayout = layouts[Math.random() < 0.5 ? 0 : 2]; // layout 1 or 3
        } else {
            selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
        }
    } else {
        selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    }

    selectedLayout.checked = true;
}

function randomizeQuantity(layoutVal, skipIfSelected) {
    if (skipIfSelected && isQuantityValid()) return;

    const gpm = parseInt(DOM.constGpmEntry.value);
    const useConst = DOM.constQuantitySelect.checked;

    if (useConst) {
        if (layoutVal === '1' || layoutVal === '3') {
            DOM.quantityRadios1.querySelector('input[value="other"]').checked = true;
            DOM.quantityOther1.value = gpm;
        } else if (layoutVal === '2') {
            DOM.quantityRadios2.querySelector('input[value="other"]').checked = true;
            DOM.quantityOther2.value = gpm;
        }
    } else {
        let quantityInputs;
        if (layoutVal === '1' || layoutVal === '3') {
            quantityInputs = DOM.quantityRadios1.querySelectorAll('input[name="quantity"]:not([value="other"])');
        } else if (layoutVal === '2') {
            quantityInputs = DOM.quantityRadios2.querySelectorAll('input[name="quantity"]:not([value="other"])');
        }

        const selected = quantityInputs[Math.floor(Math.random() * quantityInputs.length)];
        selected.checked = true;
    }
}

function randomizeHose(layoutVal, skipIfSelected) {
    if (skipIfSelected && isHoseValid()) return;

    if (layoutVal === '3') {
        const hose1 = document.querySelectorAll('input[name="hose1"]');
        const hose2 = document.querySelectorAll('input[name="hose2"]');
        hose1[Math.floor(Math.random() * hose1.length)].checked = true;
        hose2[Math.floor(Math.random() * hose2.length)].checked = true;
    } else {
        const hose = document.querySelectorAll('input[name="hose"]');
        hose[Math.floor(Math.random() * hose.length)].checked = true;
    }
}

function randomizeNozzle(skipIfSelected) {
    if (skipIfSelected && isNozzleValid()) return;

    const nozzles = document.querySelectorAll('input[name="nozzle"]');
    nozzles[Math.floor(Math.random() * nozzles.length)].checked = true;
}

function delay(ms = 50) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// -- Group Functions --
function randomizeLayoutPromise() {
    randomizeLayout();
    return delay();
}

function randomizeQuantityPromise(layoutVal, skipIfSelected) {
    if (skipIfSelected && isQuantityValid()) return delay();
    randomizeQuantity(layoutVal, skipIfSelected);
    return delay();
}

function randomizeHosePromise(layoutVal, skipIfSelected) {
    if (skipIfSelected && isHoseValid()) return delay();
    randomizeHose(layoutVal, skipIfSelected);
    return delay();
}

function randomizeNozzlePromise(skipIfSelected) {
    if (skipIfSelected && isNozzleValid()) return delay();
    randomizeNozzle(skipIfSelected);
    return delay();
}

// -- Main Driver --
async function randomizeScenario({ setLayout = false, skipIfSelected = false }) {
    if (setLayout) {
        await randomizeLayoutPromise();
    }

    const layoutVal = getLayout();

    await randomizeQuantityPromise(layoutVal, skipIfSelected);
    await randomizeHosePromise(layoutVal, skipIfSelected);
    await randomizeNozzlePromise(skipIfSelected);

    checkFormCompletion();

    DOM.form1.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}


function triggerPopover(id, message, classes) {
    if (shownOnce.has(id)) return;
    showPopover(id, message, classes);
    shownOnce.add(id);
}

function showPopover(id, message, classes) {
    const element = document.getElementById(id);

    element.textContent = message;
    element.className = `ml-4 mt-1 absolute opacity-0 transition-opacity duration-300 ease-in-out pointer-events-none
                    text-sm rounded px-3 py-2 shadow w-max border ${classes}`;
    element.classList.remove('hidden');
    requestAnimationFrame(() => element.classList.remove('opacity-0'));

    clearTimeout(activeTimers[id]);
    activeTimers[id] = setTimeout(() => hidePopover(id), 5000);
}

function hidePopover(id, resetShown = false) {
    const element = document.getElementById(id);

    element.classList.add('opacity-0');
    setTimeout(() => {
        element.classList.add('hidden');
        if (resetShown) shownOnce.delete(id);
    }, 300);
}

function resetPage() {
    DOM.layoutRadios.forEach(radio => radio.checked = false);
    DOM.form1.reset();
    DOM.form2.reset();

    // Reset UI
    DOM.step2.classList.add('hidden');
    DOM.step1.classList.remove('hidden');
    // DOM.constQuantitySelect.checked = false;
    // DOM.constQuantityEntry.classList.add('hidden');
    handleLayoutChange();
    checkFormCompletion();

    // Reset warning messages
    const resetButtons = [DOM.resetBtn, DOM.clearForm1]
    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            shownOnce.clear();
        });
    });

    DOM.feedback.textContent = '';
    correctAnswer = 0;
}

// Keeping Rand scenario GPM unchecked on load allows the getQuantity function to work
window.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('constQuantitySelect');
    if (checkbox.checked === true){
        DOM.constQuantityEntry.classList.remove('hidden');
    }

    DOM.layoutRadios.forEach(radio => radio.checked = false);
    resetPage()
});

// Show other GPM entry
DOM.quantityRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
        if (this.value === 'other') {
            DOM.quantityOther1.classList.remove('hidden')
        } else {
            DOM.quantityOther1.classList.add('hidden')
        }
    });
})

DOM.layoutRadios.forEach(radio => radio.addEventListener('change', handleLayoutChange));
DOM.quantityRadios.forEach(radio => radio.addEventListener('change', handleQuantityChange));

DOM.constQuantitySelect.addEventListener('change', handleConstQuantitySelect);

// Set GPM warning handler
DOM.constGpmEntry.addEventListener('change', () =>{
    const val = parseInt(DOM.constGpmEntry.value);
    const  id = DOM.constGpmEntry.dataset.popoverId;

    if (isNaN(val)) return hidePopover(id);

    if (val < 95) {
        triggerPopover(id,
            "⚠️ SFD 2.5\" handline nozzles don't go below 95 GPM. Quantities this low will use the first or third layout.",
            "bg-white text-black border-yellow-300");
    } else if (val > 200) {
        triggerPopover(id,
            "⚠️ SFD 1.75\" handline nozzles don't go above 200 GPM. Quantities this high will use the second layout.",
            "bg-white text-black border-yellow-300");
    } else {
        hidePopover(id);
        shownOnce.delete(id);
    }
});

// Enable submit on form complete
DOM.form1.addEventListener('input', checkFormCompletion);

// Step 1 submission
DOM.form1.addEventListener('submit', (e) => {
    e.preventDefault();

    const quantity = parseFloat(getQuantity());
    const layout = parseFloat(getLayout());
    const nozzle = parseFloat(getNozzle());

    if (!isRadioGroupChecked('layout')) {
        highlightInvalid('layout');
        alert("Please select a layout.");
        return;
    }

    if (layout === 1 || layout === 2) {
        if (!isRadioGroupChecked('hose')) {
            highlightInvalid('hose');
            alert("Please select a hose length.");
            return;
        }
    } else if (layout === 3) {
        if (!isRadioGroupChecked('hose1') || !isRadioGroupChecked('hose2')) {
            highlightInvalid('hose1');
            highlightInvalid('hose2');
            alert("Please select lengths for both hose types.");
            return;
        }
    }

    let length1;
    let length2;
    let sections;
    if (layout === 3) {
        length1 = parseFloat(document.querySelector('input[name="hose1"]:checked').value) * 50;
        length2 = parseFloat(document.querySelector('input[name="hose2"]:checked').value) * 50;
        if (isNaN(length1) || isNaN(length2) || isNaN(quantity)) return;
    } else {
        sections = parseFloat(document.querySelector('input[name="hose"]:checked').value) * 50;
        if (isNaN(sections) || isNaN(quantity)) return;
    }

    if (!isRadioGroupChecked('quantity') || quantity <= 25 || quantity > 500) {
        highlightInvalid('quantity');
        alert("Quantity must be between 1 and 500.");
        return;
    } else {

    }

    if (isNaN(nozzle)) {
        DOM.feedback.textContent = "A nozzle type must be selected.";
        DOM.feedback.style.color = "red";
        return;
    }

    if (layout === 3) {
        correctAnswer = Math.round(supplyPressure(quantity, length2, length1, nozzle));
        minRange = myRound(correctAnswer) - 5;
        maxRange = myRound(correctAnswer) + 5;
    } else {
        correctAnswer = Math.round(attackPressure(quantity, sections, nozzle, layout));
        minRange = myRound(correctAnswer) - 5;
        maxRange = myRound(correctAnswer) + 5;
    }

    let nozzleType;
    if (nozzle === 1) {
        nozzleType = 'smooth-bore nozzle';
    } else {
        nozzleType = 'fog nozzle';
    }

    DOM.step1.classList.add('hidden');
    DOM.step2.classList.remove('hidden');
    if(layout === 3){
        DOM.scenario.innerHTML = `You are pumping to ${length2}\' of 2.5" hose connected to a gated wye.<br>Attached is ${length1}\' of 1.75" hose each flowing ${quantity} GPM through a ${nozzleType}.`
    } else if (layout === 2) {
        DOM.scenario.innerHTML = `You are pumping to ${sections}\' of 2.5" hose flowing ${quantity} GPM through a ${nozzleType}.`
    } else {
        DOM.scenario.innerHTML = `You are pumping to ${sections}\' of 1.75" hose flowing ${quantity} GPM through a ${nozzleType}.`
    }
    DOM.feedback.textContent = '';
    DOM.explanation.textContent = '';
    DOM.answer.textContent = '';
});

// Step 1 Random Submission
DOM.randomScenario.addEventListener('click', () => {
    randomizeScenario({ setLayout: true, skipIfSelected: false });
});

DOM.randomUnselected.addEventListener('click', () => {
    randomizeScenario({ setLayout: false, skipIfSelected: true });
});

/**
DOM.randomScenario.addEventListener('click', () => {
    const layouts = Array.from(document.querySelectorAll('input[name="layout"]'));
    const quantityInputValue = parseInt(DOM.constGpmEntry.value);
    const usingConstQuantity = DOM.constQuantitySelect.checked;

    let selectedLayout;
    let layoutVal;
    let quantityInputs;
    let selectedQuantity;

    // --- Layout Selection ---
    if (usingConstQuantity) {
        if (quantityInputValue > 200) {
            selectedLayout = layouts[1]; // layout 1 (index 1)
        } else if (quantityInputValue < 95) {
            selectedLayout = layouts[Math.random() < 0.5 ? 0 : 2]; // layout 0 or 2
        } else {
            selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
        }
    } else {
        selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    }

    selectedLayout.checked = true;
    layoutVal = getLayout();

    // --- Quantity Selection ---
    setTimeout( () => {
    if (usingConstQuantity) {
        if (layoutVal === '1' || layoutVal === '3') {
            DOM.quantityRadios1.querySelector('input[value="other"]').checked = true;
            DOM.quantityOther1.value = quantityInputValue;
        } else if (layoutVal === '2') {
            DOM.quantityRadios2.querySelector('input[value="other"]').checked = true;
            DOM.quantityOther2.value = quantityInputValue;
        }
    } else {
        if (layoutVal === '1' || layoutVal === '3') {
            quantityInputs = DOM.quantityRadios1.querySelectorAll('input[name="quantity"]:not([value="other"])');
        } else if (layoutVal === '2') {
            quantityInputs = DOM.quantityRadios2.querySelectorAll('input[name="quantity"]:not([value="other"])');
        }

        selectedQuantity = quantityInputs[Math.floor(Math.random() * quantityInputs.length)];
        selectedQuantity.checked = true;}
    }, 100);

    // --- Hose Selection ---
    setTimeout(() => {
        if (layoutVal === '3') {
            const hose1 = document.querySelectorAll('input[name="hose1"]');
            const hose2 = document.querySelectorAll('input[name="hose2"]');
            hose1[Math.floor(Math.random() * hose1.length)].checked = true;
            hose2[Math.floor(Math.random() * hose2.length)].checked = true;
        } else {
            const hose = document.querySelectorAll('input[name="hose"]');
            hose[Math.floor(Math.random() * hose.length)].checked = true;
        }

        // Random nozzle
        const nozzles = document.querySelectorAll('input[name="nozzle"]');
        nozzles[Math.floor(Math.random() * nozzles.length)].checked = true;

        // Submit form
        DOM.form1.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100); // Slight delay to allow DOM updates
});

DOM.randomUnselected.addEventListener('click', () => {

    const layoutVal = getLayout();

    // Hose
    if (!isHoseValid()) {
        setTimeout(() => {
            if (layoutVal === '3') {
                const hose1 = document.querySelectorAll('input[name="hose1"]');
                const hose2 = document.querySelectorAll('input[name="hose2"]');
                hose1[Math.floor(Math.random() * hose1.length)].checked = true;
                hose2[Math.floor(Math.random() * hose2.length)].checked = true;
            } else {
                const hose = document.querySelectorAll('input[name="hose"]');
                hose[Math.floor(Math.random() * hose.length)].checked = true;
            }
        }, 100);
    }

    // Quantity
    let quantityInputs;
    let selectedQuantity;

    if (!isQuantityValid()) {
        setTimeout(() => {
            if (layoutVal === '1' || layoutVal === '3') {
                quantityInputs = DOM.quantityRadios1.querySelectorAll('input[name="quantity"]:not([value="other"])');
            } else if (layoutVal === '2') {
                quantityInputs = DOM.quantityRadios2.querySelectorAll('input[name="quantity"]:not([value="other"])');
            }

            selectedQuantity = quantityInputs[Math.floor(Math.random() * quantityInputs.length)];
            selectedQuantity.checked = true;
        }, 100);
    }

    // Nozzle
    if (!isNozzleValid()) {
        setTimeout(() => {
            const nozzles = document.querySelectorAll('input[name="nozzle"]');
            nozzles[Math.floor(Math.random() * nozzles.length)].checked = true;
        }, 100);
    }

    // Submit
    setTimeout(() => {
        DOM.form1.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
})
*/

// Step 2 submission
DOM.form2.addEventListener('submit', function(e) {
    e.preventDefault();
    const guess = parseFloat(document.getElementById('guess').value);

    if (guess >= minRange && guess <= maxRange) {
        DOM.feedback.textContent = "🎉 Correct! Great job!";
        DOM.feedback.style.color = "green";
        DOM.answer.innerHTML = `The exact pressure was ${correctAnswer}!`;
    } else {
        DOM.feedback.textContent = "❌ Not quite. Try again!";
        DOM.feedback.style.color = "red";
        if (guess - correctAnswer >= 40 || guess - correctAnswer <= -40) {
            DOM.answer.innerHTML = 'Double check you\'re considering the right nozzle.';
        }
    }
});

// Reset button logic
DOM.resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    resetPage()
});

DOM.clearForm1.addEventListener('click', function(e) {
    e.preventDefault();
    resetPage()
});