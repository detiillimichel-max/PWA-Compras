const state={stores:[],categories:[]};
const categoryIcons={Todas:"grid-2x2",Tecnologia:"laptop",Moda:"shirt",Casa:"house",Beleza:"sparkles","Infantil & Pets":"baby",Celulares:"smartphone",Acessórios:"cable",Games:"gamepad-2",Smartwatches:"watch",Fones:"headphones",Notebooks:"laptop","Moda feminina":"shirt","Moda masculina":"shirt",Eletrodomésticos:"plug",Esporte:"dumbbell",Automotivo:"car"};

function refreshIcons(){if(window.lucide)window.lucide.createIcons();}
function showView(name){
 document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-"+name));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
 refreshIcons();window.scrollTo({top:0,behavior:"smooth"});
}
function renderQuickCategories(){
 const items=state.categories.slice(0,6);
 document.querySelector("#quickCategories").innerHTML=items.map((c,i)=>`<button class="quick-category ${i===0?"active":""}" type="button" data-category="${c}"><i data-lucide="${categoryIcons[c]||"tag"}></i><span>${c}</span></button>`).join("");
 document.querySelectorAll(".quick-category").forEach(btn=>btn.addEventListener("click",()=>{
   document.querySelectorAll(".quick-category").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
   const value=btn.dataset.category;
   if(value==="Todas")return renderStores(state.stores);
   renderStores(state.stores.filter(s=>(s.categories||[]).some(c=>c.toLocaleLowerCase("pt-BR").includes(value.toLocaleLowerCase("pt-BR")))));
 }));
 refreshIcons();
}
function renderStores(stores){
 const grid=document.querySelector("#storeGrid");document.querySelector("#storeCount").textContent=stores.length+" lojas";
 if(!stores.length){grid.innerHTML='<div class="empty">Nenhuma loja encontrada.</div>';return}
 grid.innerHTML=stores.map(s=>`<article class="store-card" data-store="${s.name}">
   <div class="store-logo" aria-hidden="true">${s.icon}</div>
   <div class="store-info"><h3>${s.name}</h3><p>${s.description}</p><span class="badge">${s.source}</span></div>
   <span class="store-arrow"><i data-lucide="chevron-right"></i></span>
 </article>`).join("");refreshIcons();
}
function renderCategories(){
 document.querySelector("#categoryGrid").innerHTML=state.categories.map(c=>`<button class="category" type="button" data-category="${c}"><i data-lucide="${categoryIcons[c]||"tag"}></i><span>${c}</span></button>`).join("");
 document.querySelectorAll(".category").forEach(btn=>btn.addEventListener("click",()=>{
   showView("explorar");
   const value=btn.dataset.category;
   document.querySelector("#searchInput").value="";
   document.querySelectorAll(".quick-category").forEach(x=>x.classList.toggle("active",x.dataset.category===value));
   if(value==="Todas")renderStores(state.stores);else renderStores(state.stores.filter(s=>(s.categories||[]).includes(value)));
 }));
 refreshIcons();
}
async function loadCatalog(){
 try{
   const response=await fetch("./data/stores.json",{cache:"no-store"});if(!response.ok)throw new Error();
   const data=await response.json();state.stores=data.stores||[];state.categories=data.categories||[];
   renderQuickCategories();renderStores(state.stores);renderCategories();
 }catch(e){document.querySelector("#storeGrid").innerHTML='<div class="empty">Catálogo temporariamente indisponível.</div>'}
}
document.querySelector("#searchInput").addEventListener("input",e=>{
 const q=e.target.value.trim().toLocaleLowerCase("pt-BR");
 renderStores(state.stores.filter(s=>(s.name+" "+s.description+" "+s.source+" "+(s.categories||[]).join(" ")).toLocaleLowerCase("pt-BR").includes(q)));
});
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js"));
loadCatalog();
refreshIcons();
