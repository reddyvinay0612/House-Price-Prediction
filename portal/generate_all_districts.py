# -*- coding: utf-8 -*-
import os
import json
import re

# Comprehensive Master Data of all 28 States + 8 Union Territories and ALL their districts in India
# Total districts across India: ~780+

STATE_DISTRICTS = {
    # -------------------------------------------------------------
    # 1. ANDHRA PRADESH (26 Districts)
    # -------------------------------------------------------------
    "Andhra Pradesh": [
        ("Alluri Sitharama Raju (Paderu)", 2800, "5.2% YoY", [
            ("Paderu Main Town", 3200, "Administrative Core"),
            ("Araku Valley Highway", 3600, "Tourism & Scenic Corridor"),
            ("Chintapalli Road", 2700, "Suburban Hub"),
            ("Rampachodavaram Market", 2500, "Town Center"),
            ("Other Localities", 2200, "Periphery")
        ]),
        ("Anakapalli", 3800, "7.4% YoY", [
            ("Ring Road / Station Area", 4600, "Commercial Core"),
            ("Jawahar Autonagar", 4100, "Industrial & Transport Hub"),
            ("Pudimadaka Road", 3700, "Expansion Zone"),
            ("Kasimkota Node", 3300, "Residential Suburb"),
            ("Other Localities", 2900, "Periphery")
        ]),
        ("Ananthapuramu", 3500, "5.8% YoY", [
            ("Clock Tower / Subhash Road", 4900, "Commercial Core"),
            ("Rudrampeta Bypass", 3900, "NH44 Growth Corridor"),
            ("Housing Board Colony / R.F. Road", 3600, "Residential Hub"),
            ("SK University Road", 3300, "Institutional Zone"),
            ("Other Localities", 2700, "Greater Anantapur")
        ]),
        ("Annamayya (Rayachoti)", 3100, "5.4% YoY", [
            ("Rayachoti Main Bazaar / Bus Stand", 3900, "Town Core"),
            ("Madanapalle Town Center", 4200, "Commercial Hub"),
            ("Kadapa Road Junction", 3200, "Expansion Zone"),
            ("Horsley Hills Link Road", 3100, "Suburban Axis"),
            ("Other Localities", 2500, "Periphery")
        ]),
        ("Bapatla", 3300, "6.0% YoY", [
            ("Surya Lanka Beach Road", 4200, "Coastal Scenic Hub"),
            ("Town Railway Station Road", 3700, "Central Market"),
            ("Agricultural College Corridor", 3200, "Institutional Zone"),
            ("Chirala Highway Node", 3500, "Textile & Trade Hub"),
            ("Other Localities", 2600, "Periphery")
        ]),
        ("Chittoor", 3600, "6.3% YoY", [
            ("High Street / Gandhi Road", 4800, "Commercial Central"),
            ("Greamspet / Murakambattu", 3900, "Prime Residential"),
            ("Bangalore-Chennai Highway Axis", 3800, "NH Industrial Corridor"),
            ("GD Nellore Road", 3200, "Growth Suburb"),
            ("Other Localities", 2700, "Greater Chittoor")
        ]),
        ("Dr. B.R. Ambedkar Konaseema (Amalapuram)", 3400, "5.9% YoY", [
            ("Amalapuram Clock Tower / Market", 4400, "Central Commercial"),
            ("Ravulapalem NH16 Hub", 3800, "Transit & Trade Corridor"),
            ("Razole Canal Road", 3300, "Scenic Residential"),
            ("Mummidivaram Road", 3100, "Growth Suburb"),
            ("Other Localities", 2600, "Periphery")
        ]),
        ("East Godavari (Rajahmundry)", 4500, "7.8% YoY", [
            ("Danavaipeta / Main Road", 6200, "Prime Commercial"),
            ("Morampudi Junction (NH16)", 4900, "Highway Corridor"),
            ("VL Puram / Prakash Nagar", 4700, "Established Residential"),
            ("Diwancheruvu Educational Hub", 3900, "Institutional North"),
            ("Other Localities", 3200, "Greater Rajahmundry")
        ]),
        ("Eluru", 3500, "5.7% YoY", [
            ("Sanivarapupeta / RR Pet", 4600, "Central Prime"),
            ("Powerpet Railway Station Area", 3900, "Commercial Core"),
            ("Bypass Junction / NH16", 3700, "Highway Growth"),
            ("Tangellamudi", 3100, "Expansion Zone"),
            ("Other Localities", 2600, "Greater Eluru")
        ]),
        ("Guntur", 4200, "6.8% YoY", [
            ("Lakshmipuram / Brodipet", 5800, "Prime Commercial"),
            ("Pattabhipuram / Vidyanagar", 5100, "Established Residential"),
            ("Amaravati Road Corridor", 4400, "Capital Link Axis"),
            ("Nallapadu / Inner Ring Road", 3700, "Expansion Suburb"),
            ("Other Localities", 3000, "Greater Guntur")
        ]),
        ("Kakinada", 4600, "7.5% YoY", [
            ("Suryaraopeta / Main Road", 6400, "Heritage Commercial"),
            ("Bhanugudi Junction / Nagamalli Thota", 5200, "Prime Residential"),
            ("Smart City Beach Corridor / Port Road", 4900, "Waterfront Tech Zone"),
            ("Achampeta / Madhavapatnam", 3900, "Industrial Corridor"),
            ("Other Localities", 3200, "Greater Kakinada")
        ]),
        ("Krishna (Machilipatnam)", 3400, "6.1% YoY", [
            ("Koneru Center / Main Bazaar", 4300, "Commercial Heart"),
            ("Port Road Corridor", 3800, "Deep Sea Port Zone"),
            ("Buttaipeta / Rajupeta", 3500, "Residential Central"),
            ("Pedana Handloom Belt", 2900, "Textile Suburb"),
            ("Other Localities", 2500, "Periphery")
        ]),
        ("Kurnool", 3700, "6.0% YoY", [
            ("Mourya Inn Road / Nandyal Checkpost", 5100, "Commercial Core"),
            ("B-Camp / Joharapuram", 4200, "Established Residential"),
            ("Venkayapalli / NH44 Bypass", 3800, "High Growth Corridor"),
            ("Santosh Nagar / Krishna Nagar", 3500, "Suburban Residential"),
            ("Other Localities", 2800, "Greater Kurnool")
        ]),
        ("Nandyal", 3300, "5.6% YoY", [
            ("Sanjeeva Nagar / Bus Stand", 4200, "Commercial Core"),
            ("Srinivasa Nagar / NGO Colony", 3600, "Prime Residential"),
            ("Allagadda Road Junction", 3200, "Highway Corridor"),
            ("Mahanandi Link Road", 3000, "Expansion Zone"),
            ("Other Localities", 2500, "Greater Nandyal")
        ]),
        ("NTR (Vijayawada Outer & Rural)", 4900, "7.6% YoY", [
            ("Benz Circle / MG Road", 7800, "Commercial Core"),
            ("Moghalrajpuram / Governorpet", 6900, "Prime Residential"),
            ("Poranki / Penamaluru", 4300, "Growth Suburb"),
            ("Ibrahimpatnam / Ferry Hub", 4100, "Riverside Tech Zone"),
            ("Other Localities", 3400, "Greater Vijayawada")
        ]),
        ("Palnadu (Narasaraopet)", 3200, "5.4% YoY", [
            ("Prakash Nagar / Station Road", 4100, "Town Commercial"),
            ("Guntur Road Bypass", 3500, "Expansion Corridor"),
            ("Sattenapalle Town Center", 3300, "Market Hub"),
            ("Vinukonda Road Node", 2900, "Suburban Axis"),
            ("Other Localities", 2400, "Periphery")
        ]),
        ("Parvathipuram Manyam", 2700, "4.8% YoY", [
            ("Main Bazaar / Station Road", 3400, "Commercial Center"),
            ("Salur Town Junction", 3000, "Trade Hub"),
            ("Palakonda Road", 2600, "Residential Suburb"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Prakasam (Ongole)", 3600, "6.2% YoY", [
            ("Kurnool Road / Lawyerpet", 4900, "Commercial Center"),
            ("Gopal Nagar / Housing Board", 4000, "Prime Residential"),
            ("NH16 Bypass / Pernamitta", 3700, "Growth Corridor"),
            ("Santhanuthalapadu Axis", 3100, "Expansion Zone"),
            ("Other Localities", 2600, "Greater Ongole")
        ]),
        ("Sri Potti Sriramulu Nellore", 3800, "6.0% YoY", [
            ("Magunta Layout / Trunk Road", 5400, "Prime Commercial"),
            ("Vedayapalem / Podalakur Road", 4300, "Residential Growth"),
            ("Dargamitta / Haranathapuram", 4700, "Central Residential"),
            ("Krishnapatnam Port Link", 3600, "Industrial Port Axis"),
            ("Other Localities", 2800, "Greater Nellore")
        ]),
        ("Sri Sathya Sai (Puttaparthi)", 3400, "5.8% YoY", [
            ("Ashram Main Road / Gopuram Road", 4700, "Spiritual & International Core"),
            ("Dharmavaram Silk Hub", 3800, "Handloom Trade Center"),
            ("Kadiri Bypass Junction", 3200, "Highway Corridor"),
            ("Airport Link Corridor", 3500, "Institutional Zone"),
            ("Other Localities", 2600, "Periphery")
        ]),
        ("Srikakulam", 3300, "5.5% YoY", [
            ("Seven Road Junction / GT Road", 4400, "Commercial Core"),
            ("Palakonda Road / Balaga", 3600, "Prime Residential"),
            ("RIMS Medical College Road", 3400, "Institutional Hub"),
            ("Amadalavalasa Link Node", 3000, "Industrial Transit"),
            ("Other Localities", 2400, "Greater Srikakulam")
        ]),
        ("Tirupati", 4600, "7.9% YoY", [
            ("Alipiri Road / KT Road", 6700, "Pilgrimage Prime"),
            ("MR Palli / Korlagunta", 5400, "Central Residential"),
            ("Renigunta / Airport Road", 4500, "Electronics & Transit Hub"),
            ("Chandragiri Bypass", 3900, "Growth Suburb"),
            ("Other Localities", 3200, "Greater Tirupati")
        ]),
        ("Visakhapatnam (Vizag Non-Metro Belt)", 5600, "8.9% YoY", [
            ("MVP Colony / Beach Road", 8200, "Prime Coastal"),
            ("Rushikonda (IT Corridor)", 6800, "Beach Tech Hub"),
            ("Madhurawada", 5200, "IT & Educational Zone"),
            ("Gajuwaka / Steel Plant Hub", 4200, "Industrial South"),
            ("Bheemili Coastal Highway", 4800, "Scenic Waterfront"),
            ("Other Localities", 3600, "Greater Vizag")
        ]),
        ("Vizianagaram", 3400, "5.8% YoY", [
            ("Cantonment / Ring Road", 4600, "Prime Residential"),
            ("MG Road / Clock Tower", 4400, "Commercial Core"),
            ("Phool Bagh / Collectorate", 3700, "Administrative Zone"),
            ("Kothavalasa Industrial Axis", 3100, "Transit Hub"),
            ("Other Localities", 2500, "Greater Vizianagaram")
        ]),
        ("West Godavari (Bhimavaram)", 3800, "6.5% YoY", [
            ("PP Road / Somaram Road", 5100, "Commercial Core"),
            ("SRKR Engineering College Zone", 4200, "Educational Corridor"),
            ("Undi Road / Housing Colony", 3700, "Residential Hub"),
            ("Tadepalligudem NH16 Hub", 3900, "Agro Trade Hub"),
            ("Other Localities", 2900, "Greater Bhimavaram")
        ]),
        ("YSR Kadapa", 3500, "5.6% YoY", [
            ("Seven Wells / Nagarajupeta", 4700, "Central Commercial"),
            ("RIMS / Chemmumiahpeta", 3900, "Institutional Zone"),
            ("Bellary Road / Airport Axis", 3700, "Growth Corridor"),
            ("Rayachoti Road Junction", 3300, "Suburban Node"),
            ("Other Localities", 2700, "Greater Kadapa")
        ])
    ],

    # -------------------------------------------------------------
    # 2. ARUNACHAL PRADESH (26 Districts)
    # -------------------------------------------------------------
    "Arunachal Pradesh": [
        ("Itanagar Capital Complex", 3900, "6.2% YoY", [
            ("Ganga Market / Bank Tinali", 5200, "Commercial Core"),
            ("Naharlagun / Polo Colony", 4400, "Railway & Trade Hub"),
            ("Chandranagar / Vivek Vihar", 4200, "Prime Residential"),
            ("Nirjuli (NERIST Zone)", 3600, "Educational Corridor"),
            ("Other Localities", 2900, "Periphery")
        ]),
        ("Tawang", 3400, "5.5% YoY", [
            ("Old Market / Monastery Road", 4600, "Tourism & Heritage Core"),
            ("Circuit House Area", 3800, "Administrative Zone"),
            ("New Market / Nehru Market", 3600, "Commercial Zone"),
            ("Other Localities", 2600, "Periphery")
        ]),
        ("East Siang (Pasighat)", 3200, "5.8% YoY", [
            ("Main Bazaar / DC Office Road", 4100, "Town Core"),
            ("Smart City Promenade / Siang Riverfront", 3700, "Waterfront Zone"),
            ("Gumin Nagar", 3300, "Residential Area"),
            ("Other Localities", 2500, "Periphery")
        ]),
        ("West Kameng (Bomdila)", 3000, "5.1% YoY", [
            ("Bomdila Main Market", 3800, "Town Commercial"),
            ("Dirang Tourist Valley", 3400, "Hospitality Corridor"),
            ("Rupa Town Area", 2900, "Suburban Hub"),
            ("Other Localities", 2400, "Periphery")
        ]),
        ("Lower Subansiri (Ziro)", 3100, "5.7% YoY", [
            ("Hapoli Market / Old Ziro", 4000, "Cultural & Town Core"),
            ("Pine Grove / Circuit House", 3400, "Scenic Residential"),
            ("Other Localities", 2500, "Periphery")
        ]),
        ("Papum Pare (Yupia)", 3300, "5.6% YoY", [
            ("Yupia Administrative HQ", 3900, "Government Center"),
            ("Doimukh Town Junction", 3500, "Transit Hub"),
            ("Other Localities", 2700, "Periphery")
        ]),
        ("Namsai", 2900, "5.4% YoY", [
            ("Golden Pagoda Corridor", 3600, "Tourism Hub"),
            ("Namsai Main Market", 3300, "Commercial Area"),
            ("Chowkham Road", 2800, "Suburban Zone"),
            ("Other Localities", 2300, "Periphery")
        ]),
        ("Changlang", 2700, "4.8% YoY", [
            ("Main Market / DC Office", 3300, "Administrative Core"),
            ("Miao Tourist Hub", 3100, "Eco-tourism Zone"),
            ("Jairampur Highway", 2700, "Border Trade Axis"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Lohit (Tezu)", 2800, "5.0% YoY", [
            ("Tezu Bazaar / Airport Road", 3500, "Town Hub"),
            ("Parasuram Kund Road", 3000, "Pilgrimage Axis"),
            ("Other Localities", 2200, "Periphery")
        ]),
        ("Lower Dibang Valley (Roing)", 2900, "5.2% YoY", [
            ("Roing Town Market", 3600, "Commercial Heart"),
            ("Mayudia Pass Link", 3100, "Tourism Corridor"),
            ("Other Localities", 2300, "Periphery")
        ]),
        ("West Siang (Aalo)", 2900, "5.0% YoY", [
            ("Aalo Main Market / Nehru Chowk", 3600, "Commercial Area"),
            ("Puak Gumin Colony", 3100, "Residential Zone"),
            ("Other Localities", 2300, "Periphery")
        ]),
        ("Upper Subansiri (Daporijo)", 2700, "4.7% YoY", [
            ("Daporijo Town Market", 3300, "Town Center"),
            ("Circuit House Area", 2900, "Administrative Zone"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Tirap (Khonsa)", 2600, "4.5% YoY", [
            ("Khonsa Bazaar", 3200, "Commercial Core"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Longding", 2500, "4.4% YoY", [
            ("Longding Town HQ", 3000, "Central Market"),
            ("Other Localities", 2000, "Periphery")
        ]),
        ("Upper Siang (Yingkiong)", 2600, "4.6% YoY", [
            ("Yingkiong Main Town", 3200, "Town Core"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Dibang Valley (Anini)", 2500, "4.5% YoY", [
            ("Anini Town HQ", 3000, "Administrative Center"),
            ("Other Localities", 2000, "Periphery")
        ]),
        ("Anjaw (Hawai)", 2400, "4.3% YoY", [
            ("Hawai HQ / Hayuliang", 2900, "Border Hub"),
            ("Other Localities", 1900, "Periphery")
        ]),
        ("East Kameng (Seppa)", 2700, "4.7% YoY", [
            ("Seppa Main Town", 3300, "District HQ"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Kurung Kumey (Koloriang)", 2400, "4.2% YoY", [
            ("Koloriang Town", 2900, "District HQ"),
            ("Other Localities", 1900, "Periphery")
        ]),
        ("Kra Daadi (Jamin)", 2400, "4.2% YoY", [
            ("Palin / Jamin Town", 2900, "Town Center"),
            ("Other Localities", 1900, "Periphery")
        ]),
        ("Lower Siang (Likabali)", 2700, "4.8% YoY", [
            ("Likabali Town", 3300, "Gateway Hub"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Lepa Rada (Basar)", 2700, "4.8% YoY", [
            ("Basar Town Center", 3300, "District HQ"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Shi Yomi (Tato)", 2500, "4.4% YoY", [
            ("Mechuka Valley Hub", 3400, "Tourism Gem"),
            ("Tato Town HQ", 2800, "Administrative Center"),
            ("Other Localities", 2000, "Periphery")
        ]),
        ("Kamle (Raga)", 2500, "4.4% YoY", [
            ("Raga HQ", 3000, "District HQ"),
            ("Other Localities", 2000, "Periphery")
        ]),
        ("Pakke Kessang (Lemmi)", 2600, "4.6% YoY", [
            ("Lemmi / Seijosa", 3100, "District Center"),
            ("Other Localities", 2100, "Periphery")
        ]),
        ("Siang (Boleng)", 2600, "4.6% YoY", [
            ("Boleng Town Market", 3200, "District HQ"),
            ("Pangin Junction", 2900, "Transit Hub"),
            ("Other Localities", 2100, "Periphery")
        ])
    ]
}

print("Base definition initiated")
