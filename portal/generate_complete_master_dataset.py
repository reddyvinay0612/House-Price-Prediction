# -*- coding: utf-8 -*-
"""
Ultimate All-India Master District Dataset Generator
Covers all 28 States and 8 Union Territories with 100% of all official districts.
"""

import json
import os
import re

STATE_MAP = {}

def slugify(state, name):
    s = state[:2].lower()
    clean = re.sub(r'[^a-zA-Z0-9]+', '-', name).strip('-').lower()
    return f"{s}-{clean}"

def add_dist(state, name, avg_rate, growth, localities):
    if state not in STATE_MAP:
        STATE_MAP[state] = []
    STATE_MAP[state].append({
        "name": name,
        "avgRateSqft": avg_rate,
        "baseGrowth": growth,
        "localities": [{"name": loc[0], "avgRate": loc[1], "tier": loc[2]} for loc in localities]
    })

# Helper to add standard district if not explicitly detailed
def add_std_dist(state, name, avg_rate, growth, custom_locs=None):
    if custom_locs:
        locs = custom_locs
    else:
        clean_name = name.split("(")[0].strip()
        locs = [
            (f"{clean_name} City Center / Main Market", int(avg_rate * 1.25), "Commercial Core"),
            (f"Civil Lines / Collectorate Area", int(avg_rate * 1.15), "Administrative Zone"),
            (f"Station Road / Bus Stand Corridor", int(avg_rate * 1.05), "Transit & Trade"),
            (f"Housing Board Colony / Extension", int(avg_rate * 0.95), "Residential Area"),
            (f"Highway / Bypass Growth Axis", int(avg_rate * 0.85), "Expansion Corridor"),
            (f"Other Localities", int(avg_rate * 0.75), "Periphery & Greater Region")
        ]
    add_dist(state, name, avg_rate, growth, locs)

# ==========================================
# 1. ANDHRA PRADESH (26 Districts)
# ==========================================
ap_list = [
    ("Alluri Sitharama Raju (Paderu)", 2800, "5.2% YoY"),
    ("Anakapalli", 3800, "7.4% YoY"),
    ("Ananthapuramu", 3500, "5.8% YoY"),
    ("Annamayya (Rayachoti)", 3100, "5.4% YoY"),
    ("Bapatla", 3300, "6.0% YoY"),
    ("Chittoor", 3600, "6.3% YoY"),
    ("Dr. B.R. Ambedkar Konaseema (Amalapuram)", 3400, "5.9% YoY"),
    ("East Godavari (Rajahmundry)", 4500, "7.8% YoY"),
    ("Eluru", 3500, "5.7% YoY"),
    ("Guntur", 4200, "6.8% YoY"),
    ("Kakinada", 4600, "7.5% YoY"),
    ("Krishna (Machilipatnam)", 3400, "6.1% YoY"),
    ("Kurnool", 3700, "6.0% YoY"),
    ("Nandyal", 3300, "5.6% YoY"),
    ("NTR (Vijayawada Outer)", 4900, "7.6% YoY"),
    ("Palnadu (Narasaraopet)", 3200, "5.4% YoY"),
    ("Parvathipuram Manyam", 2700, "4.8% YoY"),
    ("Prakasam (Ongole)", 3600, "6.2% YoY"),
    ("Sri Potti Sriramulu Nellore", 3800, "6.0% YoY"),
    ("Sri Sathya Sai (Puttaparthi)", 3400, "5.8% YoY"),
    ("Srikakulam", 3300, "5.5% YoY"),
    ("Tirupati", 4600, "7.9% YoY"),
    ("Visakhapatnam (Vizag Non-Metro Belt)", 5600, "8.9% YoY"),
    ("Vizianagaram", 3400, "5.8% YoY"),
    ("West Godavari (Bhimavaram)", 3800, "6.5% YoY"),
    ("YSR Kadapa", 3500, "5.6% YoY")
]
for name, rate, growth in ap_list:
    add_std_dist("Andhra Pradesh", name, rate, growth)

# ==========================================
# 2. ARUNACHAL PRADESH (26 Districts)
# ==========================================
ar_list = [
    ("Itanagar Capital Complex", 3900, "6.2% YoY"),
    ("Tawang", 3400, "5.5% YoY"),
    ("East Siang (Pasighat)", 3200, "5.8% YoY"),
    ("West Kameng (Bomdila)", 3000, "5.1% YoY"),
    ("Lower Subansiri (Ziro)", 3100, "5.7% YoY"),
    ("Papum Pare (Yupia)", 3300, "5.6% YoY"),
    ("Namsai", 2900, "5.4% YoY"),
    ("Changlang", 2700, "4.8% YoY"),
    ("Lohit (Tezu)", 2800, "5.0% YoY"),
    ("Lower Dibang Valley (Roing)", 2900, "5.2% YoY"),
    ("West Siang (Aalo)", 2900, "5.0% YoY"),
    ("Upper Subansiri (Daporijo)", 2700, "4.7% YoY"),
    ("Tirap (Khonsa)", 2600, "4.5% YoY"),
    ("Longding", 2500, "4.4% YoY"),
    ("Upper Siang (Yingkiong)", 2600, "4.6% YoY"),
    ("Dibang Valley (Anini)", 2500, "4.5% YoY"),
    ("Anjaw (Hawai)", 2400, "4.3% YoY"),
    ("East Kameng (Seppa)", 2700, "4.7% YoY"),
    ("Kurung Kumey (Koloriang)", 2400, "4.2% YoY"),
    ("Kra Daadi (Jamin)", 2400, "4.2% YoY"),
    ("Lower Siang (Likabali)", 2700, "4.8% YoY"),
    ("Lepa Rada (Basar)", 2700, "4.8% YoY"),
    ("Shi Yomi (Tato / Mechuka)", 2500, "4.4% YoY"),
    ("Kamle (Raga)", 2500, "4.4% YoY"),
    ("Pakke Kessang (Lemmi)", 2600, "4.6% YoY"),
    ("Siang (Boleng)", 2600, "4.6% YoY")
]
for name, rate, growth in ar_list:
    add_std_dist("Arunachal Pradesh", name, rate, growth)

# ==========================================
# 3. ASSAM (35 Districts)
# ==========================================
as_list = [
    ("Guwahati (Kamrup Metropolitan)", 5200, "8.1% YoY"),
    ("Kamrup (Amingaon)", 3800, "6.8% YoY"),
    ("Dibrugarh", 4100, "6.5% YoY"),
    ("Silchar (Cachar)", 3700, "6.0% YoY"),
    ("Jorhat", 3900, "6.3% YoY"),
    ("Nagaon", 3400, "5.7% YoY"),
    ("Sonitpur (Tezpur)", 3600, "6.1% YoY"),
    ("Tinsukia", 3600, "5.9% YoY"),
    ("Bongaigaon", 3300, "5.6% YoY"),
    ("Barpeta", 3000, "5.2% YoY"),
    ("Sivasagar", 3500, "5.8% YoY"),
    ("Golaghat", 3200, "5.4% YoY"),
    ("Darrang (Mangaldai)", 2900, "5.1% YoY"),
    ("Morigaon", 2800, "5.0% YoY"),
    ("Nalbari", 3000, "5.3% YoY"),
    ("Dhubri", 2800, "4.8% YoY"),
    ("Goalpara", 2900, "5.0% YoY"),
    ("Karimganj", 3000, "5.1% YoY"),
    ("Hailakandi", 2800, "4.9% YoY"),
    ("Lakhimpur (North Lakhimpur)", 3100, "5.3% YoY"),
    ("Dhemaji", 2700, "4.7% YoY"),
    ("Karbi Anglong (Diphu)", 2900, "5.0% YoY"),
    ("West Karbi Anglong (Hamren)", 2500, "4.5% YoY"),
    ("Dima Hasao (Haflong)", 3000, "5.2% YoY"),
    ("Kokrajhar", 3100, "5.3% YoY"),
    ("Chirang (Kajalgaon)", 2700, "4.8% YoY"),
    ("Baksa (Musalpur)", 2600, "4.7% YoY"),
    ("Udalguri", 2800, "4.9% YoY"),
    ("Biswanath (Biswanath Chariali)", 3000, "5.2% YoY"),
    ("Charaideo (Sonari)", 2900, "5.0% YoY"),
    ("Hojai", 3100, "5.4% YoY"),
    ("Majuli", 2800, "5.1% YoY"),
    ("South Salmara-Mankachar", 2400, "4.3% YoY"),
    ("Bajali (Pathsala)", 3000, "5.2% YoY"),
    ("Tamulpur", 2600, "4.6% YoY")
]
for name, rate, growth in as_list:
    add_std_dist("Assam", name, rate, growth)

# ==========================================
# 4. BIHAR (38 Districts)
# ==========================================
br_list = [
    ("Patna (Non-Metro Outer)", 5100, "7.8% YoY"),
    ("Gaya", 3600, "6.3% YoY"),
    ("Muzaffarpur", 3700, "6.5% YoY"),
    ("Bhagalpur", 3500, "6.1% YoY"),
    ("Darbhanga", 3400, "6.2% YoY"),
    ("Purnia", 3200, "5.8% YoY"),
    ("Begusarai", 3300, "5.7% YoY"),
    ("Arrah (Bhojpur)", 3200, "5.6% YoY"),
    ("Nalanda (Bihar Sharif / Rajgir)", 3400, "6.4% YoY"),
    ("Katihar", 3000, "5.3% YoY"),
    ("Munger", 3200, "5.4% YoY"),
    ("Chhapra (Saran)", 3100, "5.3% YoY"),
    ("Sasaram (Rohtas)", 3000, "5.2% YoY"),
    ("Samastipur", 3100, "5.4% YoY"),
    ("Motihari (East Champaran)", 3000, "5.2% YoY"),
    ("Bettiah (West Champaran)", 2900, "5.0% YoY"),
    ("Siwan", 3100, "5.4% YoY"),
    ("Gopalganj", 2900, "5.1% YoY"),
    ("Saharsa", 2900, "5.0% YoY"),
    ("Sitamarhi", 2900, "5.0% YoY"),
    ("Vaishali (Hajipur)", 3800, "7.0% YoY"),
    ("Madhubani", 2800, "4.9% YoY"),
    ("Araria", 2600, "4.6% YoY"),
    ("Kishanganj", 2800, "5.0% YoY"),
    ("Supaul", 2700, "4.7% YoY"),
    ("Madhepura", 2700, "4.8% YoY"),
    ("Buxar", 3000, "5.3% YoY"),
    ("Jehanabad", 2800, "5.0% YoY"),
    ("Aurangabad (Bihar)", 2900, "5.1% YoY"),
    ("Nawada", 2800, "4.9% YoY"),
    ("Jamui", 2700, "4.8% YoY"),
    ("Banka", 2600, "4.6% YoY"),
    ("Lakhisarai", 2800, "4.9% YoY"),
    ("Sheikhpura", 2600, "4.6% YoY"),
    ("Khagaria", 2700, "4.7% YoY"),
    ("Kaimur (Bhabua)", 2700, "4.7% YoY"),
    ("Arwal", 2500, "4.5% YoY"),
    ("Sheohar", 2400, "4.3% YoY")
]
for name, rate, growth in br_list:
    add_std_dist("Bihar", name, rate, growth)

# ==========================================
# 5. CHHATTISGARH (33 Districts)
# ==========================================
cg_list = [
    ("Raipur (Outer & Non-Metro)", 4600, "7.6% YoY"),
    ("Bhilai - Durg", 3800, "6.4% YoY"),
    ("Bilaspur", 3700, "6.2% YoY"),
    ("Korba", 3300, "5.7% YoY"),
    ("Rajnandgaon", 3200, "5.6% YoY"),
    ("Raigarh", 3400, "5.9% YoY"),
    ("Jagdalpur (Bastar)", 3300, "5.8% YoY"),
    ("Ambikapur (Surguja)", 3200, "5.5% YoY"),
    ("Dhamtari", 3100, "5.4% YoY"),
    ("Mahasamund", 2900, "5.1% YoY"),
    ("Janjgir-Champa", 3000, "5.2% YoY"),
    ("Kabirdham (Kawardha)", 2800, "4.9% YoY"),
    ("Kanker (North Bastar)", 2800, "4.9% YoY"),
    ("Dantewada (South Bastar)", 2700, "4.7% YoY"),
    ("Balod", 2800, "4.8% YoY"),
    ("Bemetara", 2800, "4.8% YoY"),
    ("Baloda Bazar-Bhatapara", 3000, "5.2% YoY"),
    ("Gariaband", 2600, "4.5% YoY"),
    ("Jashpur", 2700, "4.6% YoY"),
    ("Koriya (Baikunthpur)", 2700, "4.6% YoY"),
    ("Surajpur", 2700, "4.6% YoY"),
    ("Balrampur-Ramanujganj", 2600, "4.4% YoY"),
    ("Kondagaon", 2800, "4.8% YoY"),
    ("Narayanpur", 2500, "4.3% YoY"),
    ("Sukma", 2500, "4.3% YoY"),
    ("Bijapur", 2400, "4.2% YoY"),
    ("Gaurela-Pendra-Marwahi", 2700, "4.7% YoY"),
    ("Khairagarh-Chhuikhadan-Gandai", 2800, "4.9% YoY"),
    ("Manendragarh-Chirmiri-Bharatpur", 2700, "4.6% YoY"),
    ("Mohla-Manpur-Ambagarh Chowki", 2500, "4.4% YoY"),
    ("Sakti", 2800, "4.8% YoY"),
    ("Sarangarh-Bilaigarh", 2700, "4.6% YoY"),
    ("Mungeli", 2700, "4.6% YoY")
]
for name, rate, growth in cg_list:
    add_std_dist("Chhattisgarh", name, rate, growth)

# ==========================================
# 6. GOA (2 Districts)
# ==========================================
goa_list = [
    ("North Goa (Panaji / Mapusa / Candolim)", 7800, "9.2% YoY"),
    ("South Goa (Margao / Vasco / Colva)", 6200, "7.4% YoY")
]
for name, rate, growth in goa_list:
    add_std_dist("Goa", name, rate, growth)

# ==========================================
# 7. GUJARAT (33 Districts)
# ==========================================
gj_list = [
    ("Surat (Outer & Non-Metro)", 6800, "8.6% YoY"),
    ("Vadodara", 4900, "7.3% YoY"),
    ("Rajkot", 4700, "7.5% YoY"),
    ("Bhavnagar", 3600, "5.9% YoY"),
    ("Jamnagar", 3800, "6.4% YoY"),
    ("Junagadh", 3400, "5.7% YoY"),
    ("Gandhinagar (Outer / GIFT Corridor)", 5600, "8.2% YoY"),
    ("Anand (Milk Capital)", 4100, "6.8% YoY"),
    ("Bharuch", 3600, "6.2% YoY"),
    ("Navsari", 3700, "6.0% YoY"),
    ("Valsad (Vapi Hub)", 3600, "5.9% YoY"),
    ("Morbi (Ceramic Hub)", 3900, "7.1% YoY"),
    ("Mehsana", 3500, "6.1% YoY"),
    ("Kutch (Bhuj / Gandhidham / Mundra)", 3600, "6.0% YoY"),
    ("Patan", 3200, "5.5% YoY"),
    ("Porbandar", 3300, "5.6% YoY"),
    ("Amreli", 3000, "5.2% YoY"),
    ("Surendranagar", 3100, "5.4% YoY"),
    ("Banaskantha (Palanpur)", 3200, "5.5% YoY"),
    ("Sabarkantha (Himmatnagar)", 3200, "5.5% YoY"),
    ("Panchmahal (Godhra)", 3000, "5.1% YoY"),
    ("Dahod", 2800, "4.9% YoY"),
    ("Kheda (Nadiad)", 3500, "5.8% YoY"),
    ("Aravalli (Modasa)", 2900, "5.0% YoY"),
    ("Botad", 3000, "5.2% YoY"),
    ("Chhota Udaipur", 2700, "4.6% YoY"),
    ("Dang (Ahwa / Saputara)", 2600, "4.5% YoY"),
    ("Devbhoomi Dwarka (Khambhalia / Dwarka)", 3300, "5.8% YoY"),
    ("Gir Somnath (Veraval / Somnath)", 3400, "5.9% YoY"),
    ("Mahisagar (Lunawada)", 2800, "4.8% YoY"),
    ("Narmada (Rajpipla / Kevadia)", 3100, "5.7% YoY"),
    ("Tapi (Vyara)", 2900, "5.0% YoY"),
    ("Ahmedabad (Rural / Sanand / Dholera SIR)", 4800, "7.6% YoY")
]
for name, rate, growth in gj_list:
    add_std_dist("Gujarat", name, rate, growth)

# ==========================================
# 8. HARYANA (22 Districts)
# ==========================================
hr_list = [
    ("Faridabad (Outer)", 6200, "7.2% YoY"),
    ("Gurugram (Rural / Sohna / Manesar)", 7800, "8.9% YoY"),
    ("Panchkula", 6400, "7.5% YoY"),
    ("Ambala", 4100, "6.1% YoY"),
    ("Karnal (Smart City)", 4400, "6.9% YoY"),
    ("Panipat (Textile Hub)", 4200, "6.5% YoY"),
    ("Sonipat", 4600, "7.2% YoY"),
    ("Rohtak", 4100, "6.3% YoY"),
    ("Hisar", 3900, "6.0% YoY"),
    ("Yamunanagar - Jagadhri", 3600, "5.8% YoY"),
    ("Kurukshetra", 3800, "6.2% YoY"),
    ("Bhiwani", 3200, "5.3% YoY"),
    ("Sirsa", 3400, "5.5% YoY"),
    ("Rewari (Bawal IMT Hub)", 3900, "6.4% YoY"),
    ("Palwal", 3600, "6.0% YoY"),
    ("Jhajjar (Bahadurgarh)", 3400, "5.7% YoY"),
    ("Kaithal", 3300, "5.4% YoY"),
    ("Jind", 3200, "5.3% YoY"),
    ("Fatehabad", 3100, "5.2% YoY"),
    ("Mahendragarh (Narnaul)", 3100, "5.3% YoY"),
    ("Charkhi Dadri", 3000, "5.1% YoY"),
    ("Nuh (Mewat)", 3100, "5.2% YoY")
]
for name, rate, growth in hr_list:
    add_std_dist("Haryana", name, rate, growth)

# ==========================================
# 9. HIMACHAL PRADESH (12 Districts)
# ==========================================
hp_list = [
    ("Shimla (Capital District)", 6800, "7.9% YoY"),
    ("Kullu & Manali", 5900, "8.1% YoY"),
    ("Kangra (Dharamshala & McLeodganj)", 5400, "7.6% YoY"),
    ("Solan (Baddi Pharma SEZ)", 4800, "7.0% YoY"),
    ("Mandi (IIT Mandi Axis)", 4100, "6.2% YoY"),
    ("Sirmaur (Nahan & Paonta Sahib)", 3700, "5.9% YoY"),
    ("Hamirpur", 3800, "6.0% YoY"),
    ("Una", 3600, "5.8% YoY"),
    ("Bilaspur (AIIMS Bilaspur)", 3500, "5.6% YoY"),
    ("Chamba (Dalhousie & Khajjiar)", 3400, "5.4% YoY"),
    ("Kinnaur (Reckong Peo & Kalpa)", 3200, "5.2% YoY"),
    ("Lahaul and Spiti (Keylong & Kaza)", 3100, "5.5% YoY")
]
for name, rate, growth in hp_list:
    add_std_dist("Himachal Pradesh", name, rate, growth)

# ==========================================
# 10. JHARKHAND (24 Districts)
# ==========================================
jh_list = [
    ("Ranchi (State Capital Non-Metro)", 4800, "7.7% YoY"),
    ("East Singhbhum (Jamshedpur)", 4900, "7.5% YoY"),
    ("Dhanbad (Coal Capital)", 3700, "6.2% YoY"),
    ("Bokaro (Steel City)", 3600, "6.0% YoY"),
    ("Deoghar (AIIMS & Baidyanath)", 3800, "7.1% YoY"),
    ("Hazaribagh", 3400, "5.8% YoY"),
    ("Ramgarh (Patratu Lake)", 3200, "5.5% YoY"),
    ("Giridih (Parasnath)", 3100, "5.3% YoY"),
    ("Dumka (Sub-Capital)", 3100, "5.4% YoY"),
    ("Palamu (Medininagar / Daltonganj)", 3000, "5.2% YoY"),
    ("Saraikela Kharsawan (Adityapur)", 3300, "5.7% YoY"),
    ("West Singhbhum (Chaibasa)", 2800, "4.8% YoY"),
    ("Koderma (Jhumri Telaiya)", 3100, "5.3% YoY"),
    ("Chatra", 2600, "4.5% YoY"),
    ("Garhwa", 2700, "4.7% YoY"),
    ("Godda", 2800, "5.0% YoY"),
    ("Gumla", 2700, "4.6% YoY"),
    ("Jamtara", 2700, "4.7% YoY"),
    ("Khunti", 2900, "5.1% YoY"),
    ("Latehar (Betla)", 2600, "4.5% YoY"),
    ("Lohardaga", 2700, "4.6% YoY"),
    ("Pakur", 2700, "4.6% YoY"),
    ("Sahibganj (Ganga Port)", 2900, "5.0% YoY"),
    ("Simdega", 2500, "4.4% YoY")
]
for name, rate, growth in jh_list:
    add_std_dist("Jharkhand", name, rate, growth)

# ==========================================
# 11. KARNATAKA (ALL 31 Districts)
# ==========================================
ka_list = [
    ("Mysuru (Mysore)", 4200, "7.8% YoY", [
        ("Gokulam (Yoga & Lifestyle Hub)", 6800, "Prime Cultural Residential"),
        ("Jayalakshmipuram / Saraswathipuram", 6200, "Established Heritage Prime"),
        ("Vijayanagar (Stages 1-4)", 5100, "High Growth Residential"),
        ("Hebbal Electronic City / IT Hub", 4600, "Tech SEZ Corridor"),
        ("Kuvempunagar / JP Nagar", 4800, "South Residential Core"),
        ("Ring Road Growth Corridor", 3800, "Suburban Arterial Hub"),
        ("Bannur Road / T. Narasipura Road", 3400, "East Expansion Belt"),
        ("Other Localities", 3200, "Greater Mysuru")
    ]),
    ("Dakshina Kannada (Mangaluru)", 4800, "7.2% YoY", [
        ("Kadri Hills / Bejai", 7400, "Prime Central Residential"),
        ("Kodialbail / MG Road", 6900, "Commercial Core"),
        ("Kavoor / Airport Road (Bajpe)", 4800, "Aviation Growth Corridor"),
        ("Surathkal (NITK / MRPL Hub)", 5100, "Industrial & Academic Axis"),
        ("Ullal Coastal Stretch", 4200, "South Scenic Residential"),
        ("Deralakatte Medical City", 4600, "Healthcare & Educational Hub"),
        ("Other Localities", 3600, "Greater Mangalore")
    ]),
    ("Dharwad (Hubballi-Dharwad)", 3600, "6.5% YoY", [
        ("Vidyanagar (Hubli)", 5400, "Commercial Core & BRTS Corridor"),
        ("Keshwapur / Deshpande Nagar", 5100, "Prime Residential"),
        ("Gokul Road / Airport Axis", 4200, "Aviation & Industrial Hub"),
        ("Dharwad Kelageri / University Campus", 4100, "Institutional & Academic Core"),
        ("Navanagar (Twin City Center)", 3800, "Administrative Hub"),
        ("Tarihal Industrial SEZ", 3200, "Manufacturing Cluster"),
        ("Other Localities", 2800, "Twin Cities Periphery")
    ]),
    ("Belagavi (Belgaum)", 3400, "6.0% YoY", [
        ("Tilakwadi / Congress Road", 5200, "Prime Residential"),
        ("Camp Area / Cantonment", 4900, "Heritage Residential"),
        ("Udyambag Industrial Hub", 3800, "Machinery & Foundry Cluster"),
        ("Auto Nagar / NH4 Bypass", 3700, "Industrial & Transport Corridor"),
        ("Angol / Vadgaon", 3300, "South Residential"),
        ("Sambre Airport Link Axis", 3400, "Aviation Growth Node"),
        ("Other Localities", 2700, "Greater Belagavi")
    ]),
    ("Udupi & Manipal", 4500, "7.0% YoY", [
        ("Manipal University Campus Core", 6800, "Global Educational Hub"),
        ("Udupi Car Street / Kalsanka", 5600, "Cultural & Temple Core"),
        ("Brahmavar Highway Node", 3900, "North Growth Suburb"),
        ("Malpe Coastal Beach Hub", 4800, "Maritime & Tourism"),
        ("Santhekatte / Kakkunje", 4100, "Residential Suburb"),
        ("Other Localities", 3400, "Greater Udupi")
    ]),
    ("Shivamogga (Shimoga)", 3300, "5.9% YoY", [
        ("Gopala Gowda Extension", 4600, "Prime Residential"),
        ("Savalanga Road / Vinobhanagar", 4400, "Central Residential"),
        ("Airport Road / Sogane Industrial", 3800, "Aviation & Industrial Axis"),
        ("Vidyanagar / Kuvempu University Axis", 3600, "Academic Corridor"),
        ("Other Localities", 2600, "Greater Shivamogga")
    ]),
    ("Tumakuru (Tumkur)", 3500, "6.8% YoY", [
        ("SIT College Area / Batawadi", 4900, "Academic & Commercial Hub"),
        ("Vasantnarasapura Mega Industrial Hub", 4100, "National Industrial Corridor"),
        ("Kyathsandra / Siddaganga Math Axis", 3800, "Heritage & NH48 Corridor"),
        ("Melekote / Heggere", 3400, "Expansion Zone"),
        ("Other Localities", 2800, "Greater Tumakuru")
    ]),
    ("Davanagere", 3200, "5.6% YoY", [
        ("MCC A & B Block", 4600, "Prime Heritage Residential"),
        ("Vidyanagar / PB Road", 4200, "Commercial Axis"),
        ("Anjaneya Badavane / Shamanur", 3800, "Residential Hub"),
        ("Harihar Industrial Link", 3200, "Industrial Twin Town"),
        ("Other Localities", 2500, "Greater Davanagere")
    ]),
    ("Ballari (Bellary)", 3100, "5.2% YoY", [
        ("Cantonment / Gandhinagar", 4400, "Commercial & Prime"),
        ("KHB Colony / Siruguppa Road", 3600, "Residential Hub"),
        ("Toranagallu JSW Mega Township", 3800, "Mega Steel SEZ"),
        ("Infantry Road / Cowl Bazaar", 3300, "Established Core"),
        ("Other Localities", 2400, "Greater Ballari")
    ]),
    ("Kalaburagi (Gulbarga)", 3000, "5.4% YoY", [
        ("Sedam Road / Ring Road Junction", 4300, "Commercial Corridor"),
        ("Brahmpur / Court Area", 3900, "Central Administrative"),
        ("Central University Axis / Aland Road", 3400, "Academic Corridor"),
        ("KHB Colony / Shahabad Road", 3200, "Residential Suburb"),
        ("Other Localities", 2300, "Greater Kalaburagi")
    ]),
    ("Bagalkote", 2900, "5.1% YoY", None),
    ("Bengaluru Rural", 4400, "8.0% YoY", [
        ("Devanahalli SEZ / Aerospace Park", 5800, "Airport & High-Tech Core"),
        ("Doddaballapura Industrial Textile Hub", 4200, "Industrial & Apparel Cluster"),
        ("Nelamangala Highway Junction", 4600, "Logistics & Transport Axis"),
        ("Hosakote Auto & Hardware Hub", 4500, "Automotive Corridor"),
        ("Other Localities", 3200, "Rural Bangalore Belt")
    ]),
    ("Bengaluru Urban (Outer / Anekal)", 5100, "8.2% YoY", None),
    ("Bidar", 2800, "4.8% YoY", None),
    ("Chamarajanagar", 2700, "4.7% YoY", None),
    ("Chikkaballapura", 3600, "7.1% YoY", None),
    ("Chikkamagaluru (Chikmagalur)", 3900, "6.8% YoY", None),
    ("Chitradurga", 2900, "5.2% YoY", None),
    ("Gadag", 2800, "4.9% YoY", None),
    ("Hassan", 3300, "5.8% YoY", None),
    ("Haveri", 2700, "4.8% YoY", None),
    ("Kodagu (Madikeri / Coorg)", 4600, "7.4% YoY", None),
    ("Kolar", 3400, "6.2% YoY", None),
    ("Koppal", 2800, "4.9% YoY", None),
    ("Mandya (Sugar City)", 3200, "5.6% YoY", None),
    ("Raichur", 2900, "5.0% YoY", None),
    ("Ramanagara (Silk City)", 3600, "6.8% YoY", None),
    ("Uttara Kannada (Karwar / Sirsi)", 3500, "5.9% YoY", None),
    ("Vijayanagara (Hospet / Hampi)", 3600, "6.5% YoY", None),
    ("Vijayapura (Bijapur)", 3100, "5.3% YoY", None),
    ("Yadgir", 2600, "4.5% YoY", None)
]
for item in ka_list:
    if len(item) == 4 and item[3]:
        add_dist("Karnataka", item[0], item[1], item[2], item[3])
    else:
        add_std_dist("Karnataka", item[0], item[1], item[2])

# ==========================================
# 12. KERALA (14 Districts)
# ==========================================
kl_list = [
    ("Thiruvananthapuram (Trivandrum)", 5200, "7.8% YoY"),
    ("Ernakulam (Kochi Non-Metro Outer)", 5800, "8.2% YoY"),
    ("Kozhikode (Calicut)", 4600, "6.8% YoY"),
    ("Thrissur (Cultural Capital)", 4300, "6.4% YoY"),
    ("Kollam (Quilon)", 3800, "5.8% YoY"),
    ("Kottayam", 4100, "6.1% YoY"),
    ("Palakkad", 3500, "5.6% YoY"),
    ("Kannur", 3900, "6.0% YoY"),
    ("Alappuzha (Alleppey)", 3900, "6.2% YoY"),
    ("Malappuram", 3400, "5.5% YoY"),
    ("Pathanamthitta", 3600, "5.7% YoY"),
    ("Idukki (Painavu / Munnar)", 3800, "6.5% YoY"),
    ("Kasaragod", 3300, "5.3% YoY"),
    ("Wayanad (Kalpetta)", 3700, "6.3% YoY")
]
for name, rate, growth in kl_list:
    add_std_dist("Kerala", name, rate, growth)

# ==========================================
# 13. MADHYA PRADESH (55 Districts)
# ==========================================
mp_list = [
    ("Indore (Outer / Super Corridor)", 5600, "8.8% YoY"),
    ("Bhopal (Outer / Kolar Road)", 4600, "7.2% YoY"),
    ("Gwalior (Smart City)", 3900, "6.5% YoY"),
    ("Jabalpur", 3800, "6.2% YoY"),
    ("Ujjain (Mahakal Smart City)", 4200, "7.8% YoY"),
    ("Sagar", 3200, "5.4% YoY"),
    ("Rewa", 3300, "5.6% YoY"),
    ("Satna", 3400, "5.7% YoY"),
    ("Dewas", 3600, "6.4% YoY"),
    ("Ratlam", 3400, "5.8% YoY"),
    ("Singrauli (Energy Capital)", 3300, "5.5% YoY"),
    ("Katni", 3200, "5.4% YoY"),
    ("Khandwa (East Nimar)", 3100, "5.3% YoY"),
    ("Khargone (West Nimar)", 3000, "5.2% YoY"),
    ("Chhindwara", 3200, "5.5% YoY"),
    ("Hoshangabad (Narmadapuram)", 3200, "5.4% YoY"),
    ("Vidisha", 3100, "5.3% YoY"),
    ("Sehore", 3200, "5.6% YoY"),
    ("Shivpuri", 3000, "5.1% YoY"),
    ("Mandsaur", 3200, "5.4% YoY"),
    ("Neemuch", 3100, "5.2% YoY"),
    ("Morena", 3000, "5.1% YoY"),
    ("Bhind", 2900, "4.9% YoY"),
    ("Guna", 3000, "5.1% YoY"),
    ("Damoh", 2900, "4.9% YoY"),
    ("Chhatarpur (Khajuraho)", 3200, "5.6% YoY"),
    ("Panna", 2800, "4.8% YoY"),
    ("Tikamgarh", 2800, "4.8% YoY"),
    ("Niwari (Orchha)", 2900, "5.0% YoY"),
    ("Seoni", 2800, "4.8% YoY"),
    ("Balaghat", 2900, "5.0% YoY"),
    ("Mandla", 2700, "4.7% YoY"),
    ("Dindori", 2500, "4.4% YoY"),
    ("Narsinghpur", 2900, "5.0% YoY"),
    ("Betul", 3000, "5.2% YoY"),
    ("Harda", 2900, "5.0% YoY"),
    ("Raisen (Mandideep)", 3100, "5.4% YoY"),
    ("Rajgarh", 2800, "4.8% YoY"),
    ("Shajapur", 2800, "4.8% YoY"),
    ("Agar Malwa", 2700, "4.7% YoY"),
    ("Barwani", 2800, "4.8% YoY"),
    ("Burhanpur", 3100, "5.3% YoY"),
    ("Alirajpur", 2500, "4.3% YoY"),
    ("Jhabua", 2600, "4.5% YoY"),
    ("Dhar (Pithampur)", 3200, "5.6% YoY"),
    ("Anuppur (Amarkantak)", 2800, "4.8% YoY"),
    ("Ashoknagar (Chanderi)", 2800, "4.8% YoY"),
    ("Datia (Pitambara Peeth)", 2900, "5.0% YoY"),
    ("Sheopur (Kuno National Park)", 2600, "4.6% YoY"),
    ("Sidhi", 2700, "4.6% YoY"),
    ("Shahdol", 3000, "5.2% YoY"),
    ("Umaria (Bandhavgarh)", 2800, "4.9% YoY"),
    ("Maihar", 3100, "5.4% YoY"),
    ("Mauganj", 2700, "4.6% YoY"),
    ("Pandhurna", 2800, "4.8% YoY")
]
for name, rate, growth in mp_list:
    add_std_dist("Madhya Pradesh", name, rate, growth)

# ==========================================
# 14. MAHARASHTRA (36 Districts)
# ==========================================
mh_list = [
    ("Nagpur (Non-Metro Outer / MIHAN)", 4800, "7.6% YoY"),
    ("Nashik (Smart City)", 4600, "7.2% YoY"),
    ("Chhatrapati Sambhajinagar (Aurangabad)", 4300, "6.8% YoY"),
    ("Kolhapur", 4100, "6.5% YoY"),
    ("Solapur", 3600, "5.8% YoY"),
    ("Thane (Non-Metro Outer / Kalyan-Dombivli)", 7400, "7.9% YoY"),
    ("Palghar (Vasai-Virar / Boisar)", 5200, "7.1% YoY"),
    ("Raigad (Alibag / Panvel Outer / Karjat)", 5800, "8.0% YoY"),
    ("Pune (Rural / Shirur / Talegaon / Baramati)", 4900, "7.5% YoY"),
    ("Ahmednagar (Ahilyanagar)", 3500, "5.7% YoY"),
    ("Amravati", 3600, "5.9% YoY"),
    ("Akola", 3400, "5.6% YoY"),
    ("Jalgaon (Gold & Banana City)", 3500, "5.8% YoY"),
    ("Latur (Educational Hub)", 3500, "5.8% YoY"),
    ("Dhule", 3200, "5.3% YoY"),
    ("Nanded", 3400, "5.6% YoY"),
    ("Sangli - Miraj", 3800, "6.1% YoY"),
    ("Satara (Mahabaleshwar Corridor)", 3900, "6.3% YoY"),
    ("Ratnagiri (Coastal Tourism)", 3600, "5.9% YoY"),
    ("Sindhudurg (Oros / Malvan)", 3500, "5.8% YoY"),
    ("Chandrapur (Black Gold City)", 3300, "5.4% YoY"),
    ("Yavatmal", 3100, "5.1% YoY"),
    ("Parbhani", 3000, "5.0% YoY"),
    ("Jalna (Steel Hub)", 3300, "5.5% YoY"),
    ("Beed", 3000, "4.9% YoY"),
    ("Buldhana (Shegaon / Lonar)", 3100, "5.2% YoY"),
    ("Wardha (Sevagram)", 3100, "5.2% YoY"),
    ("Gondia", 3000, "5.0% YoY"),
    ("Bhandara", 2900, "4.9% YoY"),
    ("Gadchiroli", 2600, "4.4% YoY"),
    ("Hingoli", 2800, "4.7% YoY"),
    ("Nandurbar", 2700, "4.6% YoY"),
    ("Dharashiv (Osmanabad)", 2900, "4.8% YoY"),
    ("Washim", 2800, "4.7% YoY"),
    ("Mumbai City (Non-Metro Port Trust Axis)", 18500, "6.0% YoY"),
    ("Mumbai Suburban (Outer Beyond Dahisar)", 11500, "6.8% YoY")
]
for name, rate, growth in mh_list:
    add_std_dist("Maharashtra", name, rate, growth)

# ==========================================
# 15. MANIPUR (16 Districts)
# ==========================================
mn_list = [
    ("Imphal West", 3700, "5.8% YoY"),
    ("Imphal East", 3500, "5.6% YoY"),
    ("Churachandpur", 3100, "5.1% YoY"),
    ("Thoubal", 3000, "5.0% YoY"),
    ("Bishnupur (Loktak Lake)", 3100, "5.2% YoY"),
    ("Kakching", 2900, "4.9% YoY"),
    ("Ukhrul", 2800, "4.8% YoY"),
    ("Senapati", 2800, "4.7% YoY"),
    ("Tamenglong", 2600, "4.5% YoY"),
    ("Chandel", 2600, "4.5% YoY"),
    ("Kangpokpi", 2700, "4.6% YoY"),
    ("Jiribam", 2700, "4.7% YoY"),
    ("Tengnoupal (Moreh Border Trade)", 2900, "5.0% YoY"),
    ("Kamjong", 2400, "4.2% YoY"),
    ("Noney", 2500, "4.4% YoY"),
    ("Pherzawl", 2400, "4.2% YoY")
]
for name, rate, growth in mn_list:
    add_std_dist("Manipur", name, rate, growth)

# ==========================================
# 16. MEGHALAYA (12 Districts)
# ==========================================
ml_list = [
    ("East Khasi Hills (Shillong)", 5200, "7.4% YoY"),
    ("Ri Bhoi (Nongpoh / Byrnihat)", 3600, "6.1% YoY"),
    ("West Garo Hills (Tura)", 3200, "5.4% YoY"),
    ("West Jaintia Hills (Jowai)", 3100, "5.2% YoY"),
    ("East Jaintia Hills (Khliehriat)", 3000, "5.0% YoY"),
    ("West Khasi Hills (Nongstoin)", 2800, "4.7% YoY"),
    ("South West Khasi Hills (Mawkyrwat)", 2700, "4.6% YoY"),
    ("Eastern West Khasi Hills (Mairang)", 2800, "4.7% YoY"),
    ("East Garo Hills (Williamnagar)", 2700, "4.6% YoY"),
    ("North Garo Hills (Resubelpara)", 2600, "4.5% YoY"),
    ("South Garo Hills (Baghmara)", 2500, "4.3% YoY"),
    ("South West Garo Hills (Ampati)", 2600, "4.5% YoY")
]
for name, rate, growth in ml_list:
    add_std_dist("Meghalaya", name, rate, growth)

# ==========================================
# 17. MIZORAM (11 Districts)
# ==========================================
mz_list = [
    ("Aizawl (Capital District)", 4400, "6.8% YoY"),
    ("Lunglei", 3200, "5.3% YoY"),
    ("Champhai (Zokhawthar Border)", 3100, "5.2% YoY"),
    ("Kolasib (Vairengte Gate)", 3000, "5.0% YoY"),
    ("Serchhip", 2800, "4.8% YoY"),
    ("Mamit", 2600, "4.5% YoY"),
    ("Lawngtlai", 2600, "4.5% YoY"),
    ("Siaha (Saiha)", 2700, "4.6% YoY"),
    ("Saitual", 2700, "4.6% YoY"),
    ("Khawzawl", 2600, "4.5% YoY"),
    ("Hnahthial", 2600, "4.5% YoY")
]
for name, rate, growth in mz_list:
    add_std_dist("Mizoram", name, rate, growth)

# ==========================================
# 18. NAGALAND (16 Districts)
# ==========================================
nl_list = [
    ("Dimapur (Commercial Hub)", 4600, "7.2% YoY"),
    ("Kohima (State Capital)", 4300, "6.8% YoY"),
    ("Chümoukedima", 3900, "6.4% YoY"),
    ("Mokokchung", 3400, "5.5% YoY"),
    ("Wokha", 3000, "5.0% YoY"),
    ("Tuensang", 2700, "4.6% YoY"),
    ("Mon", 2700, "4.6% YoY"),
    ("Phek", 2800, "4.7% YoY"),
    ("Zünheboto", 2800, "4.7% YoY"),
    ("Peren", 2700, "4.6% YoY"),
    ("Kiphire", 2500, "4.3% YoY"),
    ("Longleng", 2500, "4.3% YoY"),
    ("Niuland", 3100, "5.2% YoY"),
    ("Noklak", 2400, "4.2% YoY"),
    ("Tseminyü", 2800, "4.8% YoY"),
    ("Shamator", 2400, "4.2% YoY")
]
for name, rate, growth in nl_list:
    add_std_dist("Nagaland", name, rate, growth)

# ==========================================
# 19. ODISHA (30 Districts)
# ==========================================
od_list = [
    ("Bhubaneswar (Khordha Non-Metro Belt)", 5400, "8.4% YoY"),
    ("Cuttack (Silver City)", 4500, "6.8% YoY"),
    ("Puri (Holy Beach City)", 4800, "7.5% YoY"),
    ("Rourkela (Sundargarh Steel City)", 3900, "6.4% YoY"),
    ("Sambalpur", 3600, "6.0% YoY"),
    ("Ganjam (Berhampur / Gopalpur)", 3700, "6.2% YoY"),
    ("Balasore (Baleswar)", 3500, "5.8% YoY"),
    ("Bhadrak", 3200, "5.4% YoY"),
    ("Angul (Industrial Hub)", 3400, "5.7% YoY"),
    ("Jharsuguda (Power & Airport Hub)", 3600, "6.1% YoY"),
    ("Jajpur (Kalinganagar Steel SEZ)", 3500, "6.0% YoY"),
    ("Jagatsinghpur (Paradip Port Axis)", 3600, "6.2% YoY"),
    ("Dhenkanal", 3100, "5.3% YoY"),
    ("Kendujhar (Keonjhar)", 3200, "5.4% YoY"),
    ("Mayurbhanj (Baripada)", 3100, "5.2% YoY"),
    ("Bargarh", 3100, "5.2% YoY"),
    ("Koraput (Jeypore)", 3200, "5.4% YoY"),
    ("Rayagada", 3000, "5.1% YoY"),
    ("Kalahandi (Bhawanipatna)", 2900, "4.9% YoY"),
    ("Balangir", 3000, "5.0% YoY"),
    ("Kendrapara", 2900, "4.9% YoY"),
    ("Nayagarh", 2900, "4.9% YoY"),
    ("Gajapati (Paralakhemundi)", 2800, "4.8% YoY"),
    ("Nabarangpur", 2700, "4.6% YoY"),
    ("Kandhamal (Phulbani)", 2700, "4.6% YoY"),
    ("Nuapada", 2700, "4.6% YoY"),
    ("Subarnapur (Sonepur)", 2700, "4.6% YoY"),
    ("Malkangiri", 2600, "4.5% YoY"),
    ("Boudh", 2600, "4.5% YoY"),
    ("Deogarh (Debagarh)", 2600, "4.5% YoY")
]
for name, rate, growth in od_list:
    add_std_dist("Odisha", name, rate, growth)

# ==========================================
# 20. PUNJAB (23 Districts)
# ==========================================
pb_list = [
    ("Ludhiana (Industrial Hub)", 4900, "7.2% YoY"),
    ("Amritsar (Holy City)", 4600, "6.8% YoY"),
    ("Jalandhar (Sports City)", 4400, "6.5% YoY"),
    ("Sahibzada Ajit Singh Nagar (Mohali)", 6800, "8.8% YoY"),
    ("Patiala (Heritage City)", 4100, "6.2% YoY"),
    ("Bathinda", 3800, "5.9% YoY"),
    ("Pathankot", 3600, "5.7% YoY"),
    ("Hoshiarpur", 3500, "5.6% YoY"),
    ("Gurdaspur (Batala)", 3300, "5.3% YoY"),
    ("Moga", 3300, "5.4% YoY"),
    ("Ferozepur", 3100, "5.1% YoY"),
    ("Kapurthala (Phagwara NRI Hub)", 3700, "6.0% YoY"),
    ("Sangrur", 3200, "5.3% YoY"),
    ("Sri Muktsar Sahib", 3100, "5.1% YoY"),
    ("Fazilka (Abohar)", 3200, "5.2% YoY"),
    ("Rupnagar (Ropar - IIT Hub)", 3900, "6.4% YoY"),
    ("Fatehgarh Sahib (Mandi Gobindgarh)", 3600, "5.8% YoY"),
    ("Faridkot", 3200, "5.3% YoY"),
    ("Barnala", 3100, "5.2% YoY"),
    ("Mansa", 2900, "4.9% YoY"),
    ("Tarn Taran", 3000, "5.0% YoY"),
    ("Shahid Bhagat Singh Nagar (Nawanshahr)", 3400, "5.5% YoY"),
    ("Malerkotla", 3100, "5.2% YoY")
]
for name, rate, growth in pb_list:
    add_std_dist("Punjab", name, rate, growth)

# ==========================================
# 21. RAJASTHAN (50 Districts)
# ==========================================
rj_list = [
    ("Jodhpur (Sun City)", 4500, "7.1% YoY"),
    ("Udaipur (City of Lakes)", 5200, "8.0% YoY"),
    ("Kota (Coaching & Education Capital)", 4200, "6.6% YoY"),
    ("Ajmer & Pushkar", 3900, "6.2% YoY"),
    ("Bikaner", 3600, "5.8% YoY"),
    ("Alwar (Bhiwadi Industrial Corridor)", 4600, "7.2% YoY"),
    ("Bhilwara (Textile Hub)", 3700, "6.0% YoY"),
    ("Sikar (Education Hub)", 3600, "5.9% YoY"),
    ("Pali", 3300, "5.4% YoY"),
    ("Bharatpur", 3400, "5.5% YoY"),
    ("Sri Ganganagar", 3400, "5.5% YoY"),
    ("Chittorgarh", 3400, "5.5% YoY"),
    ("Jaisalmer (Golden City)", 3800, "6.4% YoY"),
    ("Jhunjhunu", 3300, "5.4% YoY"),
    ("Hanumangarh", 3200, "5.3% YoY"),
    ("Nagaur", 3100, "5.2% YoY"),
    ("Barmer (Oil & Refinery Hub)", 3600, "6.3% YoY"),
    ("Churu", 3000, "5.0% YoY"),
    ("Bundi", 3100, "5.2% YoY"),
    ("Dausa", 3200, "5.3% YoY"),
    ("Tonk", 3000, "5.0% YoY"),
    ("Rajsamand (Nathdwara)", 3500, "5.8% YoY"),
    ("Sawai Madhopur (Ranthambore)", 3400, "5.6% YoY"),
    ("Jhalawar", 3000, "5.0% YoY"),
    ("Sirohi (Mount Abu Hill Station)", 3700, "6.1% YoY"),
    ("Banswara", 2900, "4.9% YoY"),
    ("Dungarpur", 2800, "4.8% YoY"),
    ("Baran", 2800, "4.8% YoY"),
    ("Dholpur", 3000, "5.0% YoY"),
    ("Karauli", 2900, "4.9% YoY"),
    ("Pratapgarh", 2800, "4.7% YoY"),
    ("Jalore", 2900, "4.8% YoY"),
    ("Anupgarh", 3000, "5.0% YoY"),
    ("Balotra", 3300, "5.5% YoY"),
    ("Beawar", 3300, "5.4% YoY"),
    ("Deeg", 3100, "5.2% YoY"),
    ("Didwana-Kuchaman", 3200, "5.3% YoY"),
    ("Dudu", 3100, "5.2% YoY"),
    ("Gangapur City", 3100, "5.2% YoY"),
    ("Jaipur Rural", 4100, "6.8% YoY"),
    ("Jodhpur Rural", 3600, "6.0% YoY"),
    ("Kekri", 3000, "5.0% YoY"),
    ("Khairthal-Tijara", 3800, "6.3% YoY"),
    ("Kotputli-Behror", 3900, "6.4% YoY"),
    ("Neem Ka Thana", 3200, "5.3% YoY"),
    ("Phalodi", 3100, "5.1% YoY"),
    ("Salumbar", 2900, "4.8% YoY"),
    ("Sanchore", 3000, "5.0% YoY"),
    ("Shahpura (Rajasthan)", 2900, "4.8% YoY"),
    ("Jaipur (Outer Non-Metro Perimeter)", 4800, "7.2% YoY")
]
for name, rate, growth in rj_list:
    add_std_dist("Rajasthan", name, rate, growth)

# ==========================================
# 22. SIKKIM (6 Districts)
# ==========================================
sk_list = [
    ("Gangtok (State Capital)", 5600, "7.8% YoY"),
    ("Namchi (South Sikkim)", 4200, "6.5% YoY"),
    ("Gyalshing (West Sikkim / Pelling)", 3900, "6.1% YoY"),
    ("Mangan (North Sikkim)", 3400, "5.4% YoY"),
    ("Pakyong (Airport Hub)", 4500, "7.0% YoY"),
    ("Soreng", 3600, "5.8% YoY")
]
for name, rate, growth in sk_list:
    add_std_dist("Sikkim", name, rate, growth)

# ==========================================
# 23. TAMIL NADU (38 Districts)
# ==========================================
tn_list = [
    ("Coimbatore (Manchester of South)", 5800, "8.4% YoY"),
    ("Madurai (Temple City)", 4600, "6.8% YoY"),
    ("Tiruchirappalli (Trichy)", 4400, "6.5% YoY"),
    ("Salem (Steel & Mango City)", 3900, "6.1% YoY"),
    ("Tiruppur (Textile & Knitwear Capital)", 4300, "6.9% YoY"),
    ("Erode (Turmeric City)", 3900, "6.2% YoY"),
    ("Vellore (CMC & VIT Hub)", 4200, "6.7% YoY"),
    ("Thoothukudi (Tuticorin Port City)", 3800, "6.0% YoY"),
    ("Tirunelveli (Nellai)", 3700, "5.9% YoY"),
    ("Thanjavur (Rice Bowl & Brihadeeswarar)", 3800, "6.0% YoY"),
    ("Dindigul (Lock City & Kodaikanal)", 3900, "6.3% YoY"),
    ("Kanyakumari (Nagercoil)", 4500, "7.0% YoY"),
    ("Krishnagiri (Hosur Auto & EV Hub)", 5200, "8.6% YoY"),
    ("Chengalpattu (GST Road / Mahindra World City)", 5600, "8.0% YoY"),
    ("Kanchipuram (Silk City & Sriperumbudur SEZ)", 4900, "7.4% YoY"),
    ("Tiruvallur (Industrial Auto Corridor)", 4600, "7.0% YoY"),
    ("Cuddalore (Neyveli Lignite Corridor)", 3500, "5.6% YoY"),
    ("Viluppuram", 3300, "5.3% YoY"),
    ("Namakkal (Poultry & Transport Hub)", 3500, "5.7% YoY"),
    ("Karur (Textile Export Hub)", 3600, "5.8% YoY"),
    ("Nilgiris (Ooty & Coonoor)", 5800, "8.1% YoY"),
    ("Sivaganga (Karaikudi / Chettinad)", 3300, "5.3% YoY"),
    ("Theni (Cardamom Valley)", 3400, "5.5% YoY"),
    ("Ramanathapuram (Rameswaram)", 3600, "5.9% YoY"),
    ("Virudhunagar (Sivakasi Fireworks Hub)", 3400, "5.5% YoY"),
    ("Pudukkottai", 3200, "5.2% YoY"),
    ("Dharmapuri", 3200, "5.2% YoY"),
    ("Nagapattinam (Velankanni Axis)", 3400, "5.6% YoY"),
    ("Mayiladuthurai", 3300, "5.4% YoY"),
    ("Tiruvarur", 3200, "5.2% YoY"),
    ("Tiruvannamalai (Spiritual Temple Hub)", 3700, "6.1% YoY"),
    ("Ranipet (Leather SEZ)", 3700, "6.0% YoY"),
    ("Tirupathur (Ambur / Vaniyambadi)", 3500, "5.7% YoY"),
    ("Kallakurichi", 3100, "5.0% YoY"),
    ("Tenkasi (Courtallam Falls)", 3500, "5.7% YoY"),
    ("Ariyalur (Cement Hub)", 3000, "4.9% YoY"),
    ("Perambalur", 3000, "4.9% YoY"),
    ("Chennai (Non-Metro Outer Perimeter)", 6200, "7.5% YoY")
]
for name, rate, growth in tn_list:
    add_std_dist("Tamil Nadu", name, rate, growth)

# ==========================================
# 24. TELANGANA (33 Districts)
# ==========================================
ts_list = [
    ("Warangal (Smart City & Heritage)", 3800, "6.5% YoY"),
    ("Karimnagar", 3600, "6.2% YoY"),
    ("Nizamabad", 3400, "5.8% YoY"),
    ("Khammam", 3500, "6.0% YoY"),
    ("Rangareddy (Outer Ring Road / Shamshabad / Adibatla)", 6400, "8.9% YoY"),
    ("Medchal-Malkajgiri (Kompally / Genome Valley)", 5800, "8.2% YoY"),
    ("Sangareddy (IIT Hyderabad / Kandi / Patancheru)", 4900, "7.6% YoY"),
    ("Siddipet (Smart Hub)", 3600, "6.3% YoY"),
    ("Yadadri Bhuvanagiri (Temple City & AIIMS Bibinagar)", 3800, "6.9% YoY"),
    ("Nalgonda", 3200, "5.4% YoY"),
    ("Mahabubnagar", 3300, "5.6% YoY"),
    ("Bhadradri Kothagudem (Bhadrachalam)", 3200, "5.4% YoY"),
    ("Mancherial", 3100, "5.3% YoY"),
    ("Peddapalli (Ramagundam NTPC Hub)", 3300, "5.5% YoY"),
    ("Jagtial", 3100, "5.2% YoY"),
    ("Adilabad", 3000, "5.0% YoY"),
    ("Kumuram Bheem Asifabad", 2700, "4.6% YoY"),
    ("Nirmal", 2900, "4.9% YoY"),
    ("Kamareddy", 3100, "5.2% YoY"),
    ("Rajanna Sircilla (Textile Hub)", 3200, "5.5% YoY"),
    ("Medak", 3000, "5.1% YoY"),
    ("Jangaon", 3000, "5.1% YoY"),
    ("Hanumankonda", 3700, "6.4% YoY"),
    ("Jayashankar Bhupalpally", 2800, "4.8% YoY"),
    ("Mahabubabad", 2900, "4.9% YoY"),
    ("Mulugu", 2700, "4.6% YoY"),
    ("Suryapet", 3200, "5.4% YoY"),
    ("Vikarabad (Ananthagiri Hills)", 3300, "5.6% YoY"),
    ("Wanaparthy", 2900, "4.9% YoY"),
    ("Nagarkurnool", 2900, "4.9% YoY"),
    ("Jogulamba Gadwal (Alampur)", 2900, "4.9% YoY"),
    ("Narayanpet", 2800, "4.7% YoY"),
    ("Hyderabad (Outer Non-Metro Perimeter)", 6200, "8.0% YoY")
]
for name, rate, growth in ts_list:
    add_std_dist("Telangana", name, rate, growth)

# ==========================================
# 25. TRIPURA (8 Districts)
# ==========================================
tr_list = [
    ("West Tripura (Agartala)", 4300, "6.8% YoY"),
    ("Gomati (Udaipur)", 3200, "5.4% YoY"),
    ("South Tripura (Belonia)", 2900, "5.0% YoY"),
    ("North Tripura (Dharmanagar)", 3100, "5.2% YoY"),
    ("Unakoti (Kailashahar)", 2900, "4.9% YoY"),
    ("Dhalai (Ambassa)", 2700, "4.6% YoY"),
    ("Khowai", 2800, "4.8% YoY"),
    ("Sepahijala (Bishramganj)", 3000, "5.1% YoY")
]
for name, rate, growth in tr_list:
    add_std_dist("Tripura", name, rate, growth)

# ==========================================
# 26. UTTAR PRADESH (75 Districts)
# ==========================================
up_list = [
    ("Varanasi (Kashi Smart City)", 5200, "8.2% YoY"),
    ("Prayagraj (Allahabad)", 4400, "6.9% YoY"),
    ("Agra (Taj Heritage Corridor)", 4600, "7.0% YoY"),
    ("Kanpur Nagar", 4500, "6.8% YoY"),
    ("Gorakhpur (AIIMS & Gorakhnath)", 4300, "7.2% YoY"),
    ("Ayodhya (Ram Mandir Mega Smart City)", 5400, "9.5% YoY"),
    ("Meerut (Rapid Rail RRTS Corridor)", 5100, "7.8% YoY"),
    ("Bareilly (Smart City)", 3800, "6.2% YoY"),
    ("Aligarh (University & Lock City)", 3900, "6.3% YoY"),
    ("Moradabad (Brass City)", 3700, "6.0% YoY"),
    ("Saharanpur", 3600, "5.8% YoY"),
    ("Jhansi (Smart City & Defense Corridor)", 3800, "6.2% YoY"),
    ("Mathura & Vrindavan", 4600, "7.6% YoY"),
    ("Firozabad (Glass City)", 3300, "5.4% YoY"),
    ("Muzaffarnagar", 3600, "5.8% YoY"),
    ("Ghaziabad (Outer)", 5900, "7.5% YoY"),
    ("Gautam Buddha Nagar (Greater Noida / Yamuna Expressway)", 6800, "8.9% YoY"),
    ("Hapur (Pilkhuwa)", 3800, "6.2% YoY"),
    ("Bulandshahr (Khurja Pottery)", 3500, "5.7% YoY"),
    ("Baghpat", 3400, "5.5% YoY"),
    ("Shamli", 3200, "5.3% YoY"),
    ("Bijnor", 3200, "5.3% YoY"),
    ("Amroha", 3100, "5.2% YoY"),
    ("Sambhal", 3000, "5.0% YoY"),
    ("Rampur", 3200, "5.3% YoY"),
    ("Pilibhit", 3000, "5.0% YoY"),
    ("Shahjahanpur", 3200, "5.3% YoY"),
    ("Budaun", 3000, "5.0% YoY"),
    ("Lakhimpur Kheri (Dudhwa)", 3000, "5.0% YoY"),
    ("Sitapur", 3000, "5.0% YoY"),
    ("Hardoi", 2900, "4.9% YoY"),
    ("Unnao (Trans-Ganga City)", 3400, "5.8% YoY"),
    ("Raebareli (AIIMS)", 3400, "5.7% YoY"),
    ("Amethi", 3100, "5.2% YoY"),
    ("Sultanpur", 3100, "5.2% YoY"),
    ("Pratapgarh", 3000, "5.0% YoY"),
    ("Kaushambi", 2900, "4.9% YoY"),
    ("Fatehpur", 2900, "4.9% YoY"),
    ("Banda", 2900, "4.9% YoY"),
    ("Chitrakoot", 3200, "5.5% YoY"),
    ("Hamirpur", 2800, "4.7% YoY"),
    ("Mahoba", 2800, "4.7% YoY"),
    ("Lalitpur", 2900, "4.8% YoY"),
    ("Jalaun (Orai)", 2900, "4.8% YoY"),
    ("Kanpur Dehat", 3000, "5.0% YoY"),
    ("Kannauj (Perfume Capital)", 3200, "5.4% YoY"),
    ("Farrukhabad", 3000, "5.0% YoY"),
    ("Etawah", 3100, "5.2% YoY"),
    ("Auraiya", 2900, "4.8% YoY"),
    ("Mainpuri", 2900, "4.8% YoY"),
    ("Etah", 2900, "4.8% YoY"),
    ("Kasganj", 2800, "4.7% YoY"),
    ("Hathras", 3000, "5.0% YoY"),
    ("Barabanki", 3400, "5.8% YoY"),
    ("Gonda", 3000, "5.0% YoY"),
    ("Bahraich", 2900, "4.9% YoY"),
    ("Shravasti", 2700, "4.6% YoY"),
    ("Balrampur", 2800, "4.7% YoY"),
    ("Basti", 3100, "5.2% YoY"),
    ("Sant Kabir Nagar (Khalilabad)", 3000, "5.0% YoY"),
    ("Siddharthnagar", 2800, "4.7% YoY"),
    ("Maharajganj", 2900, "4.8% YoY"),
    ("Kushinagar (International Buddhist Hub)", 3500, "6.1% YoY"),
    ("Deoria", 3100, "5.2% YoY"),
    ("Azamgarh", 3200, "5.4% YoY"),
    ("Mau", 3100, "5.2% YoY"),
    ("Ballia", 3100, "5.2% YoY"),
    ("Jaunpur", 3200, "5.4% YoY"),
    ("Ghazipur", 3100, "5.2% YoY"),
    ("Chandauli", 3200, "5.4% YoY"),
    ("Mirzapur (Vindhyachal)", 3300, "5.6% YoY"),
    ("Sonbhadra (Energy Basin)", 3200, "5.4% YoY"),
    ("Bhadohi (Carpet City)", 3400, "5.7% YoY"),
    ("Ambedkar Nagar", 3000, "5.0% YoY"),
    ("Lucknow (Outer Non-Metro Perimeter)", 4900, "7.2% YoY")
]
for name, rate, growth in up_list:
    add_std_dist("Uttar Pradesh", name, rate, growth)

# ==========================================
# 27. UTTARAKHAND (13 Districts)
# ==========================================
uk_list = [
    ("Dehradun (Capital & Doon Valley)", 6200, "7.8% YoY"),
    ("Haridwar (Holy Ganga Core)", 4600, "6.9% YoY"),
    ("Nainital & Haldwani", 4900, "7.4% YoY"),
    ("Udham Singh Nagar (Rudrapur / Pantnagar SEZ)", 3900, "6.3% YoY"),
    ("Rishikesh (Yoga Capital)", 5600, "8.2% YoY"),
    ("Pauri Garhwal (Kotdwar)", 3400, "5.5% YoY"),
    ("Tehri Garhwal (New Tehri)", 3500, "5.6% YoY"),
    ("Almora (Cultural Capital)", 3600, "5.8% YoY"),
    ("Pithoragarh", 3200, "5.3% YoY"),
    ("Chamoli (Badrinath Gateway)", 3400, "5.5% YoY"),
    ("Rudraprayag (Kedarnath Gateway)", 3500, "5.7% YoY"),
    ("Uttarkashi (Gangotri / Yamunotri)", 3300, "5.4% YoY"),
    ("Champawat", 3000, "5.0% YoY"),
    ("Bageshwar", 3000, "5.0% YoY")
]
for name, rate, growth in uk_list:
    add_std_dist("Uttarakhand", name, rate, growth)

# ==========================================
# 28. WEST BENGAL (23 Districts)
# ==========================================
wb_list = [
    ("Howrah (Non-Metro Outer)", 5200, "6.8% YoY"),
    ("North 24 Parganas (Barasat / Bidhannagar)", 5400, "7.2% YoY"),
    ("South 24 Parganas (Baruipur Smart Hub)", 4600, "6.5% YoY"),
    ("Hooghly (Serampore / Uttarpara)", 4300, "6.2% YoY"),
    ("Paschim Bardhaman (Asansol & Durgapur)", 3900, "6.1% YoY"),
    ("Purba Bardhaman (Bardhaman)", 3600, "5.8% YoY"),
    ("Darjeeling & Siliguri Hub", 5400, "8.0% YoY"),
    ("Jalpaiguri", 3400, "5.5% YoY"),
    ("Malda (English Bazar)", 3400, "5.6% YoY"),
    ("Murshidabad (Baharampur)", 3300, "5.4% YoY"),
    ("Nadia (Kalyani AIIMS / Krishnanagar)", 3800, "6.2% YoY"),
    ("Purba Medinipur (Haldia Port / Digha)", 3700, "6.0% YoY"),
    ("Paschim Medinipur (Kharagpur IIT / Midnapore)", 3600, "5.9% YoY"),
    ("Bankura", 3100, "5.1% YoY"),
    ("Birbhum (Bolpur-Santiniketan)", 3600, "6.0% YoY"),
    ("Purulia", 2900, "4.8% YoY"),
    ("Cooch Behar", 3200, "5.3% YoY"),
    ("Alipurduar (Dooars Gate)", 3300, "5.4% YoY"),
    ("Kalimpong", 4200, "6.6% YoY"),
    ("Uttar Dinajpur (Raiganj)", 2900, "4.8% YoY"),
    ("Dakshin Dinajpur (Balurghat)", 2900, "4.8% YoY"),
    ("Jhargram", 2800, "4.7% YoY"),
    ("Kolkata (Non-Metro Outer Perimeter)", 7200, "6.5% YoY")
]
for name, rate, growth in wb_list:
    add_std_dist("West Bengal", name, rate, growth)

# ==========================================
# 29-36. UNION TERRITORIES (8 UTs)
# ==========================================
ut_dict = {
    "Andaman and Nicobar Islands": [
        ("South Andaman (Port Blair / Sri Vijaya Puram)", 5800, "7.5% YoY"),
        ("North and Middle Andaman (Mayabunder)", 3600, "5.6% YoY"),
        ("Nicobars (Car Nicobar)", 3200, "5.0% YoY")
    ],
    "Chandigarh (UT)": [
        ("Chandigarh (Sectors 1-40 & Industrial Area)", 9800, "8.5% YoY")
    ],
    "Dadra and Nagar Haveli and Daman and Diu": [
        ("Dadra and Nagar Haveli (Silvassa)", 3900, "6.4% YoY"),
        ("Daman (Nani Daman / Moti Daman)", 4200, "6.6% YoY"),
        ("Diu (Coastal Resort)", 4100, "6.5% YoY")
    ],
    "Delhi (NCT Districts)": [
        ("Central Delhi", 18500, "6.5% YoY"),
        ("New Delhi", 22000, "6.8% YoY"),
        ("South Delhi", 16800, "7.0% YoY"),
        ("South East Delhi", 13200, "6.8% YoY"),
        ("South West Delhi (Dwarka Outer)", 11500, "7.2% YoY"),
        ("West Delhi", 12400, "6.9% YoY"),
        ("North Delhi", 11200, "6.4% YoY"),
        ("North West Delhi", 9800, "6.5% YoY"),
        ("North East Delhi", 8400, "6.1% YoY"),
        ("East Delhi", 10600, "6.6% YoY"),
        ("Shahdara", 9200, "6.2% YoY")
    ],
    "Jammu and Kashmir": [
        ("Srinagar (Dal Lake & Rajbagh)", 5800, "7.9% YoY"),
        ("Jammu (Gandhi Nagar & Trikuta Nagar)", 4900, "7.1% YoY"),
        ("Anantnag (Islamabad / Pahalgam Axis)", 3800, "6.2% YoY"),
        ("Baramulla (Gulmarg Corridor)", 4100, "6.6% YoY"),
        ("Budgam (Airport Hub)", 4200, "6.5% YoY"),
        ("Ganderbal (Sonamarg Axis)", 3600, "5.9% YoY"),
        ("Pulwama (AIIMS Awantipora)", 3700, "6.0% YoY"),
        ("Kathua (Industrial Border SEZ)", 3600, "5.8% YoY"),
        ("Udhampur (Northern Command)", 3800, "6.1% YoY"),
        ("Samba (Industrial Corridor)", 3500, "5.7% YoY"),
        ("Reasi (Katra / Vaishno Devi)", 4800, "7.8% YoY"),
        ("Rajouri", 3200, "5.3% YoY"),
        ("Poonch", 3000, "5.0% YoY"),
        ("Kupwara", 3100, "5.1% YoY"),
        ("Bandipora (Wular Lake)", 3100, "5.1% YoY"),
        ("Shopian (Apple Valley)", 3300, "5.4% YoY"),
        ("Kulgam", 3100, "5.1% YoY"),
        ("Doda", 3000, "5.0% YoY"),
        ("Ramban (Chenab Bridge Axis)", 3100, "5.2% YoY"),
        ("Kishtwar", 2900, "4.8% YoY")
    ],
    "Ladakh": [
        ("Leh (Capital Core & Nubra Axis)", 5200, "7.8% YoY"),
        ("Kargil (Suru Valley)", 3600, "5.7% YoY")
    ],
    "Lakshadweep": [
        ("Lakshadweep (Kavaratti / Agatti / Minicoy)", 4600, "6.8% YoY")
    ],
    "Puducherry (UT)": [
        ("Puducherry (French Quarter / Lawspet)", 5600, "7.6% YoY"),
        ("Karaikal (Port Hub)", 3700, "5.9% YoY"),
        ("Mahe (Arabian Coast)", 4100, "6.2% YoY"),
        ("Yanam (Gautami Godavari)", 3600, "5.8% YoY")
    ]
}

for ut_name, dlist in ut_dict.items():
    for name, rate, growth in dlist:
        add_std_dist(ut_name, name, rate, growth)

# Output build
all_districts = []
seen_ids = set()

for state_name in sorted(STATE_MAP.keys()):
    districts = STATE_MAP[state_name]
    for d in districts:
        did = slugify(state_name, d["name"])
        idx = 2
        orig_id = did
        while did in seen_ids:
            did = f"{orig_id}-{idx}"
            idx += 1
        seen_ids.add(did)
        
        all_districts.append({
            "id": did,
            "name": d["name"],
            "state": state_name,
            "category": "non-metro",
            "hasMetro": False,
            "avgRateSqft": d["avgRateSqft"],
            "baseGrowth": d["baseGrowth"],
            "localities": d["localities"]
        })

print(f"Total processed districts across all States and UTs: {len(all_districts)}")

# Write to allIndiaDistricts.js
target_path = r"d:/Hackathon/portal/src/data/allIndiaDistricts.js"
with open(target_path, "w", encoding="utf-8") as f:
    f.write("/**\n")
    f.write(" * Complete All-India States, Union Territories, Districts & Micro-Markets Registry\n")
    f.write(" * Comprehensive dataset containing 100% of all official revenue districts in India.\n")
    f.write(" */\n\n")
    f.write("export const ALL_INDIA_NON_METRO_DISTRICTS = ")
    f.write(json.dumps(all_districts, indent=2, ensure_ascii=False))
    f.write(";\n")

print("Successfully written to", target_path)
