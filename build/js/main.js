const divContainer = document.querySelector(".trabajos-grid");
const filtroContainer = document.querySelector(".filtros");
const tagsContainer = document.querySelector(".tags-contenedor");
const eliminarFiltrosBtn = document.querySelector(".eliminar-filtros");

let jobs = [];
let tags = [];


listeners();

function listeners() {
    document.addEventListener("DOMContentLoaded", () => {
        
        fetch("build/js/data.json")
        .then(respuesta => respuesta.json())
        .then(datos => {
            jobs = [...datos];
            showJobs(jobs);
        })
    })
}

function showJobs(jobs) {

    // Limpiamos el HTML previo
    eliminarHTMLPrevio(divContainer);

    jobs.forEach(job => {
        
        const {company, logo, featured, position, role, level, postedAt, contract, location, languages, tools} = job;

        const trabajoContenedor = document.createElement("div");
        trabajoContenedor.classList.add("trabajo");
        if(featured && job.new) {
            trabajoContenedor.classList.add("new-featured");
        }

        const trabajoHeader = document.createElement("div");
        trabajoHeader.classList.add("trabajo-header");

        const trabajoImagen = document.createElement("img");
        trabajoImagen.classList.add("trabajo-imagen");
        trabajoImagen.src = `${logo}`;

        const trabajoInfo = document.createElement("div");
        trabajoInfo.classList.add("trabajo-info");
        trabajoInfo.innerHTML = `
            <h3>${company} <span class="${job.new ? "trabajo-new" : ""}">${job.new ? "new" : ""}</span> <span class="${featured ? "trabajo-featured" : ""}">${featured ? "featured" : ""}</span></h3>
            <h2>${position}</h2>
            <p><span>${postedAt}</span> . <span>${contract}</span> . <span>${location}</span></p>   
        `;

        const btnRole = document.createElement("button");
        btnRole.classList.add("tag");
        btnRole.value = `${role}`;
        btnRole.textContent = `${role}`;

        const btnLevel = document.createElement("button");
        btnLevel.classList.add("tag");
        btnLevel.value = `${level}`;
        btnLevel.textContent = `${level}`;

        const trabajoTags = document.createElement("div");
        trabajoTags.classList.add("trabajo-tags");
        trabajoTags.appendChild(btnRole);
        trabajoTags.appendChild(btnLevel);



        if(languages.length) {
            languages.forEach(language => {
                const btnLanguage = document.createElement("button");
                btnLanguage.classList.add("tag");
                btnLanguage.value = language;
                btnLanguage.textContent = language;

                trabajoTags.appendChild(btnLanguage);
            })
        }

        if(tools.length) {
            tools.forEach(tool => {
                const btnTool = document.createElement("button");
                btnTool.classList.add("tag");
                btnTool.value = tool;
                btnTool.textContent = tool;

                trabajoTags.appendChild(btnTool);
            })
        }

        trabajoHeader.appendChild(trabajoImagen);
        trabajoHeader.appendChild(trabajoInfo);

        trabajoContenedor.appendChild(trabajoHeader);
        trabajoContenedor.appendChild(trabajoTags);

        divContainer.appendChild(trabajoContenedor);
    });
}


function eliminarHTMLPrevio(divPadre) {
    while(divPadre.firstElementChild) {
        divPadre.firstElementChild.remove();
    }
}


divContainer.addEventListener("click", e => {
    if(e.target.nodeName === "BUTTON") {

        const  tagObjeto = {
            nombre: e.target.value,
            id: Date.now()
        }

        if(!tags.some(tag => tag.nombre === tagObjeto.nombre)) {
            tags = [...tags, tagObjeto];
            mostrarTags(tags);
        } 
    };
})

eliminarFiltrosBtn.addEventListener("click", () => {
    tags = [];
    mostrarTags(tags);
});

function mostrarTags(tags) {
    if(tags.length >= 1) { // Hay algo
        filtroContainer.classList.add("mostrar");        
    } else {
        filtroContainer.classList.remove("mostrar");  
    }

    eliminarHTMLPrevio(tagsContainer);
    

    tags.forEach(tag => {
        const {nombre, id} = tag;
        const div = document.createElement("div");
        div.classList.add("tag-filtro");

        const p = document.createElement("p");
        p.textContent = nombre;

        const button = document.createElement("button");
        button.classList.add("btn-eliminar");
        button.onclick = function() {
            eliminarTag(id);
        }

        div.appendChild(p);
        div.appendChild(button);

        tagsContainer.appendChild(div);
    })

    filtrarJobs(tags);
}

function eliminarTag(id) {
    tags = tags.filter(tag => tag.id !== id);
    mostrarTags(tags);
}

function filtrarJobs(tags) {
    console.log(jobs);

    let jobsFiltrados = [...jobs];

    
    tags.forEach(tag => {
        if(tag.nombre === "Frontend" || tag.nombre === "Fullstack" || tag.nombre === "Backend") {
            jobsFiltrados = jobsFiltrados.filter(job => job.role === tag.nombre);
        } else if(tag.nombre === "React" || tag.nombre === "Sass" || tag.nombre === "Ruby" || tag.nombre === "RoR" || tag.nombre ==="Vue" || tag.nombre === "Django") {
            jobsFiltrados = jobsFiltrados.filter(job => job.tools.includes(tag.nombre));
        } else if(tag.nombre === "Junior" || tag.nombre === "Midweight" || tag.nombre === "Senior") {
            jobsFiltrados = jobsFiltrados.filter(job => job.level === tag.nombre);
        }  else {
            jobsFiltrados = jobsFiltrados.filter(job => job.languages.includes(tag.nombre));
        }
    })

    console.log(jobsFiltrados);

    showJobs(jobsFiltrados);


}

