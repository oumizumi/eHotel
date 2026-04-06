import type {
  HotelChain,
  Hotel,
  Room,
  Customer,
  Employee,
  Booking,
  Renting,
} from "@/types";

// ─── Hotel Chains ─────────────────────────────────────────────────────────────

export const hotelChains: HotelChain[] = [
  {
    chain_ID: 1,
    name: "Marriott International",
    num_hotels: 10,
    address: "7750 Wisconsin Ave, Bethesda, MD, USA",
    emails: ["marriott.support@marriott.com", "reservations@marriott.com"],
    phones: ["1-800-221-1112", "1-800-721-7033"],
  },
  {
    chain_ID: 2,
    name: "Hilton Worldwide",
    num_hotels: 9,
    address: "7930 Jones Branch Dr, McLean, VA, USA",
    emails: ["info@hilton.com", "support@hilton.com"],
    phones: ["1-800-445-8667", "1-800-548-8690"],
  },
  {
    chain_ID: 3,
    name: "Hyatt Hotels Corporation",
    num_hotels: 8,
    address: "150 N Riverside Plaza, Chicago, IL, USA",
    emails: ["contact@hyatt.com", "reservations@hyatt.com"],
    phones: ["1-800-323-7234", "1-888-591-1234"],
  },
  {
    chain_ID: 4,
    name: "IHG Hotels & Resorts",
    num_hotels: 9,
    address: "3 Ravinia Dr NE, Atlanta, GA, USA",
    emails: ["info@ihg.com", "support@ihg.com"],
    phones: ["1-800-465-4329", "1-877-834-3613"],
  },
  {
    chain_ID: 5,
    name: "Wyndham Hotels & Resorts",
    num_hotels: 8,
    address: "22 Sylvan Way, Parsippany, NJ, USA",
    emails: ["info@wyndham.com", "reservations@wyndham.com"],
    phones: ["1-800-466-1589", "1-877-999-3223"],
  },
];

// ─── Hotels ───────────────────────────────────────────────────────────────────

export const hotels: Hotel[] = [
  // Chain 1 — Marriott
  { hotel_ID: 101, chain_ID: 1, name: "Marriott Ottawa Downtown",     area: "Ottawa",      address: "100 Kent St, Ottawa, ON",             star_cat: 4, num_rooms: 8, manager_ID: 1001, emails: ["ottawa@marriott.com"],    phones: ["613-238-1122"] },
  { hotel_ID: 102, chain_ID: 1, name: "Marriott Ottawa East",         area: "Ottawa",      address: "200 Montreal Rd, Ottawa, ON",         star_cat: 3, num_rooms: 7, manager_ID: 1002, emails: ["ottawaeast@marriott.com"], phones: ["613-745-2112"] },
  { hotel_ID: 103, chain_ID: 1, name: "Marriott Montreal Centre",     area: "Montreal",    address: "1255 Jeanne-Mance, Montreal, QC",     star_cat: 5, num_rooms: 8, manager_ID: 1003, emails: ["montreal@marriott.com"],   phones: ["514-878-9000"] },
  { hotel_ID: 104, chain_ID: 1, name: "Marriott Toronto Harbour",     area: "Toronto",     address: "1 Harbour Sq, Toronto, ON",           star_cat: 4, num_rooms: 7, manager_ID: 1004, emails: ["toronto@marriott.com"],    phones: ["416-869-1600"] },
  { hotel_ID: 105, chain_ID: 1, name: "Marriott Vancouver Pinnacle",  area: "Vancouver",   address: "1128 W Hastings, Vancouver, BC",      star_cat: 5, num_rooms: 6, manager_ID: 1005, emails: ["vancouver@marriott.com"],  phones: ["604-684-1128"] },
  { hotel_ID: 106, chain_ID: 1, name: "Marriott Calgary Airport",     area: "Calgary",     address: "2850 Sunridge Way, Calgary, AB",      star_cat: 3, num_rooms: 6, manager_ID: 1006, emails: ["calgary@marriott.com"],    phones: ["403-273-9330"] },
  { hotel_ID: 107, chain_ID: 1, name: "Marriott Quebec City",         area: "Quebec City", address: "900 Boul Rene-Levesque, QC",          star_cat: 5, num_rooms: 5, manager_ID: 1007, emails: ["quebec@marriott.com"],     phones: ["418-647-2411"] },
  { hotel_ID: 108, chain_ID: 1, name: "Marriott Halifax Harbourfront",area: "Halifax",     address: "1919 Upper Water St, Halifax, NS",    star_cat: 4, num_rooms: 6, manager_ID: 1008, emails: ["halifax@marriott.com"],    phones: ["902-421-1700"] },
  { hotel_ID: 109, chain_ID: 1, name: "Marriott Edmonton South",      area: "Edmonton",    address: "10235 101 St, Edmonton, AB",          star_cat: 3, num_rooms: 5, manager_ID: 1009, emails: ["edmonton@marriott.com"],   phones: ["780-423-3600"] },
  { hotel_ID: 110, chain_ID: 1, name: "Marriott Winnipeg",            area: "Winnipeg",    address: "2 Lombard Pl, Winnipeg, MB",          star_cat: 2, num_rooms: 5, manager_ID: 1010, emails: ["winnipeg@marriott.com"],   phones: ["204-957-1350"] },
  // Chain 2 — Hilton
  { hotel_ID: 201, chain_ID: 2, name: "Hilton Ottawa",                area: "Ottawa",      address: "150 Albert St, Ottawa, ON",           star_cat: 4, num_rooms: 7, manager_ID: 2001, emails: ["ottawa@hilton.com"],       phones: ["613-238-1500"] },
  { hotel_ID: 202, chain_ID: 2, name: "Hilton Ottawa Airport",        area: "Ottawa",      address: "1000 Airport Pkwy, Ottawa, ON",       star_cat: 3, num_rooms: 6, manager_ID: 2002, emails: ["ottawaairport@hilton.com"],phones: ["613-738-0909"] },
  { hotel_ID: 203, chain_ID: 2, name: "Hilton Montreal Bonaventure",  area: "Montreal",    address: "900 De La Gauchetiere, Montreal",     star_cat: 5, num_rooms: 8, manager_ID: 2003, emails: ["montreal@hilton.com"],     phones: ["514-878-2332"] },
  { hotel_ID: 204, chain_ID: 2, name: "Hilton Toronto",               area: "Toronto",     address: "145 Richmond St W, Toronto, ON",      star_cat: 4, num_rooms: 7, manager_ID: 2004, emails: ["toronto@hilton.com"],      phones: ["416-869-3456"] },
  { hotel_ID: 205, chain_ID: 2, name: "Hilton Vancouver Metrotown",   area: "Vancouver",   address: "6083 McKay Ave, Burnaby, BC",         star_cat: 3, num_rooms: 6, manager_ID: 2005, emails: ["vancouver@hilton.com"],    phones: ["604-438-1200"] },
  { hotel_ID: 206, chain_ID: 2, name: "Hilton Calgary Downtown",      area: "Calgary",     address: "401 9 Ave SW, Calgary, AB",           star_cat: 4, num_rooms: 6, manager_ID: 2006, emails: ["calgary@hilton.com"],      phones: ["403-266-7331"] },
  { hotel_ID: 207, chain_ID: 2, name: "Hilton Quebec City",           area: "Quebec City", address: "1100 Boul Rene-Levesque, QC",         star_cat: 5, num_rooms: 5, manager_ID: 2007, emails: ["quebec@hilton.com"],       phones: ["418-647-2411"] },
  { hotel_ID: 208, chain_ID: 2, name: "Hilton Halifax",               area: "Halifax",     address: "1649 Hollis St, Halifax, NS",         star_cat: 3, num_rooms: 5, manager_ID: 2008, emails: ["halifax@hilton.com"],      phones: ["902-422-9221"] },
  { hotel_ID: 209, chain_ID: 2, name: "Hilton Edmonton",              area: "Edmonton",    address: "10235 101 St NW, Edmonton, AB",       star_cat: 4, num_rooms: 5, manager_ID: 2009, emails: ["edmonton@hilton.com"],     phones: ["780-428-7111"] },
  // Chain 3 — Hyatt
  { hotel_ID: 301, chain_ID: 3, name: "Hyatt Ottawa Regency",         area: "Ottawa",      address: "180 Cooper St, Ottawa, ON",           star_cat: 5, num_rooms: 6, manager_ID: 3001, emails: ["ottawa@hyatt.com"],        phones: ["613-238-1234"] },
  { hotel_ID: 302, chain_ID: 3, name: "Hyatt Montreal",               area: "Montreal",    address: "1255 Jeanne Mance, Montreal, QC",     star_cat: 4, num_rooms: 6, manager_ID: 3002, emails: ["montreal@hyatt.com"],      phones: ["514-982-9300"] },
  { hotel_ID: 303, chain_ID: 3, name: "Hyatt Toronto",                area: "Toronto",     address: "370 King St W, Toronto, ON",          star_cat: 5, num_rooms: 7, manager_ID: 3003, emails: ["toronto@hyatt.com"],       phones: ["416-343-1234"] },
  { hotel_ID: 304, chain_ID: 3, name: "Hyatt Vancouver",              area: "Vancouver",   address: "655 Burrard St, Vancouver, BC",       star_cat: 4, num_rooms: 6, manager_ID: 3004, emails: ["vancouver@hyatt.com"],     phones: ["604-683-1234"] },
  { hotel_ID: 305, chain_ID: 3, name: "Hyatt Calgary",                area: "Calgary",     address: "700 Centre St S, Calgary, AB",        star_cat: 3, num_rooms: 6, manager_ID: 3005, emails: ["calgary@hyatt.com"],       phones: ["403-717-1234"] },
  { hotel_ID: 306, chain_ID: 3, name: "Hyatt Quebec City",            area: "Quebec City", address: "700 Grande Allee E, QC",              star_cat: 5, num_rooms: 5, manager_ID: 3006, emails: ["quebec@hyatt.com"],        phones: ["418-647-1234"] },
  { hotel_ID: 307, chain_ID: 3, name: "Hyatt Halifax",                area: "Halifax",     address: "5855 Terminal Rd, Halifax, NS",       star_cat: 3, num_rooms: 5, manager_ID: 3007, emails: ["halifax@hyatt.com"],       phones: ["902-421-1234"] },
  { hotel_ID: 308, chain_ID: 3, name: "Hyatt Winnipeg",               area: "Winnipeg",    address: "350 St Mary Ave, Winnipeg, MB",       star_cat: 4, num_rooms: 5, manager_ID: 3008, emails: ["winnipeg@hyatt.com"],      phones: ["204-942-1234"] },
  // Chain 4 — IHG
  { hotel_ID: 401, chain_ID: 4, name: "IHG Holiday Inn Ottawa",       area: "Ottawa",      address: "350 Dalhousie St, Ottawa, ON",        star_cat: 3, num_rooms: 6, manager_ID: 4001, emails: ["ottawa@ihg.com"],          phones: ["613-241-1000"] },
  { hotel_ID: 402, chain_ID: 4, name: "IHG Crowne Plaza Ottawa",      area: "Ottawa",      address: "101 Lyon St N, Ottawa, ON",           star_cat: 4, num_rooms: 6, manager_ID: 4002, emails: ["crowneplaza@ihg.com"],     phones: ["613-237-3600"] },
  { hotel_ID: 403, chain_ID: 4, name: "IHG Holiday Inn Montreal",     area: "Montreal",    address: "999 St-Urbain, Montreal, QC",         star_cat: 3, num_rooms: 6, manager_ID: 4003, emails: ["montreal@ihg.com"],        phones: ["514-878-9000"] },
  { hotel_ID: 404, chain_ID: 4, name: "IHG Crowne Plaza Toronto",     area: "Toronto",     address: "225 Front St W, Toronto, ON",         star_cat: 4, num_rooms: 7, manager_ID: 4004, emails: ["toronto@ihg.com"],         phones: ["416-597-1400"] },
  { hotel_ID: 405, chain_ID: 4, name: "IHG Vancouver",                area: "Vancouver",   address: "1133 W Hastings, Vancouver, BC",      star_cat: 3, num_rooms: 6, manager_ID: 4005, emails: ["vancouver@ihg.com"],       phones: ["604-689-9211"] },
  { hotel_ID: 406, chain_ID: 4, name: "IHG Calgary",                  area: "Calgary",     address: "1414 Centre St N, Calgary, AB",       star_cat: 4, num_rooms: 6, manager_ID: 4006, emails: ["calgary@ihg.com"],         phones: ["403-230-1999"] },
  { hotel_ID: 407, chain_ID: 4, name: "IHG Quebec City",              area: "Quebec City", address: "3031 Boul Laurier, QC",               star_cat: 3, num_rooms: 5, manager_ID: 4007, emails: ["quebec@ihg.com"],          phones: ["418-653-4901"] },
  { hotel_ID: 408, chain_ID: 4, name: "IHG Halifax",                  area: "Halifax",     address: "980 Robie St, Halifax, NS",           star_cat: 4, num_rooms: 5, manager_ID: 4008, emails: ["halifax@ihg.com"],         phones: ["902-423-1161"] },
  { hotel_ID: 409, chain_ID: 4, name: "IHG Edmonton",                 area: "Edmonton",    address: "4440 Gateway Blvd, Edmonton, AB",     star_cat: 2, num_rooms: 5, manager_ID: 4009, emails: ["edmonton@ihg.com"],        phones: ["780-438-1222"] },
  // Chain 5 — Wyndham
  { hotel_ID: 501, chain_ID: 5, name: "Wyndham Ottawa Grand",         area: "Ottawa",      address: "240 Sparks St, Ottawa, ON",           star_cat: 3, num_rooms: 6, manager_ID: 5001, emails: ["ottawa@wyndham.com"],      phones: ["613-234-0000"] },
  { hotel_ID: 502, chain_ID: 5, name: "Wyndham Montreal",             area: "Montreal",    address: "360 St-Antoine W, Montreal, QC",      star_cat: 4, num_rooms: 6, manager_ID: 5002, emails: ["montreal@wyndham.com"],    phones: ["514-395-0000"] },
  { hotel_ID: 503, chain_ID: 5, name: "Wyndham Toronto",              area: "Toronto",     address: "600 King St W, Toronto, ON",          star_cat: 3, num_rooms: 6, manager_ID: 5003, emails: ["toronto@wyndham.com"],     phones: ["416-971-0000"] },
  { hotel_ID: 504, chain_ID: 5, name: "Wyndham Vancouver",            area: "Vancouver",   address: "900 W Georgia St, Vancouver, BC",     star_cat: 4, num_rooms: 6, manager_ID: 5004, emails: ["vancouver@wyndham.com"],   phones: ["604-682-0000"] },
  { hotel_ID: 505, chain_ID: 5, name: "Wyndham Calgary",              area: "Calgary",     address: "320 4 Ave SW, Calgary, AB",           star_cat: 3, num_rooms: 5, manager_ID: 5005, emails: ["calgary@wyndham.com"],     phones: ["403-264-0000"] },
  { hotel_ID: 506, chain_ID: 5, name: "Wyndham Quebec City",          area: "Quebec City", address: "500 Grande Allee E, QC",              star_cat: 4, num_rooms: 5, manager_ID: 5006, emails: ["quebec@wyndham.com"],      phones: ["418-647-0000"] },
  { hotel_ID: 507, chain_ID: 5, name: "Wyndham Halifax",              area: "Halifax",     address: "1770 Granville St, Halifax, NS",      star_cat: 3, num_rooms: 5, manager_ID: 5007, emails: ["halifax@wyndham.com"],     phones: ["902-422-0000"] },
  { hotel_ID: 508, chain_ID: 5, name: "Wyndham Winnipeg",             area: "Winnipeg",    address: "2 Lombard Pl, Winnipeg, MB",          star_cat: 2, num_rooms: 5, manager_ID: 5008, emails: ["winnipeg@wyndham.com"],    phones: ["204-957-0000"] },
];

// ─── Rooms ────────────────────────────────────────────────────────────────────

let roomIdCounter = 1;
function mkRoom(
  hotel_ID: number,
  room_num: number,
  price: number,
  capacity: Room["capacity"],
  view_type: Room["view_type"],
  extendable: boolean,
  damaged: boolean,
  amenities: string[],
  damage_des: string | null = null
): Room {
  return {
    room_ID: roomIdCounter++,
    hotel_ID,
    room_num,
    price,
    capacity,
    view_type,
    extendable,
    damaged,
    damage_des,
    amenities,
  };
}

export const rooms: Room[] = [
  // ── Hotel 101 Marriott Ottawa Downtown (4★)
  mkRoom(101, 101, 120, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(101, 102, 180, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(101, 103, 240, "triple",   "mountain", true,  false, ["TV", "WiFi", "AC", "Fridge", "Balcony"]),
  mkRoom(101, 104, 300, "quad",     "mountain", false, false, ["TV", "WiFi", "AC", "Fridge", "Jacuzzi"]),
  mkRoom(101, 105, 450, "suite",    "mountain", false, false, ["TV", "WiFi", "AC", "Fridge", "Jacuzzi", "Living room"]),
  mkRoom(101, 106, 130, "single",   "none",     false, true,  ["TV", "WiFi"], "Cracked mirror"),
  mkRoom(101, 107, 190, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(101, 108, 250, "triple",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),

  // ── Hotel 102 Marriott Ottawa East (3★)
  mkRoom(102, 201, 90,  "single",   "none",     false, false, ["TV", "WiFi"]),
  mkRoom(102, 202, 140, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),
  mkRoom(102, 203, 190, "triple",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(102, 204, 240, "quad",     "none",     false, true,  ["TV", "WiFi"], "Broken AC unit"),
  mkRoom(102, 205, 350, "suite",    "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(102, 206, 95,  "single",   "none",     false, false, ["TV", "WiFi"]),
  mkRoom(102, 207, 145, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),

  // ── Hotel 103 Marriott Montreal Centre (5★)
  mkRoom(103, 301, 200, "single",   "none",     false, false, ["TV", "WiFi", "AC", "Minibar"]),
  mkRoom(103, 302, 300, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Minibar", "Fridge"]),
  mkRoom(103, 303, 400, "triple",   "mountain", true,  false, ["TV", "WiFi", "AC", "Minibar", "Balcony"]),
  mkRoom(103, 304, 500, "quad",     "mountain", false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi"]),
  mkRoom(103, 305, 800, "suite",    "mountain", false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi", "Living room", "Kitchen"]),
  mkRoom(103, 306, 210, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(103, 307, 310, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(103, 308, 410, "triple",   "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),

  // ── Hotel 201 Hilton Ottawa (4★)
  mkRoom(201, 101, 130, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(201, 102, 200, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(201, 103, 270, "triple",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(201, 104, 340, "quad",     "mountain", false, false, ["TV", "WiFi", "AC", "Jacuzzi"]),
  mkRoom(201, 105, 500, "suite",    "mountain", false, false, ["TV", "WiFi", "AC", "Jacuzzi", "Living room"]),
  mkRoom(201, 106, 140, "single",   "none",     false, true,  ["TV", "WiFi"], "Stained carpet"),
  mkRoom(201, 107, 210, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),

  // ── Hotel 202 Hilton Ottawa Airport (3★)
  mkRoom(202, 101, 100, "single",   "none",     false, false, ["TV", "WiFi"]),
  mkRoom(202, 102, 155, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),
  mkRoom(202, 103, 210, "triple",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(202, 104, 270, "quad",     "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(202, 105, 380, "suite",    "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(202, 106, 105, "single",   "none",     false, false, ["TV", "WiFi"]),

  // ── Hotel 301 Hyatt Ottawa Regency (5★)
  mkRoom(301, 101, 220, "single",   "none",     false, false, ["TV", "WiFi", "AC", "Minibar"]),
  mkRoom(301, 102, 330, "double",   "mountain", true,  false, ["TV", "WiFi", "AC", "Minibar", "Balcony"]),
  mkRoom(301, 103, 440, "triple",   "mountain", true,  false, ["TV", "WiFi", "AC", "Minibar", "Balcony"]),
  mkRoom(301, 104, 550, "quad",     "mountain", false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi"]),
  mkRoom(301, 105, 900, "suite",    "mountain", false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi", "Living room", "Kitchen"]),
  mkRoom(301, 106, 230, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),

  // ── Hotel 401 IHG Holiday Inn Ottawa (3★)
  mkRoom(401, 101, 85,  "single",   "none",     false, false, ["TV", "WiFi"]),
  mkRoom(401, 102, 130, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),
  mkRoom(401, 103, 175, "triple",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(401, 104, 220, "quad",     "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(401, 105, 310, "suite",    "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(401, 106, 90,  "single",   "none",     false, true,  ["TV", "WiFi"], "Broken window latch"),

  // ── Hotel 402 IHG Crowne Plaza Ottawa (4★)
  mkRoom(402, 101, 140, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(402, 102, 210, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(402, 103, 280, "triple",   "mountain", true,  false, ["TV", "WiFi", "AC", "Fridge", "Balcony"]),
  mkRoom(402, 104, 350, "quad",     "mountain", false, false, ["TV", "WiFi", "AC", "Jacuzzi"]),
  mkRoom(402, 105, 520, "suite",    "mountain", false, false, ["TV", "WiFi", "AC", "Jacuzzi", "Living room"]),
  mkRoom(402, 106, 150, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),

  // ── Hotel 501 Wyndham Ottawa Grand (3★)
  mkRoom(501, 101, 80,  "single",   "none",     false, false, ["TV", "WiFi"]),
  mkRoom(501, 102, 125, "double",   "none",     true,  false, ["TV", "WiFi", "AC"]),
  mkRoom(501, 103, 165, "triple",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(501, 104, 210, "quad",     "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(501, 105, 300, "suite",    "none",     false, false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(501, 106, 85,  "single",   "none",     false, false, ["TV", "WiFi"]),

  // ── Hotel 104 Marriott Toronto Harbour (4★)
  mkRoom(104, 101, 160, "single",   "sea",      false, false, ["TV", "WiFi", "AC"]),
  mkRoom(104, 102, 240, "double",   "sea",      true,  false, ["TV", "WiFi", "AC", "Fridge"]),
  mkRoom(104, 103, 320, "triple",   "sea",      true,  false, ["TV", "WiFi", "AC", "Fridge", "Balcony"]),
  mkRoom(104, 104, 400, "quad",     "sea",      false, false, ["TV", "WiFi", "AC", "Jacuzzi"]),
  mkRoom(104, 105, 600, "suite",    "sea",      false, false, ["TV", "WiFi", "AC", "Jacuzzi", "Living room"]),
  mkRoom(104, 106, 165, "single",   "none",     false, false, ["TV", "WiFi", "AC"]),
  mkRoom(104, 107, 245, "double",   "none",     true,  false, ["TV", "WiFi", "AC", "Fridge"]),

  // ── Hotel 105 Marriott Vancouver Pinnacle (5★)
  mkRoom(105, 101, 250, "single",   "sea",      false, false, ["TV", "WiFi", "AC", "Minibar"]),
  mkRoom(105, 102, 380, "double",   "sea",      true,  false, ["TV", "WiFi", "AC", "Minibar", "Balcony"]),
  mkRoom(105, 103, 500, "triple",   "sea",      true,  false, ["TV", "WiFi", "AC", "Minibar", "Balcony"]),
  mkRoom(105, 104, 620, "quad",     "sea",      false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi"]),
  mkRoom(105, 105, 950, "suite",    "sea",      false, false, ["TV", "WiFi", "AC", "Minibar", "Jacuzzi", "Living room", "Kitchen"]),
  mkRoom(105, 106, 260, "single",   "mountain", false, false, ["TV", "WiFi", "AC", "Minibar"]),
];

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers: Customer[] = [
  { customer_ID: 1,  name: "Alice Martin",    address: "12 Maple St, Ottawa, ON",       ID_type: "SIN",      ID_num: "123-456-789", date: "2022-03-10" },
  { customer_ID: 2,  name: "Bob Tremblay",    address: "45 Oak Ave, Montreal, QC",      ID_type: "SIN",      ID_num: "234-567-890", date: "2021-07-22" },
  { customer_ID: 3,  name: "Carol Singh",     address: "78 Pine Rd, Toronto, ON",       ID_type: "Passport", ID_num: "CA9012345",   date: "2023-01-05" },
  { customer_ID: 4,  name: "David Lee",       address: "90 Elm Blvd, Vancouver, BC",    ID_type: "DL",       ID_num: "BC-4839201",  date: "2022-11-30" },
  { customer_ID: 5,  name: "Eva Nguyen",      address: "33 Birch Cres, Calgary, AB",    ID_type: "SIN",      ID_num: "345-678-901", date: "2020-06-15" },
  { customer_ID: 6,  name: "Frank Okafor",    address: "55 Cedar Dr, Ottawa, ON",       ID_type: "Passport", ID_num: "NG8123456",   date: "2023-04-18" },
  { customer_ID: 7,  name: "Grace Kim",       address: "102 Willow Way, Toronto, ON",   ID_type: "SIN",      ID_num: "456-789-012", date: "2021-09-09" },
  { customer_ID: 8,  name: "Hiro Tanaka",     address: "88 Spruce Ln, Ottawa, ON",      ID_type: "Passport", ID_num: "JP5678901",   date: "2022-12-01" },
  { customer_ID: 9,  name: "Isabella Rossi",  address: "21 Aspen Ct, Montreal, QC",     ID_type: "SIN",      ID_num: "567-890-123", date: "2023-06-20" },
  { customer_ID: 10, name: "James Wilson",    address: "67 Fir St, Vancouver, BC",      ID_type: "DL",       ID_num: "BC-7654321",  date: "2020-02-14" },
  { customer_ID: 11, name: "Karen Dupont",    address: "14 Larch Ave, Quebec City, QC", ID_type: "SIN",      ID_num: "678-901-234", date: "2021-03-03" },
  { customer_ID: 12, name: "Liam O'Brien",    address: "39 Poplar Blvd, Halifax, NS",   ID_type: "Passport", ID_num: "IE3456789",   date: "2022-08-08" },
  { customer_ID: 13, name: "Mia Chen",        address: "53 Hickory Rd, Ottawa, ON",     ID_type: "SIN",      ID_num: "789-012-345", date: "2023-09-11" },
  { customer_ID: 14, name: "Nathan Brown",    address: "76 Magnolia St, Calgary, AB",   ID_type: "DL",       ID_num: "AB-9182736",  date: "2021-05-27" },
  { customer_ID: 15, name: "Olivia Fontaine", address: "8 Chestnut Pl, Ottawa, ON",     ID_type: "SIN",      ID_num: "890-123-456", date: "2020-10-10" },
];

// ─── Employees ────────────────────────────────────────────────────────────────

export const employees: Employee[] = [
  { employee_ID: 1001, hotel_ID: 101, name: "Daniel Carter",   address: "5 Main St, Ottawa, ON",     SSN: "SSN-1001", position: "Manager"        },
  { employee_ID: 1002, hotel_ID: 102, name: "Sophie Laroche",  address: "22 Rue des Pins, Ottawa, ON",SSN: "SSN-1002", position: "Manager"        },
  { employee_ID: 1003, hotel_ID: 103, name: "Pierre Gagnon",   address: "10 Rue Ste-Catherine, QC",  SSN: "SSN-1003", position: "Manager"        },
  { employee_ID: 1004, hotel_ID: 104, name: "Emily Zhang",     address: "55 Bay St, Toronto, ON",    SSN: "SSN-1004", position: "Manager"        },
  { employee_ID: 1005, hotel_ID: 105, name: "Marcus Lee",      address: "88 Burrard, Vancouver, BC", SSN: "SSN-1005", position: "Manager"        },
  { employee_ID: 1006, hotel_ID: 106, name: "Rachel Adams",    address: "12 Bow Tr, Calgary, AB",    SSN: "SSN-1006", position: "Manager"        },
  { employee_ID: 1007, hotel_ID: 107, name: "Luc Beaumont",    address: "3 Grande Allee, QC",        SSN: "SSN-1007", position: "Manager"        },
  { employee_ID: 1008, hotel_ID: 108, name: "Fiona MacLeod",   address: "9 Barrington St, NS",       SSN: "SSN-1008", position: "Manager"        },
  { employee_ID: 1009, hotel_ID: 109, name: "Omar Sheikh",     address: "77 Jasper Ave, Edmonton, AB",SSN: "SSN-1009", position: "Manager"       },
  { employee_ID: 1010, hotel_ID: 110, name: "Nina Kowalski",   address: "14 Portage Ave, Winnipeg",  SSN: "SSN-1010", position: "Manager"        },
  { employee_ID: 2001, hotel_ID: 201, name: "Tom Richards",    address: "33 Albert St, Ottawa, ON",  SSN: "SSN-2001", position: "Manager"        },
  { employee_ID: 2002, hotel_ID: 202, name: "Sara Benoit",     address: "44 Airport Rd, Ottawa, ON", SSN: "SSN-2002", position: "Manager"        },
  { employee_ID: 3001, hotel_ID: 301, name: "James Cooper",    address: "18 Cooper St, Ottawa, ON",  SSN: "SSN-3001", position: "Manager"        },
  { employee_ID: 4001, hotel_ID: 401, name: "Linda Marsh",     address: "35 Dalhousie, Ottawa, ON",  SSN: "SSN-4001", position: "Manager"        },
  { employee_ID: 4002, hotel_ID: 402, name: "Kevin Osei",      address: "101 Lyon St, Ottawa, ON",   SSN: "SSN-4002", position: "Manager"        },
  { employee_ID: 5001, hotel_ID: 501, name: "Anna Petrova",    address: "24 Sparks St, Ottawa, ON",  SSN: "SSN-5001", position: "Manager"        },
  // Front desk employees at Ottawa hotels
  { employee_ID: 9001, hotel_ID: 101, name: "Chris Doe",       address: "11 Elgin St, Ottawa, ON",   SSN: "SSN-9001", position: "Front Desk"     },
  { employee_ID: 9002, hotel_ID: 101, name: "Amy Walters",     address: "7 Bank St, Ottawa, ON",     SSN: "SSN-9002", position: "Front Desk"     },
  { employee_ID: 9003, hotel_ID: 201, name: "Joe Martin",      address: "19 Albert St, Ottawa, ON",  SSN: "SSN-9003", position: "Front Desk"     },
  { employee_ID: 9004, hotel_ID: 301, name: "Nadia Hassan",    address: "27 Cooper St, Ottawa, ON",  SSN: "SSN-9004", position: "Front Desk"     },
  { employee_ID: 9005, hotel_ID: 401, name: "Ryan Scott",      address: "42 Dalhousie, Ottawa, ON",  SSN: "SSN-9005", position: "Front Desk"     },
];

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings: Booking[] = [
  { booking_ID: 1, customer_ID: 1,  room_ID: 1,  hotel_ID: 101, start_date: "2026-04-10", end_date: "2026-04-14", status: "active",   customer_name: "Alice Martin",   room_num: 101, hotel_name: "Marriott Ottawa Downtown" },
  { booking_ID: 2, customer_ID: 2,  room_ID: 9,  hotel_ID: 102, start_date: "2026-04-12", end_date: "2026-04-15", status: "active",   customer_name: "Bob Tremblay",   room_num: 201, hotel_name: "Marriott Ottawa East" },
  { booking_ID: 3, customer_ID: 3,  room_ID: 24, hotel_ID: 201, start_date: "2026-04-08", end_date: "2026-04-11", status: "active",   customer_name: "Carol Singh",    room_num: 101, hotel_name: "Hilton Ottawa" },
  { booking_ID: 4, customer_ID: 6,  room_ID: 37, hotel_ID: 301, start_date: "2026-04-20", end_date: "2026-04-25", status: "active",   customer_name: "Frank Okafor",   room_num: 101, hotel_name: "Hyatt Ottawa Regency" },
  { booking_ID: 5, customer_ID: 8,  room_ID: 43, hotel_ID: 401, start_date: "2026-05-01", end_date: "2026-05-05", status: "active",   customer_name: "Hiro Tanaka",    room_num: 101, hotel_name: "IHG Holiday Inn Ottawa" },
  { booking_ID: 6, customer_ID: 13, room_ID: 49, hotel_ID: 402, start_date: "2026-05-10", end_date: "2026-05-14", status: "active",   customer_name: "Mia Chen",       room_num: 101, hotel_name: "IHG Crowne Plaza Ottawa" },
  { booking_ID: 7, customer_ID: 15, room_ID: 55, hotel_ID: 501, start_date: "2026-04-15", end_date: "2026-04-18", status: "active",   customer_name: "Olivia Fontaine",room_num: 101, hotel_name: "Wyndham Ottawa Grand" },
  { booking_ID: 8, customer_ID: 4,  room_ID: 62, hotel_ID: 104, start_date: "2026-03-01", end_date: "2026-03-05", status: "archived", customer_name: "David Lee",      room_num: 101, hotel_name: "Marriott Toronto Harbour" },
  { booking_ID: 9, customer_ID: 5,  room_ID: 3,  hotel_ID: 101, start_date: "2026-03-10", end_date: "2026-03-12", status: "archived", customer_name: "Eva Nguyen",     room_num: 103, hotel_name: "Marriott Ottawa Downtown" },
];

// ─── Rentings ─────────────────────────────────────────────────────────────────

export const rentings: Renting[] = [
  { renting_ID: 1, booking_ID: 8, customer_ID: 4,  room_ID: 62, hotel_ID: 104, employee_ID: 1004, start_date: "2026-03-01", end_date: "2026-03-05", payment: 640,  customer_name: "David Lee",    room_num: 101, hotel_name: "Marriott Toronto Harbour",    employee_name: "Emily Zhang" },
  { renting_ID: 2, booking_ID: 9, customer_ID: 5,  room_ID: 3,  hotel_ID: 101, employee_ID: 9001, start_date: "2026-03-10", end_date: "2026-03-12", payment: 480,  customer_name: "Eva Nguyen",   room_num: 103, hotel_name: "Marriott Ottawa Downtown",    employee_name: "Chris Doe" },
  { renting_ID: 3, booking_ID: null, customer_ID: 7, room_ID: 10, hotel_ID: 102, employee_ID: 1002, start_date: "2026-03-15", end_date: "2026-03-17", payment: 280,  customer_name: "Grace Kim",    room_num: 202, hotel_name: "Marriott Ottawa East",        employee_name: "Sophie Laroche" },
  { renting_ID: 4, booking_ID: null, customer_ID: 11, room_ID: 25, hotel_ID: 201, employee_ID: 9003, start_date: "2026-03-20", end_date: "2026-03-22", payment: null, customer_name: "Karen Dupont", room_num: 102, hotel_name: "Hilton Ottawa",               employee_name: "Joe Martin" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const AREAS = [
  "Ottawa", "Montreal", "Toronto", "Vancouver",
  "Calgary", "Quebec City", "Halifax", "Edmonton", "Winnipeg",
];

export const CAPACITIES: Room["capacity"][] = [
  "single", "double", "triple", "quad", "suite",
];

export const CAPACITY_NUMERIC: Record<Room["capacity"], number> = {
  single: 1,
  double: 2,
  triple: 3,
  quad:   4,
  suite:  5,
};
