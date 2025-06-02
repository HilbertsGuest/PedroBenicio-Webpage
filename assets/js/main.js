// Theme and mode switching functionality
const modeSwitch = document.getElementById('modeSwitch');
const modeLabel = document.getElementById('modeLabel');
const heroTitle = document.getElementById('heroTitle');
const heroDescription = document.getElementById('heroDescription');
const sectionTitle = document.getElementById('sectionTitle');
const projectsGrid = document.getElementById('projectsGrid');
const logo = document.querySelector('.logo');

let isExperimentMode = false;
let isDarkMode = true;

// Content for different modes
const portfolioContent = {
    title: "Welcome to My Portfolio",
    description: "Discover my latest projects, experiments, and creative explorations in web development, design, and technology.",
    sectionTitle: "Featured Projects",
    projects: [
        {
            title: "Project One",
            description: "A sophisticated web application built with modern technologies. Features responsive design, interactive elements, and seamless user experience.",
            links: [
                { text: "Live Demo", icon: "🔗" },
                { text: "Source Code", icon: "📁" }
            ]
        },
        {
            title: "Project Two", 
            description: "An innovative solution combining AI and web technologies. Demonstrates advanced problem-solving skills and creative implementation.",
            links: [
                { text: "Live Demo", icon: "🔗" },
                { text: "Source Code", icon: "📁" }
            ]
        },
        {
            title: "Project Three",
            description: "A creative exploration in interactive design and user interface development. Showcases attention to detail and modern design principles.",
            links: [
                { text: "Live Demo", icon: "🔗" },
                { text: "Source Code", icon: "📁" }
            ]
        }
    ]
};

const experimentsContent = {
    title: "Welcome to My Experiments",
    description: "Explore my playground of ideas, prototypes, and creative coding experiments. A space for innovation and learning.",
    sectionTitle: "Latest Experiments",
    projects: [
        {
            title: "3D Web Experiment",
            description: "Playing with Three.js to create immersive 3D experiences in the browser. Currently exploring particle systems and interactive geometries.",
            links: [
                { text: "Try It", icon: "🎮" },
                { text: "Code", icon: "📝" }
            ]
        },
        {
            title: "AI Art Generator",
            description: "Experimenting with machine learning APIs to generate unique digital art. A fun exploration of creativity meets technology.",
            links: [
                { text: "Generate", icon: "🎨" },
                { text: "Source", icon: "🤖" }
            ]
        },
        {
            title: "Music Visualizer",
            description: "Creating dynamic visual representations of audio using Web Audio API. An ongoing project exploring the intersection of sound and visuals.",
            links: [
                { text: "Listen", icon: "🎵" },
                { text: "Code", icon: "👨‍💻" }
            ]
        }
    ]
};

function toggleMode() {
    isExperimentMode = !isExperimentMode;
    modeSwitch.classList.toggle('active');
    
    const content = isExperimentMode ? experimentsContent : portfolioContent;
    const modeText = isExperimentMode ? 'Experiments' : 'Portfolio';
    
    // Update content with smooth transitions
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        modeLabel.textContent = modeText;
        logo.textContent = modeText;
        heroTitle.textContent = content.title;
        heroDescription.textContent = content.description;
        sectionTitle.textContent = content.sectionTitle;
        
        // Update projects
        projectsGrid.innerHTML = content.projects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    ${project.links.map(link => `
                        <a href="#" class="project-link">
                            <span>${link.icon}</span>
                            <span>${link.text}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        document.body.style.opacity = '1';
    }, 150);
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
}

// Event listeners
modeSwitch.addEventListener('click', () => {
    toggleMode();
    toggleTheme();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('header');
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Initialize
document.body.setAttribute('data-theme', 'dark');
