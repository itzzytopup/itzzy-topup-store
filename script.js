const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("nav");
menuBtn.addEventListener("click",()=>nav.classList.toggle("show"));

const modal=document.getElementById("orderModal");
const modalGame=document.getElementById("modalGame");
const closeModal=document.getElementById("closeModal");

document.querySelectorAll(".topup-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    modalGame.textContent=btn.dataset.game;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
  });
});

function hideModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}
closeModal.addEventListener("click",hideModal);
modal.addEventListener("click",e=>{if(e.target===modal)hideModal()});

document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();
  const playerId=document.getElementById("playerId").value.trim();
  const pkg=document.getElementById("package").value;
  alert(`Order ready!\\n\\nGame: ${modalGame.textContent}\\nPlayer ID: ${playerId}\\nPackage: ${pkg}\\n\\nNext step: connect this form to the secure FlashTopup backend.`);
});
