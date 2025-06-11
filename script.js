const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const randomScenario = document.getElementById('randomScenario');
const feedback = document.getElementById('feedback');
const explanation = document.getElementById('explanation');
const answer = document.getElementById('answer');
const resetBtn = document.getElementById('resetBtn');
const hoseGroups = document.getElementById('hoseGroups');
const layout1Group = document.getElementById('layout1Group');
const layout2Group = document.getElementById('layout2Group');
const layout3Group = document.getElementById('layout3Group');
const quantityGroups = document.getElementById('quantityGroups');
const quantityOther1 = document.getElementById('quantityOther1');
const quantityOther2 = document.getElementById('quantityOther2');
const layoutRadios = document.querySelectorAll('input[name="layout"]');
const nozzleSelection = document.querySelectorAll('input[name="nozzle"]');
const quantityRadios = document.querySelectorAll('input[name="quantity"]');
const quantityRadios1 = document.getElementById('quantityGroup1');
const quantityRadios2 = document.getElementById('quantityGroup2');
const layoutGPMDefault = document.getElementById('layoutGPMDefault');
const layout3GPM = document.getElementById('layout3GPM');
const nozzleGroup = document.getElementById('nozzleGroup');
const defaultGPM = document.getElementById('defaultGPM');
const defaultGPM2 = document.getElementById('defaultGPM2');
const scenario = document.getElementById('scenario');
const constQuantitySelect = document.getElementById('constQuantitySelect');
const constQuantityEntry = document.getElementById('constQuantityEntry');

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

    let quantity = 0;
    if(selected !== null) quantity = selected.value;
    else if(quantityOther1 !== null) quantity = quantityOther1.value;
    else if(quantityOther2 !== null) quantity = quantityOther2.value;

    return quantity ? quantity : null;
}

function getNozzle() {
    const nozzle = document.querySelector('input[name="nozzle"]:checked');
    return nozzle ? nozzle.value : null;
}

function handleLayoutChange() {
    hoseGroups.classList.remove('hidden');
    quantityGroups.classList.remove('hidden');
    quantityRadios.forEach(radio => radio.checked = false);
    quantityOther1.classList.add('hidden');
    quantityOther2.classList.add('hidden');
    let layout = getLayout();

    switch (layout) {
        case "1":
            layout1Group.classList.remove('hidden');
            layout2Group.classList.add('hidden');
            layout3Group.classList.add('hidden');
            nozzleGroup.classList.remove('hidden');
            quantityRadios1.classList.remove('hidden');
            quantityRadios2.classList.add('hidden');
            layoutGPMDefault.classList.remove('hidden');
            layout3GPM.classList.add('hidden');
            defaultGPM.checked = true;
            break;
        case "2":
            layout1Group.classList.add('hidden');
            layout2Group.classList.remove('hidden');
            layout3Group.classList.add('hidden');
            nozzleGroup.classList.remove('hidden');
            quantityRadios1.classList.add('hidden');
            quantityRadios2.classList.remove('hidden');
            layoutGPMDefault.classList.remove('hidden');
            layout3GPM.classList.add('hidden');
            defaultGPM2.checked = true;
            break;
        case "3":
            layout1Group.classList.add('hidden');
            layout2Group.classList.add('hidden');
            layout3Group.classList.remove('hidden');
            nozzleGroup.classList.remove('hidden');
            quantityRadios1.classList.remove('hidden');
            quantityRadios2.classList.add('hidden');
            layoutGPMDefault.classList.add('hidden');
            layout3GPM.classList.remove('hidden');
            defaultGPM.checked = true;
            break;
        default:
            layout1Group.classList.add('hidden');
            layout2Group.classList.add('hidden');
            layout3Group.classList.add('hidden');
            nozzleGroup.classList.add('hidden');
            quantityRadios1.classList.add('hidden');
            quantityRadios2.classList.add('hidden');
            layoutGPMDefault.classList.add('hidden');
            layout3GPM.classList.add('hidden');
            hoseGroups.classList.add('hidden');
    }
}

function handleQuantityChange() {
    const selectedQuantity = document.querySelector('input[name="quantity"]:checked');

    if (selectedQuantity?.value === 'other') {
        const layout = getLayout();
        quantityOther2.classList.add('hidden');
        quantityOther1.classList.add('hidden');
        if (layout === '2') {
            quantityOther2.classList.remove('hidden');
            quantityOther1.classList.add('hidden');
        } else {
            quantityOther2.classList.add('hidden');
            quantityOther1.classList.remove('hidden');
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

function handleConstQuantityChange() {
    if (constQuantitySelect.checked) {
        constQuantityEntry.classList.remove('hidden');
    } else {
        constQuantityEntry.classList.add('hidden');
    }

    if (constQuantityEntry.value) {}
}

// Show other GPM entry
quantityRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
        if (this.value === 'other') {
            quantityOther1.classList.remove('hidden')
        } else {
            quantityOther1.classList.add('hidden')
        }
    });
})

layoutRadios.forEach(radio => radio.addEventListener('change', handleLayoutChange));
quantityRadios.forEach(radio => radio.addEventListener('change', handleQuantityChange));

constQuantitySelect.addEventListener('change', handleConstQuantityChange);
constQuantityEntry.addEventListener('change', handleConstQuantityChange);

// Step 1 submission
form1.addEventListener('submit', (e) => {
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
    }

    if (isNaN(nozzle)) {
        feedback.textContent = "A nozzle type must be selected.";
        feedback.style.color = "red";
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

    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    if(layout === 3){
        scenario.innerHTML = `You are pumping to ${length2}\' of 2.5" hose connected to a gated wye.<br>Attached is ${length1}\' of 1.75" hose each flowing ${quantity} GPM through a ${nozzleType}.`
    } else if (layout === 2) {
        scenario.innerHTML = `You are pumping to ${sections}\' of 2.5" hose flowing ${quantity} GPM through a ${nozzleType}.`
    } else {
        scenario.innerHTML = `You are pumping to ${sections}\' of 1.75" hose flowing ${quantity} GPM through a ${nozzleType}.`
    }
    feedback.textContent = '';
    explanation.textContent = '';
    answer.textContent = '';
});

randomScenario.addEventListener('click', () => {
    // Randomly select layout
    const layouts = Array.from(document.querySelectorAll('input[name="layout"]'));
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    randomLayout.checked = true;
    handleLayoutChange();

    // Trigger quantity radios relevant to selected layout
    const layoutVal = getLayout();

    // Small delay to let the DOM update hidden groups
    setTimeout(() => {
        let quantityInputs;
        if (layoutVal === '1' || layoutVal === '3') {
            quantityInputs = quantityRadios1.querySelectorAll('input[name="quantity"]:not([value="other"])');
        } else if (layoutVal === '2') {
            quantityInputs = quantityRadios2.querySelectorAll('input[name="quantity"]:not([value="other"])');
        }

        const randQuantity = quantityInputs[Math.floor(Math.random() * quantityInputs.length)];
        randQuantity.checked = true;

        // Random hose sections
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

        // Then trigger form submission logic manually
        form1.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
});

// Step 2 submission
form2.addEventListener('submit', function(e) {
    e.preventDefault();
    const guess = parseFloat(document.getElementById('guess').value);

    if (guess >= minRange && guess <= maxRange) {
        feedback.textContent = "🎉 Correct! Great job!";
        feedback.style.color = "green";
        answer.innerHTML = `The exact pressure was ${correctAnswer}!`;
    } else {
        feedback.textContent = "❌ Not quite. Try again!";
        feedback.style.color = "red";
        if (guess - correctAnswer >= 40 || guess - correctAnswer <= -40) {
            answer.innerHTML = 'Double check you\'re considering the right nozzle.';
        }
    }
});

// Reset button logic
resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    layoutRadios.forEach(radio => radio.checked = false);
    handleLayoutChange();
    form1.reset();
    form2.reset();

    // Reset UI
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    handleLayoutChange();
    feedback.textContent = '';
    correctAnswer = 0;
});