const parentCard = document.querySelector(".cards");
const submit = document.querySelector(".submit");
const namaEl = document.querySelector("#nama");
const catatanEl = document.querySelector("#catatan");
const card = document.createElement("div");
card.classList.add("card");
let cardEdit = null;

const storage = {
  ambil() {
    return JSON.parse(localStorage.getItem("todolist") ?? "[]");
  },
  simpan(data) {
    localStorage.setItem("todolist", JSON.stringify(data));
  },
};

window.addEventListener("load", () => {
  let dataLama = storage.ambil();
  buatUI(dataLama); // Render semua data yang sudah ada
});

submit.addEventListener("click", function (e) {
  e.preventDefault();

  if (namaEl.value == "" || catatanEl.value == "") {
    alert("Data tidak boleh kosong");
    return;
  }

  if (cardEdit) {
    // update ui nya
    cardEdit.querySelector(".titleToDoList").textContent = namaEl.value;
    cardEdit.querySelector(".catatanEl").textContent = catatanEl.value;

    // update di localStorage
    let idCard = Number(cardEdit.dataset.id);
    let data = storage.ambil();
    let dataBaru = data.map((item) => {
      if (item.id === idCard) {
        return {
          ...item,
          nama: namaEl.value,
          catatan: catatanEl.value,
        };
      }
      return item;
    });

    // kembalikan nilai yg telah di update lewat map
    storage.simpan(dataBaru);

    // kosongkan si cardEdit
    cardEdit = null;
  } else {
    let dataLama = storage.ambil();
    const dataTerbaru = simpanLocalStorage(dataLama);

    // Render ulang seluruh UI, jangan cuma buat card baru
    parentCard.innerHTML = "";
    buatUI(dataTerbaru);
  }

  namaEl.value = "";
  catatanEl.value = "";
});

document.addEventListener("click", function (e) {
  const card = e.target.closest(".card");

  if (e.target.classList.contains("edit")) {
    cardEdit = card;
    namaEl.value = cardEdit.querySelector(".titleToDoList").textContent;
    catatanEl.value = cardEdit.querySelector(".catatanEl").textContent;
  }

  if (e.target.classList.contains("hapus")) {
    let idHapus = Number(card.dataset.id);
    let data = storage.ambil();
    let filterData = data.filter((d) => d.id !== idHapus);
    storage.simpan(filterData);

    // Render ulang UI, jangan cuma remove satu card saja
    parentCard.innerHTML = "";
    buatUI(filterData);
  }
});

const buatUI = (dataLama) => {
  const cardsHTML = dataLama
    .map(
      (data) => `
            <div class="card" data-id="${data.id}">
                <div class="header">
                    <h3 class="titleToDoList">${data.nama}</h3>
                <div class="menu">
                    <button class="edit">Edit</button>
                    <button class="hapus">Hapus</button>
                </div>
            </div>
            <hr/>
            <p class="catatanEl">${data.catatan}</p>
            </div> `
    )
    .join("");

  parentCard.insertAdjacentHTML("beforeend", cardsHTML);
};

const simpanLocalStorage = (dataLama) => {
  if (dataLama === null) {
    dataLama = [];
  }

  // buat databaru dari inputan
  let dataBaru = { id: Date.now(), nama: namaEl.value, catatan: catatanEl.value };

  // gabungkan data lama dengan data baru
  dataLama.push(dataBaru);

  // simpan dataLama yg telah digabung dengan databaru
  localStorage.setItem("todolist", JSON.stringify(dataLama));

  // kembalikan data lama
  return dataLama;
};
