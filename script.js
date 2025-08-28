
let data = {};
let currentClass = "", currentSubject = "", currentUnit = "";

fetch("data.json")
    .then(res => res.json())
    .then(json => { data = json; })
    .catch(err => console.error("Failed to load JSON", err));

document.addEventListener("DOMContentLoaded", () => {
    const goBtn = document.getElementById("go-btn");
    const backMain = document.getElementById("back-to-main");
    const backUnits = document.getElementById("back-to-units");
    const backClass = document.getElementById("back-to-class");
    const subjectSearchInput = document.getElementById("subject-search");
    const unitSearchInput = document.getElementById("unit-search-input");

    goBtn.addEventListener("click", () => {
        const name = document.getElementById("student-name").value.trim();
        currentClass = document.getElementById("student-class").value;
        if (!name || !currentClass) { alert("Fill name & class"); return; }
        document.getElementById("student-display-name").innerText = name;
        document.getElementById("login-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
        loadSubjects(currentClass);
    });

    backClass.addEventListener("click", () => {
        document.getElementById("main-section").style.display = "none";
        document.getElementById("login-section").style.display = "block";
        document.getElementById("student-class").value = "";
        document.getElementById("student-name").value = "";
    });

    backMain.addEventListener("click", () => {
        document.getElementById("unit-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
        subjectSearchInput.value = "";
        document.getElementById("subject-search-results").innerHTML = "";
    });

    backUnits.addEventListener("click", () => {
        document.getElementById("search-section").style.display = "none";
        document.getElementById("unit-section").style.display = "block";
        unitSearchInput.value = "";
        document.getElementById("search-results").innerHTML = "";
    });

    subjectSearchInput.addEventListener("input", (e) => searchAllUnits(currentClass, currentSubject, e.target.value));
    unitSearchInput.addEventListener("input", (e) => displayResults(e.target.value));
});

function loadSubjects(cls) {
    const subjectDiv = document.getElementById("subject-list");
    subjectDiv.innerHTML = "";
    const subjects = Object.keys(data[cls] || {});
    subjects.forEach(sub => {
        const btn = document.createElement("button");
        btn.className = "subject-btn";
        btn.innerText = sub;
        btn.addEventListener("click", () => openUnits(sub));
        subjectDiv.appendChild(btn);
    });
}

function openUnits(sub) {
    currentSubject = sub;
    document.getElementById("current-subject").innerText = `${currentClass} - ${sub}`;
    document.getElementById("main-section").style.display = "none";
    document.getElementById("unit-section").style.display = "block";

    const unitDiv = document.getElementById("unit-list");
    unitDiv.innerHTML = "";
    const units = Object.keys(data[currentClass][sub] || {});
    units.forEach(u => {
        const btn = document.createElement("button");
        btn.className = "unit-btn";
        btn.innerText = u;
        btn.addEventListener("click", () => openUnitSearch(u));
        unitDiv.appendChild(btn);
    });
}

function openUnitSearch(unit) {
    currentUnit = unit;
    document.getElementById("current-subject-unit").innerText = `${currentClass} - ${currentSubject} - ${unit}`;
    document.getElementById("unit-section").style.display = "none";
    document.getElementById("search-section").style.display = "block";
    document.getElementById("unit-search-input").value = "";
    displayResults("");
}

function displayResults(query) {
    const resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = "";
    const emu = (data[currentClass][currentSubject][currentUnit] || []);
    const filtered = emu.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) { resultsDiv.innerHTML = "<p>No emulator found</p>"; }
    else filtered.forEach(e => {
        const a = document.createElement("a");
        a.href = e.url;
        a.target = "_blank";
        a.innerText = e.name;
        resultsDiv.appendChild(a);
    });
}

function searchAllUnits(cls, sub, query) {
    const resultsDiv = document.getElementById("subject-search-results");
    resultsDiv.innerHTML = "";
    if (!query) return;
    const units = data[cls][sub];
    for (const unit in units) {
        units[unit].forEach(e => {
            if (e.name.toLowerCase().includes(query.toLowerCase())) {
                const a = document.createElement("a");
                a.href = e.url;
                a.target = "_blank";
                a.innerText = `${unit}: ${e.name}`;
                resultsDiv.appendChild(a);
            }
        });
    }
}
