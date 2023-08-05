// js of landing page
async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const ipAddress = data.ip;
    document.getElementById(
      "ipaddress"
    ).innerText = `Your Current IP Address is ${ipAddress}`;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    document.getElementById("ipAddress").textContent =
      "Error fetching IP address";
  }
}

getIpAddress();
