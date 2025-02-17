export interface LocationInfo {
  country: string;
  region: string;
  city: string;
}

export async function getUserLocation(): Promise<LocationInfo> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      country: data.country_name,
      region: data.region,
      city: data.city,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return {
      country: "Unknown",
      region: "Unknown",
      city: "Unknown",
    };
  }
}
