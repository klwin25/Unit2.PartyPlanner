const COHORT = "2407-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    console.log(response);

    const json = await response.json();
    console.log(json.data);

    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();

  //   const partyTitle = addPartyForm.elements["partyTitle"].value;
  //   const partyDate = addPartyForm.elements["partyDate"].value;
  //   const partyTime = addPartyForm.elements["partyTime"].value;
  //   const partyLocation = addPartyForm.elements["partyLocation"].value;
  //   const partyDescription = addPartyForm.elements["partyDescription"].value;

  await createParty(
    addPartyForm.partyTitle.value,
    addPartyForm.partyDate.value,
    addPartyForm.partyTime.value,
    addPartyForm.partyLocation.value,
    addPartyForm.partyDescription.value
  );

  //   addPartyForm.reset();
  //   render();
}

async function createParty(
  partyTitle,
  partyDate,
  partyTime,
  partyLocation,
  partyDescription
) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partyTitle,
        partyDate,
        partyTime,
        partyLocation,
        partyDescription,
      }),
    });

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

async function updateParty(
  id,
  partyTitle,
  partyDate,
  partyTime,
  partyLocation,
  partyDescription
) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partyTitle,
        partyDate,
        partyTime,
        partyLocation,
        partyDescription,
      }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteParty(id) {
  console.log(id);

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    console.log(response.status);

    if (!response.ok) {
      throw new Error("Party could not be deleted");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = `<li>No parties found.</li>`;
    return;
  }

  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");
    partyCard.innerHTML = `
    <h2>${party.partyTitle}</h2>
    <p>ID ${party.id}</p>
    <p>${party.partyDate}</p>
    <p>${party.partyTime}</p>
    <p>${party.partyLocation}</p>
    <p>${party.partyDescription}</p>
`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
  });
  partyList.replaceChildren(...partyCards);
}
