
let allCareers = [];

// Translating functions
function translateEducationLevel(level) {
    const levels = {
        bachelor: "Bachelor",
        master: "Master",
        vocational_certificate: "Fagbrev",
        professional_degree: "Profesjonsutdanning",
        certificate: "Fagbrev"
    };

    return levels[level] || level;
}

function translateProfessionFamily(family) {
    const families = {
      technology_and_design: "Teknologi og design",
      technology: "Teknologi og design",
      technology_and_security: "Teknologi og design",
      technology: "Teknologi og design",
      data_and_ai: "Teknologi og design",
      health_and_care: "Helse og omsorg",
      healthcare: "Helse og omsorg",
      education: "Utdanning",
      engineering_and_construction: "Ingeniørfag",
      engineering: "Ingeniørfag",
      finance: "Finans",
      business_and_media: "Forretning og media",
      construction_and_energy: "Bygg og anlegg",
      construction_and_maintenance: "Bygg og anlegg",
      construction: "Bygg og anlegg",
      transport_and_supply_chain: "Transport",
      transport_and_maintenance: "Transport",
      hospitality_and_food: "Hotell og mat",
      industry_and_fabrication: "Industri og produksjon",
      agriculture_and_food: "Landbruk og mat",
    };
  
    return families[family] || family.replaceAll("_", " ");
  }

function translateTitle(id, fallbackTitle) {
    const titles = {
        career_software_engineer: 'Programvareingeniør',
        career_interaction_designer: 'Interaksjonsdesigner',
        career_data_scientist: 'Dataforsker',
        career_nurse: 'Sykepleier',
        career_doctor: 'Lege',
        career_teacher: 'Lærer',
        career_mechanical_engineer: 'Maskiningeniør',
        career_civil_engineer: 'Sivilingeniør',
        career_accountant: 'Regnskapsfører',
        career_marketing_manager: 'Markedsføringssjef',
        career_electrician: 'Elektriker',
        career_plumber: 'Rørlegger',
        career_carpenter: 'Tømrer',
        career_automotive_mechanic: 'Bilmekaniker',
        career_chef: 'Kokk',
        career_welder: 'Sveiser',
        career_logistics_coordinator: 'Logistikkkoordinator',
        career_farmer_agritech: 'Landbrukstekniker',
        career_cybersecurity_analyst: 'Cybersikkerhetsanalytiker',
    };

    return titles[id] || fallbackTitle;
}

function translateRequirement(req) {
    const requirements = {
        general_study_competence: "Generell studiekompetanse",
        relevant_bachelor_degree: "Relevant bachelorgrad",
        mathematics_r1_or_equivalent: "Matematikk R1 eller tilsvarende",
        advanced_mathematics: 'Avansert matematikk',
        advanced_science_requirements: 'Avansert realfagskrav',
        completed_lower_secondary_school: 'Fullført grunnskole'
    };

    return requirements[req] || req.replaceAll("_", " ");
}

function translateProviders(pro) {
    const providers = {
        upper_secondary_schools: "Videregående skoler",
        apprenticeship_companies: "Lærlingebedrifter",
    };
    if (providers[pro]) {
        return providers[pro]; // oversett hvis det finnes
    }

    return pro.toUpperCase(); // ellers: UIO, NTNU osv
}

async function fetchCareers() {
    try {
        const response = await fetch("https://api.npoint.io/50c59220b5f6b049d324");
        const data = await response.json();

        allCareers = data.career_options.map((careerId) => {
            return {
                id: careerId,
                ...data.career_paths[careerId]
            };
        });

        populateDropdowns();

    } catch (error) {
        console.error("Could not fetch careers:", error);
    }
}

function populateDropdowns() {
    const select1 = document.getElementById("career1");
    const select2 = document.getElementById("career2");

    allCareers.forEach((career) => {
        const option1 = document.createElement("option");
        option1.value = career.id;
        option1.textContent = translateTitle(career.id, career.title);

        const option2 = document.createElement("option");
        option2.value = career.id;
        option2.textContent = translateTitle(career.id, career.title);

        select1.appendChild(option1);
        select2.appendChild(option2);

    });
}

function renderComparison(career1, career2) {
    const table = document.getElementById("compareTable");

    const education1 = career1.education_options
        .map(option => translateEducationLevel(option.level))
        .join(" / ");

    const education2 = career2.education_options
        .map(option => translateEducationLevel(option.level))
        .join(" / ");

    const family1 = translateProfessionFamily(career1.profession_family);
    const family2 = translateProfessionFamily(career2.profession_family);

    const salary1 = career1.economy.norway.average_salary_nok.toLocaleString("no-NO");
    const salary2 = career2.economy.norway.average_salary_nok.toLocaleString("no-NO");

    const employed1 = career1.economy.norway.employed_people.toLocaleString("no-NO");
    const employed2 = career2.economy.norway.employed_people.toLocaleString("no-NO");

    const req1 = career1.education_options[0].entry_requirements
        .map(r => translateRequirement(r))
        .join(',' + '<br>');

    const req2 = career2.education_options[0].entry_requirements
        .map(r => translateRequirement(r))
        .join(',' + '<br>');


    table.innerHTML = `
    <tr>
      <th>Kategori</th>
      <th>${translateTitle(career1.id, career1.title)}</th>
      <th>${translateTitle(career2.id, career2.title)}</th>
    </tr>
    <tr>
      <td>Utdanning</td>
      <td>${education1}</td>
      <td>${education2}</td>
    </tr>
    <tr>
      <td>Fagområde</td>
      <td>${family1}</td>
      <td>${family2}</td>
    </tr>
    <tr>
      <td>Gjennomsnittslønn</td>
      <td>${salary1} kr</td>
      <td>${salary2} kr</td>
    </tr>
    <tr>
      <td>Antall ansatte</td>
      <td>${employed1}</td>
      <td>${employed2}</td>
    </tr>

    <tr>
      <td>Opptakskrav</td>
      <td>${req1}</td>
      <td>${req2}</td>
    </tr>
  `;
}

function setupCompareButton() {
    const compareBtn = document.getElementById("compareBtn");

    compareBtn.addEventListener("click", () => {
        const selectedId1 = document.getElementById("career1").value;
        const selectedId2 = document.getElementById("career2").value;

        const career1 = allCareers.find(career => career.id === selectedId1);
        const career2 = allCareers.find(career => career.id === selectedId2);

        if (!career1 || !career2) return;

        renderComparison(career1, career2);
    });
}

fetchCareers();
setupCompareButton();
