
// Get the career ID from the URL parameters
const params = new URLSearchParams(window.location.search); // Searches what comes after the ? in the URL and creates an object with key-value pairs
const careerId = params.get("careerId"); // Get the value of the "careerId" parameter from the URL

console.log("Career ID from URL:", careerId); // Log the career ID to verify that it is being retrieved correctly

// Translating functions
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

function translatePivotalEvent(event) {
    const events = {
        digital_learning_platforms: "Digitale læringsplattformer blir vanlige i utdanning",
        generative_ai_in_education: "Generativ AI blir integrert i utdanning",
    };
    return events[event] || event.replaceAll("_", " ");
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

function translateGrowthTrend(trend) {
    const trends = {
        fast_growing: "Raskt voksende",
        growing: "Voksende",
        stable: "Stabil"
    };
    return trends[trend] || trend;
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

async function fetchCareerDetails() {

    // Hero

    // Fetch the career details from the API using the career ID
    try {
        const response = await fetch("https://api.npoint.io/50c59220b5f6b049d324");
        const data = await response.json();


        // create a career object with careerId and details from API
        const career = {
            id: careerId,
            ...data.career_paths[careerId]
        };

        // Career image
        const imageSrc = getCareerImage(career.id); // Get the image URL based on the career ID

        const educationLevels = career.education_options
            .map(option => translateEducationLevel(option.level)) // Using the translation function to convert education levels to Norwegian
            .join(' / ');


        const professionFamily = translateProfessionFamily(career.profession_family);

        const title = translateTitle(career.id, career.title); // Translate the title using the career ID as a key, with a fallback to the original title

        // Oversikt
        // Utdanning
        const educationInfo = career.education_options.map(option => {
            const level = translateEducationLevel(option.level);
            const duration = option.length_years + " år";
            const requirements = option.entry_requirements
                .map(r => translateRequirement(r))
                .join(", ");
            const providers = option.providers
                .map(p => translateProviders(p))
                .join(", ");

            return `
            <p>
                <strong>${level}</strong><br>
                <em>${option.title}</em><br>
                <strong>Lengde:</strong> ${duration}<br>
                <strong>Opptakskrav:</strong> ${requirements}<br>
                <strong>Tilbys av:</strong> ${providers}
                </p>
            `;
        }).join("");

        // Arbeidsmarked Norge
        const employment = career.economy.norway.employed_people;
        const newJob = career.economy.norway.new_job_announcements_per_year;
        const growth = translateGrowthTrend(career.economy.norway.growth_trend);

        const jobMarket = `
            <p>
                <strong>Antall ansatte:</strong> ${employment}<br>
                <strong>Nye stillinger per år:</strong> ${newJob}<br>
                <strong>Veksttrend:</strong> ${growth}
            </p>
            `;

        // Økonomi
        const salary = career.economy.norway.average_salary_nok.toLocaleString("no-NO");
        const totalOutput = career.economy.norway.total_economic_output_mnok.toLocaleString("no-NO");
        const workerOutput = career.economy.norway.economic_output_per_worker_nok.toLocaleString("no-NO");

        const economyInfo = `
            <p>
                <strong>Gjennomsnittslønn:</strong> ${salary} NOK<br>
                <strong>Total verdiskapning:</strong> ${totalOutput} NOK<br>
                <strong>Verdiskapning per ansatt:</strong> ${workerOutput} NOK
            </p>
            `;

        // Globalt perspektiv
        const globalNewJob = career.economy.global.new_job_announcements_per_year;
        const globalEmployed = career.economy.global.employed_people;
        const globalComp = career.economy.global.international_competitiveness_score;

        const globalInfo = `
            <p> 
                <strong>Nye stillinger per år globalt:</strong> ${globalNewJob}<br>
                <strong>Antall ansatte globalt:</strong> ${globalEmployed}<br>
                <strong>Internasjonal konkurranseevne:</strong> ${globalComp}
            </p>
            `;

        // Lønn og Historie
        // Lønnsutvikling

        const chartData = career.historical_and_forecast.timeseries.map(point => [
            point.year = point.year,
            point.salary = point.norway_avg_salary_nok
        ]);

        Highcharts.chart('salaryChart', {
            title: {
                text: 'Lønnsutvikling'
            },
            xAxis: {
                title: {
                    text: 'År'
                }
            },
            yAxis: {
                title: {
                    text: 'Lønn (NOK)'
                }
            },
            series: [{
                name: 'Gjennomsnittslønn',
                data: chartData
            }]
        });

        //Historisk Utvikling
        const historicalTrends = career.historical_and_forecast.timeseries.map(trend => {
            const year = trend.year;
            const employed = trend.norway_employed;
            const avgSalary = trend.norway_avg_salary_nok.toLocaleString("no-NO")


            return `
            <p>
                <strong>År:</strong> ${year}<br>
                <strong>Antall ansatte:</strong> ${employed}<br>
                <strong>Gjennomsnittslønn:</strong> ${avgSalary} NOK
            </p>
            `;

        }).join("");

        // Vendepunkter og overganger
        //Vendepunkter
        const pivotalEvents = career.historical_and_forecast.pivotal_points.map(event => {
            const eventYear = event.year;
            const description = translatePivotalEvent(event.event);

            return `
            <p>
                <strong>År:</strong> ${eventYear} → ${description}
            </p>
            `;

        }).join("");

        // Overganger
        const transitionsIn = career.transitions.yearly_inflow_from_other_professions.map(item => item.people_per_year)
            .reduce((sum, value) => sum + value, 0);

        const transitionsOut = career.transitions.yearly_outflow_to_other_professions.map(item => item.people_per_year)
            .reduce((sum, value) => sum + value, 0);

        const transitionInfo = `
        <p>
            <strong>Inn i yrket per år:</strong> ${transitionsIn}<br>
            <strong>Ut av yrket per år:</strong> ${transitionsOut}
        </p>
        `;

        // Reviews
        const reviews = career.reviews.map(review => {
            const satisfaction = review.satisfaction_score;
            const reviewCountry = review.country;
            const reviewText = review.review_text;

            return `
            <p> 
                <strong>Tilfredshet:</strong> ${satisfaction}/10 <br>
                <strong>Land:</strong> ${reviewCountry} <br>
                ${reviewText}
            </p>
            `
        }).join("");

        //Get element
        // Hero
        document.getElementById('careerHeroImg').src = imageSrc; // Set the image source for the career hero image
        document.getElementById("careerTitle").textContent = title; // Set the career title in the HTML
        document.getElementById('careerLevel').textContent = educationLevels;
        document.getElementById('careerFamily').textContent = professionFamily;
        document.getElementById('careerDesc').textContent = career.description.summary;

        // Oversikt
        document.getElementById("detailEducation").innerHTML = educationInfo;
        document.getElementById('jobMarket').innerHTML = jobMarket;
        document.getElementById('ecoInfo').innerHTML = economyInfo;
        document.getElementById('globalPerspective').innerHTML = globalInfo;

        //Lønn og Historie
        document.getElementById('salaryChart'); // The chart will be rendered here by Highcharts
        document.getElementById('historyText').innerHTML = historicalTrends;

        // Vendepunkter og overganger
        document.getElementById('pivotalPoints').innerHTML = pivotalEvents;
        document.getElementById('careerTransitions').innerHTML = transitionInfo;

        // Reviews
        document.getElementById('reviewsList').innerHTML = reviews;

        console.log("Career details:", career); // Log the career details to verify that they are being retrieved correctly

    } catch (error) {
        console.error("Could not fetch career details:", error);
    }
}

fetchCareerDetails();