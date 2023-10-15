export default class SoilAnalysis {
  constructor() {
    this.apiKey = "AIzaSyCruMPt43aekqITCooCNWGombhbcor3cf4";
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve(this.getSoilProperties(latitude, longitude));
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject("Geolocation is not supported by your browser.");
      }
    });
  };

  getSoilProperties = async (latitude, longitude) => {
    const carbon_organic = await fetch(
      `https://api.isda-africa.com/v1/soilproperty?key=${this.apiKey}&lat=${latitude}&lon=${longitude}&property=carbon_organic&depth=0-20`
    );
    const fcc = await fetch(
      `https://api.isda-africa.com/v1/soilproperty?key=${this.apiKey}&lat=${latitude}&lon=${longitude}&property=fcc&depth=0-50`
    );
    const clay_content = await fetch(
      `https://api.isda-africa.com/v1/soilproperty?key=${this.apiKey}&lat=${latitude}&lon=${longitude}&property=clay_content&depth=0-20`
    );
    const ph = await fetch(
      `https://api.isda-africa.com/v1/soilproperty?key=${this.apiKey}&lat=${latitude}&lon=${longitude}&property=ph&depth=0-20`
    );
    const soil_properties = await Promise.all([
      carbon_organic.json(),
      fcc.json(),
      clay_content.json(),
      ph.json(),
    ]);
    return soil_properties;
  };
}
