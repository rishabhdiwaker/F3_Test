// js of post office details page
const postItem = document.getElementById("post-items");

async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ipAddress = data.ip;
    return ipAddress;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
}

async function getLocationInfo() {
  const ipAddress = await getIpAddress();
  if (!ipAddress) return;
  try {
    const response = await fetch(
      `https://ipinfo.io/${ipAddress}/?token=1dcf69eb98156a`
    );
    const data = await response.json();
    displayinfo(data);
    if (data.postal) {
      await getPostOffices(data.postal);
    } else {
    }
  } catch (error) {
    console.error("Error fetching location info:", error);
    alert("It feels like you are using AdBlocker, Kindly turn off for proper functioning.");
  }
}
getLocationInfo();
const hostname = window.location.hostname;

function displayinfo(data) {
  const date = new Date();
  console.log(data);
  const laAndlt = data.loc.split(",");
  const d1 = document.getElementById("s1");
  d1.innerHTML = ` <h3>IP Address : ${data.ip}</h3>
  <div class="user-info">
    <div>
      <p>Lat: ${laAndlt[0]}</p>
      <p>Long: ${laAndlt[1]}</p>
    </div>
    <div>
      <p>City: ${data.city}</p>
      <p>Region: ${data.region}</p>
    </div>
    <div>
      <p>Organisation: ${data.company.name}</p>
      <p>Hostname: ${hostname}</p>
    </div>
  </div>`;

  const mapId = (document.getElementById(
    "mapId"
  ).src = `https://maps.google.com/maps?q=${data.loc}&z=15&output=embed`);

  const more = document.getElementById("more");
  more.innerHTML = ` <h1>More Information About You</h1>
  <ul>
    <li>Time Zone: ${data.timezone}</li>
    <li>Date And Time: ${date}</li>
    <li>Pincode: ${data.postal}</li>
    <li id="noPin"></li>
  </ul>`;
}
const err = document.getElementById("err");
const search = document.getElementById("search");
async function getPostOffices(pincode) {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    if (data && data.length > 0 && data[0].Status === "Success") {
      const noPin = document.getElementById("noPin");
      noPin.innerText = `${data[0].Message}`;
      const postOffices = data[0].PostOffice;
      displayPostOffice(postOffices);

      search.addEventListener("keydown", (e) => {
        postItem.innerHTML = ` `;
        const val = e.target.value.toLowerCase();
        const filtered = postOffices.filter((item) => {
          return (
            item.Name.toLowerCase().includes(val) ||
            item.BranchType.toLowerCase().includes(val)
          );
        });
        if (filtered.length === 0) {
          err.style.display = "block";
          err.innerText = "No post offices found in the pincode";
        } else {
          err.style.display = "none";
          displayPostOffice(filtered);
        }
      });
    } else {
      err.innerText = "No post offices found in the pincode";
    }
  } catch (error) {
    console.error("Error fetching post offices:", error);
  }
}

function displayPostOffice(data) {
  console.log(data);
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `  <ul>
    <li>Name: ${item.Name}</li>
    <li>Branch Type: ${item.BranchType}</li>
    <li>Delivery Status: ${item.DeliveryStatus}</li>
    <li>District: ${item.District}</li>
    <li>Division: ${item.Division}</li>
  </ul>`;
    postItem.appendChild(div);
  });
}
