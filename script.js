const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const feedback = document.getElementById('feedback');
const resetBtn = document.getElementById('resetBtn');
const hoseGroups = document.getElementById('hoseGroups');
const layout1Group = document.getElementById('layout1Group');
const layout2Group = document.getElementById('layout2Group');
const layout3Group = document.getElementById('layout3Group');
const quantityGroups = document.getElementById('quantityGroups');
const quantityOther1 = document.getElementById('quantityOther1');
const quantityOther2 = document.getElementById('quantityOther2');
const layoutRadios = document.querySelectorAll('input[name="layout"]');
const nozzleRadios = document.querySelectorAll('input[name="nozzle"]');
const quantityRadios = document.querySelectorAll('input[name="quantity"]');
const quantityRadios1 = document.getElementById('quantityGroup1');
const quantityRadios2 = document.getElementById('quantityGroup2');
const layoutGPMDefault = document.getElementById('layoutGPMDefault');
const layout3GPM = document.getElementById('layout3GPM');
const optionsGroup = document.getElementById('optionsGroup');
const defaultGPM = document.getElementById('defaultGPM');
const defaultGPM2 = document.getElementById('defaultGPM2');

let correctAnswer = 0;

// function getQuantity () {
//     let trueQuantity;
//
//     if (quantityRadios.value !== '0') {
//         trueQuantity = parseFloat(document.querySelector('input[name="quantityRadios1"]').value);
//     } else if (quantityGroup1 === "0") {
//         trueQuantity = parseFloat(document.querySelector('input[name="quantityOthers1"]').value);
//     } else if (!isNaN(quantityOther2.value)) {
//         trueQuantity = parseFloat(document.querySelector('input[name="quantityOthers2"]').value);
//     }
//     return trueQuantity;
// }

function myRound (pump_pressure) {
    return Math.round(pump_pressure / 5) * 5;
}

function frictionLoss (coefficient, quantity, length) {
    return (coefficient * ((quantity / 100) ** 2) * (length / 100))
}

function attackPressure (quantity, length, nozzle, layout) {
    let coefficient = 15.5;
    if (layout === 2) {
        coefficient = 2;
    }

    let pump_pressure;
    if (nozzleRadios.value === '2') {
        pump_pressure = friction_loss(coefficient, quantity, length) + 100;
    } else {
        pump_pressure = friction_loss(coefficient, quantity, length) + 50;
    }

    return pump_pressure;
}

function supplyPressure(quantity, big_length, small_length, nozzle){
    const small_pressure = attack_pressure(quantity, small_length, nozzle, 3)

    quantity = quantity * 2
    const high_pressure = 350
    let supply_pressure;
    if (quantity >= high_pressure) {
        supply_pressure = friction_loss(2, quantity, big_length) + 10
    } else {
        supply_pressure = friction_loss(2, quantity, big_length)
    }

    return supply_pressure + small_pressure
}

function getLayout() {
    const layout = document.querySelector('input[name="layout"]:checked');
    return layout ? layout.value : null;
}

function getQuantity() {
    const selected = document.querySelector('input[name="quantity"]:checked');

    let quantity = 0;
    if(selected !== null) quantity = selected.value;
    else if(quantityOther1 !== null) quantity = quantityOther1;
    else if(quantityOther2 !== null) quantity = quantityOther2;

    return quantity ? quantity : null;
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
            optionsGroup.classList.remove('hidden');
            quantityRadios1.classList.remove('hidden');
            quantityRadios2.classList.add('hidden');
            layoutGPMDefault.classList.remove('hidden');
            layout3GPM.classList.add('hidden');
            defaultGPM.checked = true
            break;
        case "2":
            layout1Group.classList.add('hidden');
            layout2Group.classList.remove('hidden');
            layout3Group.classList.add('hidden');
            optionsGroup.classList.remove('hidden');
            quantityRadios1.classList.add('hidden');
            quantityRadios2.classList.remove('hidden');
            layoutGPMDefault.classList.remove('hidden');
            layout3GPM.classList.add('hidden');
            defaultGPM2.checked = true
            break;
        case "3":
            layout1Group.classList.add('hidden');
            layout2Group.classList.add('hidden');
            layout3Group.classList.remove('hidden');
            optionsGroup.classList.remove('hidden');
            quantityRadios1.classList.remove('hidden');
            quantityRadios2.classList.add('hidden');
            layoutGPMDefault.classList.add('hidden');
            layout3GPM.classList.remove('hidden');
            defaultGPM.checked = true
            break;
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

// Show other GPM entry
quantityRadios.forEach((radio) => {
    radio.addEventListener('change', function () {
jjjjjjjjjjjjjjjjjjjjjj            quantityOther1.classList.remove('hidden')
        } else {
            quantityOther1.classList.add('hidden')
        }
    });
})

layoutRadios.forEach(radio => radio.addEventListener('change', handleLayoutChange));
quantityRadios.forEach(radio => radio.addEventListener('change', handleQuantityChange));

// Step 1 submission
form1.addEventListener('submit', function(e) {
    e.preventDefault();

    const quantity = getQuantity();
    const layout = getLayout();

    let length = 0;

    if (layout === "3") {
        const length1 = parseFloat(document.getElementById('hose1').value) * 50;
        const length2 = parseFloat(document.getElementById('hose2').value) * 50;
        if (isNaN(length1) || isNaN(length2) || isNaN(quantity)) return;
    } else {
        length = parseFloat(document.getElementById('hose').value) * 50;
        if (isNaN(length) || isNaN(quantity)) return;
    }

    if (isNaN(quantity) || quantity <= 25 || quantity > 500) {
        feedback.textContent = "Quantity must be between 1 and 500.";
        feedback.style.color = "red";
        return;
    }

    correctAnswer = length * quantity;
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    feedback.textContent = '';
});

// Old Step 1 submission (Delete?)
// form1.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const length = parseFloat(document.getElementById('length').value);
//     const quantity = parseFloat(document.getElementById('quantity').value);
//
//     if (!isNaN(length) && !isNaN(quantity)) {
//         correctAnswer = length * quantity;
//         step1.classList.add('hidden');
//         step2.classList.remove('hidden');
//     }
// });

// Step 2 submission
form2.addEventListener('submit', function(e) {
    e.preventDefault();
    const guess = parseFloat(document.getElementById('guess').value);

    if (guess === correctAnswer) {
        feedback.textContent = "🎉 Correct! Great job!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = "❌ Not quite. Try again!";
        feedback.style.color = "red";
    }
});

// Reset button logic
resetBtn.addEventListener('click', function(e) {
    form1.reset()
    form2.reset()
    document.getElementById('quantity').value = 100;

    // Reset UI
    step2.classList.add('hidden');
    step1.classList.remove('hidden');
    feedback.textContent = '';
    correctAnswer = 0;
});