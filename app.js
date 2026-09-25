const state={stores:[],categories:[]};

async function loadStores(){
  try{
    const response=await fetch("./data/stores.json",{cache:"no-store"});
    if(!response.ok)throw new Error("Falha ao carregar lojas");
    const data=await response.json();
    state.stores=data.stores||[];state.categories=data.categories||[];
    renderStores(state.stores);renderCategories(state.categories);
  }catch(error){
    document.querySelector("#storeGrid").innerHTML='<div class="empty">Não foi possível carregar a configuração das lojas.</div>';
  }
}
function renderStores(stores){
  const grid=document.querySelector("#storeGrid");
  document.querySelector("#storeCount").textContent=stores.length+" lojas";
  if(!stores.length){grid.innerHTML='<div class="empty">Nenhuma loja encontrada.</div>';return;}
  grid.innerHTML=stores.map(store=>`<article class="store-card"><div><div class="logo" aria-hidden="true">${store.icon}</div><h3>${store.name}</h3><p>${store.description}</p></div><span class="badge">${store.source}</span></article>`).join("");
}
function renderCategories(categories){
  document.querySelector("#categoryGrid").innerHTML=categories.map(category=>`<span class="category">${category}</span>`).join("");
}
function showView(name){
  document.querySelectorAll(".view").forEach(view=>view.classList.toggle("active-view",view.id==="view-"+name));
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelector("#searchInput").addEventListener("input",event=>{
  const query=event.target.value.trim().toLocaleLowerCase("pt-BR");
  renderStores(state.stores.filter(store=>(store.name+" "+store.description+" "+store.source).toLocaleLowerCase("pt-BR").includes(query)));
});
document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>showView(item.dataset.view)));
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js"));
loadStores();
