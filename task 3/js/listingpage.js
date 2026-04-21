
//Hero
// Search bar in hero section + filter button

const filterBtn = document.getElementById('filterButton');
const filterMenu = document.getElementById('filterContainer');
filterBtn.addEventListener('click', () => {
  filterMenu.classList.toggle('show'); // Toggle the 'show' class to display or hide the filter menu
});

const searchInput = document.getElementById('searchInput');
const filterLevel = document.getElementById('filterLevel');
const filterFamily = document.getElementById('filterFamily');

function applyFilters() {
  
    const searchValue = searchInput.value.toLowerCase();
    const selectedLevel = filterLevel.value;
    const selectedFamily = filterFamily.value;

    // Searchbar
    const filteredCareers = allCareers.filter(career => {
      const translatedTitle = translateTitle(career.id, career.title).toLowerCase();
      
      const matchesSearch = translatedTitle.includes(searchValue); // Check if the translated title includes the search value
    
    // FilterLevel button
    const matchesLevel = 
      selectedLevel === '' || // If no level is selected, include all careers
      career.education_options.some(option => option.level === selectedLevel); // Check if any education option matches the selected level


    // FilterFamily button
    const matchesFamily =
      selectedFamily === "" ||
      career.profession_family === selectedFamily;

      return matchesSearch && matchesLevel && matchesFamily; // Include career only if it matches both search and filter criteria

  });
    renderCareerCards(filteredCareers);
  }

  searchInput.addEventListener('input', applyFilters);
  filterLevel.addEventListener('change', applyFilters);
  filterFamily.addEventListener('change', applyFilters);


//Translating from english to norwegian

function translateEducationLevel(level) {
  const levels = {
    bachelor: "Bachelor",
    master: "Master",
    vocational_certificate: "Fagbrev",
    certificate: "Fagbrev"
  };

  return levels[level] || level;
}

function translateProfessionFamily(family) {
  const families = {
    technology_and_design: "Teknologi og design",
    health_and_care: "Helse og omsorg",
    economy_and_administration: "Økonomi og administrasjon",
    education_and_pedagogy: "Utdanning og pedagogikk",
    building_and_construction: "Bygg og anlegg",
    service_and_creative_fields: "Service og kreative fag",
    data_and_ai: "Data og AI",
    education: "Utdanning",
    engineering_and_construction: "Ingeniørfag og bygg",
    technology: "Teknologi",
    healthcare: "Helse",
    engineering: "Ingeniørfag",
    finance: "Finans",
    business_and_media: "Forretning og media",
    construction_and_energy: "Bygg og energi",
    construction_and_maintenance: "Bygg og vedlikehold",
    construction: "Bygg",
    transport_and_maintenance: "Transport og vedlikehold",
    hospitality_and_food: "Hotell og mat",
    industry_and_fabrication: "Industri og produksjon",
    transport_and_supply_chain: "Transport og logistikk",
    agriculture_and_food: "Landbruk og mat",
    technology_and_security: "Teknologi og sikkerhet",
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

// Function to get the image URL based on the career ID
function getCareerImage(careerId) {
  const careerImages = {
    career_software_engineer: 'images/software-engineer.png',
    career_interaction_designer: 'images/ux.png',
    career_data_scientist: 'images/data-scientist.png',
    career_nurse: 'images/nurse.png',
    career_doctor: 'images/doctor.png',
    career_teacher: 'images/teacher.png',
    career_mechanical_engineer: 'images/mechanical-engineer.png',
    career_civil_engineer: 'images/civil-engineer.png',
    career_accountant: 'images/accountant.png',
    career_marketing_manager: 'images/marketing-manager.png',
    career_electrician: 'images/electrician.png',
    career_plumber: 'images/plumber.png',
    career_carpenter: 'images/carpenter.png',
    career_automotive_mechanic: 'images/automotive-mechanic.png',
    career_chef: 'images/chef.png',
    career_welder: 'images/welder.png',
    career_logistics_coordinator: 'images/logistics-coordinator.png',
    career_farmer_agritech: 'images/farmer-agritech.png',
    career_cybersecurity_analyst: 'images/cybersecurity-analyst.png',
  };

  return careerImages[careerId] || 'images/default_career.png'; // Return default image if not found
}
const careerCards = document.getElementById("careerCards");

let allCareers = [];

async function fetchAllData() {
  try {
    const response = await fetch("https://api.npoint.io/50c59220b5f6b049d324");
    const data = await response.json();
    console.log(data);

    allCareers = data.career_options.map((careerId) => {
      return {
        id: careerId,
        ...data.career_paths[careerId]
      };
    });

    console.log('All careers', allCareers);
    renderCareerCards(allCareers);

  } catch (error) {
    console.error("Could not fetch data:", error);
  }
}

function setupDetailButtons() {
  const detailButtons = document.querySelectorAll('.details-btn'); // Select all buttons with the class 'details-btn'

  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const careerId = button.getAttribute('data-id'); //get id from data attribute
      window.location.href = 'detailpage.html?careerId=' + careerId; // open new page with the careerId as a query parameter

    })
  })
}

function renderCareerCards(careers) {
  careerCards.innerHTML = '';

  careers.forEach((career) => {
    const card = document.createElement('article');
    card.classList.add('smallcard');

    const educationLevels = career.education_options
      .map(option => translateEducationLevel(option.level)) // Using the translation function to convert education levels to Norwegian
      .join(' / ');

    const imageSrc = getCareerImage(career.id); // Get the image URL based on the career ID

    const professionFamily = translateProfessionFamily(career.profession_family);

    const title = translateTitle(career.id, career.title); // Translate the title using the career ID as a key, with a fallback to the original title

    const tags = career.tags
      .map(tag => tag.replaceAll("_", " "))
      .join(", ");

    card.innerHTML = `
      <img src="${imageSrc}" alt="${career.title}">
      <h3>${title}</h3>
      <p>${tags}</p>
      <p>${educationLevels} <br> ${professionFamily} </p>
      <button type="button" class="details-btn" data-id="${career.id}">
        Se detaljer
      </button>
    `;
    careerCards.appendChild(card);
  });

  console.log(allCareers[0]); // Check if there is img data in the first career object
  // There was not img data in the career objects, so i have to add them locally to the objects

  setupDetailButtons();
}



fetchAllData();

