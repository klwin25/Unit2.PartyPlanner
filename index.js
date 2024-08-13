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

  const partyTitle = addPartyForm.partyTitle.value;
  const partyDate = addPartyForm.partyDate.value;
  const partyLocation = addPartyForm.partyLocation.value;
  const partyDescription = addPartyForm.partyDescription.value;

  await createParty(partyTitle, partyDate, partyLocation, partyDescription);
  render();
  addPartyForm.reset();
}

async function createParty(
  partyTitle,
  partyDate,
  partyLocation,
  partyDescription
) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: partyTitle,
        description: partyDescription,
        date: partyDate,
        location: partyLocation,
      }),
    });

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}

async function updateParty(
  partyTitle,
  partyDate,
  partyLocation,
  partyDescription
) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: partyTitle,
        description: partyDescription,
        date: partyDate,
        location: partyLocation,
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
    partyList.innerHTML = /*html*/ `<li> No parties found. </li>`;
    return;
  }

  const partyCards = state.parties.map((party) => {
    const partyCard = document.createElement("li");
    partyCard.classList.add("party");

    const formattedDate = new Date(party.date).toLocaleDateString();

    partyCard.innerHTML = /*html*/ `
    <h2>${party.name}</h2>
    <p>ID: ${party.id}</p>
    <p>Date: ${formattedDate}</p>
    <p>Location: ${party.location}</p>
    <p>Description: ${party.description}</p>
`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
  });
  partyList.replaceChildren(...partyCards);
}
