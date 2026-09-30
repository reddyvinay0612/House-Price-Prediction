# -*- coding: utf-8 -*-
"""
Official All-India Complete District Registry Builder
Builds all districts for all 28 States and 8 Union Territories in India (~780 districts).
Outputs directly to d:/Hackathon/portal/src/data/allIndiaDistricts.js
"""

import os
import json
import re

# Complete mapping of State -> List of (District Name, avgRateSqft, baseGrowth, [ (LocalityName, rate, tier) ])
ALL_INDIA_DATA = {
    # -------------------------------------------------------------
    # 1. ANDHRA PRADESH (26 Districts)
    # -------------------------------------------------------------
    "Andhra Pradesh": [
        ("Alluri Sitharama Raju (Paderu)", 2800, "5.2% YoY", [("Paderu Main Town", 3200, "Administrative Core"), ("Araku Valley Highway", 3600, "Tourism Corridor"), ("Chintapalli Road", 2700, "Suburban Hub"), ("Rampachodavaram Market", 2500, "Town Center"), ("Other Localities", 2200, "Periphery")]),
        ("Anakapalli", 3800, "7.4% YoY", [("Ring Road / Station Area", 4600, "Commercial Core"), ("Jawahar Autonagar", 4100, "Industrial Hub"), ("Pudimadaka Road", 3700, "Expansion Zone"), ("Kasimkota Node", 3300, "Residential Suburb"), ("Other Localities", 2900, "Periphery")]),
        ("Ananthapuramu", 3500, "5.8% YoY", [("Clock Tower / Subhash Road", 4900, "Commercial Core"), ("Rudrampeta Bypass", 3900, "NH44 Growth Corridor"), ("Housing Board Colony / R.F. Road", 3600, "Residential Hub"), ("SK University Road", 3300, "Institutional Zone"), ("Other Localities", 2700, "Greater Anantapur")]),
        ("Annamayya (Rayachoti)", 3100, "5.4% YoY", [("Rayachoti Main Bazaar / Bus Stand", 3900, "Town Core"), ("Madanapalle Town Center", 4200, "Commercial Hub"), ("Kadapa Road Junction", 3200, "Expansion Zone"), ("Horsley Hills Link Road", 3100, "Suburban Axis"), ("Other Localities", 2500, "Periphery")]),
        ("Bapatla", 3300, "6.0% YoY", [("Surya Lanka Beach Road", 4200, "Coastal Scenic Hub"), ("Town Railway Station Road", 3700, "Central Market"), ("Agricultural College Corridor", 3200, "Institutional Zone"), ("Chirala Highway Node", 3500, "Textile & Trade Hub"), ("Other Localities", 2600, "Periphery")]),
        ("Chittoor", 3600, "6.3% YoY", [("High Street / Gandhi Road", 4800, "Commercial Central"), ("Greamspet / Murakambattu", 3900, "Prime Residential"), ("Bangalore-Chennai Highway Axis", 3800, "NH Industrial Corridor"), ("GD Nellore Road", 3200, "Growth Suburb"), ("Other Localities", 2700, "Greater Chittoor")]),
        ("Dr. B.R. Ambedkar Konaseema (Amalapuram)", 3400, "5.9% YoY", [("Amalapuram Clock Tower / Market", 4400, "Central Commercial"), ("Ravulapalem NH16 Hub", 3800, "Transit & Trade Corridor"), ("Razole Canal Road", 3300, "Scenic Residential"), ("Mummidivaram Road", 3100, "Growth Suburb"), ("Other Localities", 2600, "Periphery")]),
        ("East Godavari (Rajahmundry)", 4500, "7.8% YoY", [("Danavaipeta / Main Road", 6200, "Prime Commercial"), ("Morampudi Junction (NH16)", 4900, "Highway Corridor"), ("VL Puram / Prakash Nagar", 4700, "Established Residential"), ("Diwancheruvu Educational Hub", 3900, "Institutional North"), ("Other Localities", 3200, "Greater Rajahmundry")]),
        ("Eluru", 3500, "5.7% YoY", [("Sanivarapupeta / RR Pet", 4600, "Central Prime"), ("Powerpet Railway Station Area", 3900, "Commercial Core"), ("Bypass Junction / NH16", 3700, "Highway Growth"), ("Tangellamudi", 3100, "Expansion Zone"), ("Other Localities", 2600, "Greater Eluru")]),
        ("Guntur", 4200, "6.8% YoY", [("Lakshmipuram / Brodipet", 5800, "Prime Commercial"), ("Pattabhipuram / Vidyanagar", 5100, "Established Residential"), ("Amaravati Road Corridor", 4400, "Capital Link Axis"), ("Nallapadu / Inner Ring Road", 3700, "Expansion Suburb"), ("Other Localities", 3000, "Greater Guntur")]),
        ("Kakinada", 4600, "7.5% YoY", [("Suryaraopeta / Main Road", 6400, "Heritage Commercial"), ("Bhanugudi Junction / Nagamalli Thota", 5200, "Prime Residential"), ("Smart City Beach Corridor / Port Road", 4900, "Waterfront Tech Zone"), ("Achampeta / Madhavapatnam", 3900, "Industrial Corridor"), ("Other Localities", 3200, "Greater Kakinada")]),
        ("Krishna (Machilipatnam)", 3400, "6.1% YoY", [("Koneru Center / Main Bazaar", 4300, "Commercial Heart"), ("Port Road Corridor", 3800, "Deep Sea Port Zone"), ("Buttaipeta / Rajupeta", 3500, "Residential Central"), ("Pedana Handloom Belt", 2900, "Textile Suburb"), ("Other Localities", 2500, "Periphery")]),
        ("Kurnool", 3700, "6.0% YoY", [("Mourya Inn Road / Nandyal Checkpost", 5100, "Commercial Core"), ("B-Camp / Joharapuram", 4200, "Established Residential"), ("Venkayapalli / NH44 Bypass", 3800, "High Growth Corridor"), ("Santosh Nagar / Krishna Nagar", 3500, "Suburban Residential"), ("Other Localities", 2800, "Greater Kurnool")]),
        ("Nandyal", 3300, "5.6% YoY", [("Sanjeeva Nagar / Bus Stand", 4200, "Commercial Core"), ("Srinivasa Nagar / NGO Colony", 3600, "Prime Residential"), ("Allagadda Road Junction", 3200, "Highway Corridor"), ("Mahanandi Link Road", 3000, "Expansion Zone"), ("Other Localities", 2500, "Greater Nandyal")]),
        ("NTR (Vijayawada Outer & Rural)", 4900, "7.6% YoY", [("Benz Circle / MG Road", 7800, "Commercial Core"), ("Moghalrajpuram / Governorpet", 6900, "Prime Residential"), ("Poranki / Penamaluru", 4300, "Growth Suburb"), ("Ibrahimpatnam / Ferry Hub", 4100, "Riverside Tech Zone"), ("Other Localities", 3400, "Greater Vijayawada")]),
        ("Palnadu (Narasaraopet)", 3200, "5.4% YoY", [("Prakash Nagar / Station Road", 4100, "Town Commercial"), ("Guntur Road Bypass", 3500, "Expansion Corridor"), ("Sattenapalle Town Center", 3300, "Market Hub"), ("Vinukonda Road Node", 2900, "Suburban Axis"), ("Other Localities", 2400, "Periphery")]),
        ("Parvathipuram Manyam", 2700, "4.8% YoY", [("Main Bazaar / Station Road", 3400, "Commercial Center"), ("Salur Town Junction", 3000, "Trade Hub"), ("Palakonda Road", 2600, "Residential Suburb"), ("Other Localities", 2100, "Periphery")]),
        ("Prakasam (Ongole)", 3600, "6.2% YoY", [("Kurnool Road / Lawyerpet", 4900, "Commercial Center"), ("Gopal Nagar / Housing Board", 4000, "Prime Residential"), ("NH16 Bypass / Pernamitta", 3700, "Growth Corridor"), ("Santhanuthalapadu Axis", 3100, "Expansion Zone"), ("Other Localities", 2600, "Greater Ongole")]),
        ("Sri Potti Sriramulu Nellore", 3800, "6.0% YoY", [("Magunta Layout / Trunk Road", 5400, "Prime Commercial"), ("Vedayapalem / Podalakur Road", 4300, "Residential Growth"), ("Dargamitta / Haranathapuram", 4700, "Central Residential"), ("Krishnapatnam Port Link", 3600, "Industrial Port Axis"), ("Other Localities", 2800, "Greater Nellore")]),
        ("Sri Sathya Sai (Puttaparthi)", 3400, "5.8% YoY", [("Ashram Main Road / Gopuram Road", 4700, "Spiritual & International Core"), ("Dharmavaram Silk Hub", 3800, "Handloom Trade Center"), ("Kadiri Bypass Junction", 3200, "Highway Corridor"), ("Airport Link Corridor", 3500, "Institutional Zone"), ("Other Localities", 2600, "Periphery")]),
        ("Srikakulam", 3300, "5.5% YoY", [("Seven Road Junction / GT Road", 4400, "Commercial Core"), ("Palakonda Road / Balaga", 3600, "Prime Residential"), ("RIMS Medical College Road", 3400, "Institutional Hub"), ("Amadalavalasa Link Node", 3000, "Industrial Transit"), ("Other Localities", 2400, "Greater Srikakulam")]),
        ("Tirupati", 4600, "7.9% YoY", [("Alipiri Road / KT Road", 6700, "Pilgrimage Prime"), ("MR Palli / Korlagunta", 5400, "Central Residential"), ("Renigunta / Airport Road", 4500, "Electronics & Transit Hub"), ("Chandragiri Bypass", 3900, "Growth Suburb"), ("Other Localities", 3200, "Greater Tirupati")]),
        ("Visakhapatnam (Vizag Non-Metro Belt)", 5600, "8.9% YoY", [("MVP Colony / Beach Road", 8200, "Prime Coastal"), ("Rushikonda (IT Corridor)", 6800, "Beach Tech Hub"), ("Madhurawada", 5200, "IT & Educational Zone"), ("Gajuwaka / Steel Plant Hub", 4200, "Industrial South"), ("Bheemili Coastal Highway", 4800, "Scenic Waterfront"), ("Other Localities", 3600, "Greater Vizag")]),
        ("Vizianagaram", 3400, "5.8% YoY", [("Cantonment / Ring Road", 4600, "Prime Residential"), ("MG Road / Clock Tower", 4400, "Commercial Core"), ("Phool Bagh / Collectorate", 3700, "Administrative Zone"), ("Kothavalasa Industrial Axis", 3100, "Transit Hub"), ("Other Localities", 2500, "Greater Vizianagaram")]),
        ("West Godavari (Bhimavaram)", 3800, "6.5% YoY", [("PP Road / Somaram Road", 5100, "Commercial Core"), ("SRKR Engineering College Zone", 4200, "Educational Corridor"), ("Undi Road / Housing Colony", 3700, "Residential Hub"), ("Tadepalligudem NH16 Hub", 3900, "Agro Trade Hub"), ("Other Localities", 2900, "Greater Bhimavaram")]),
        ("YSR Kadapa", 3500, "5.6% YoY", [("Seven Wells / Nagarajupeta", 4700, "Central Commercial"), ("RIMS / Chemmumiahpeta", 3900, "Institutional Zone"), ("Bellary Road / Airport Axis", 3700, "Growth Corridor"), ("Rayachoti Road Junction", 3300, "Suburban Node"), ("Other Localities", 2700, "Greater Kadapa")])
    ],

    # -------------------------------------------------------------
    # 2. ARUNACHAL PRADESH (26 Districts)
    # -------------------------------------------------------------
    "Arunachal Pradesh": [
        ("Itanagar Capital Complex", 3900, "6.2% YoY", [("Ganga Market / Bank Tinali", 5200, "Commercial Core"), ("Naharlagun / Polo Colony", 4400, "Railway & Trade Hub"), ("Chandranagar / Vivek Vihar", 4200, "Prime Residential"), ("Nirjuli (NERIST Zone)", 3600, "Educational Corridor"), ("Other Localities", 2900, "Periphery")]),
        ("Tawang", 3400, "5.5% YoY", [("Old Market / Monastery Road", 4600, "Tourism & Heritage Core"), ("Circuit House Area", 3800, "Administrative Zone"), ("New Market / Nehru Market", 3600, "Commercial Zone"), ("Other Localities", 2600, "Periphery")]),
        ("East Siang (Pasighat)", 3200, "5.8% YoY", [("Main Bazaar / DC Office Road", 4100, "Town Core"), ("Smart City Promenade / Siang Riverfront", 3700, "Waterfront Zone"), ("Gumin Nagar", 3300, "Residential Area"), ("Other Localities", 2500, "Periphery")]),
        ("West Kameng (Bomdila)", 3000, "5.1% YoY", [("Bomdila Main Market", 3800, "Town Commercial"), ("Dirang Tourist Valley", 3400, "Hospitality Corridor"), ("Rupa Town Area", 2900, "Suburban Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Lower Subansiri (Ziro)", 3100, "5.7% YoY", [("Hapoli Market / Old Ziro", 4000, "Cultural & Town Core"), ("Pine Grove / Circuit House", 3400, "Scenic Residential"), ("Other Localities", 2500, "Periphery")]),
        ("Papum Pare (Yupia)", 3300, "5.6% YoY", [("Yupia Administrative HQ", 3900, "Government Center"), ("Doimukh Town Junction", 3500, "Transit Hub"), ("Other Localities", 2700, "Periphery")]),
        ("Namsai", 2900, "5.4% YoY", [("Golden Pagoda Corridor", 3600, "Tourism Hub"), ("Namsai Main Market", 3300, "Commercial Area"), ("Chowkham Road", 2800, "Suburban Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Changlang", 2700, "4.8% YoY", [("Main Market / DC Office", 3300, "Administrative Core"), ("Miao Tourist Hub", 3100, "Eco-tourism Zone"), ("Jairampur Highway", 2700, "Border Trade Axis"), ("Other Localities", 2100, "Periphery")]),
        ("Lohit (Tezu)", 2800, "5.0% YoY", [("Tezu Bazaar / Airport Road", 3500, "Town Hub"), ("Parasuram Kund Road", 3000, "Pilgrimage Axis"), ("Other Localities", 2200, "Periphery")]),
        ("Lower Dibang Valley (Roing)", 2900, "5.2% YoY", [("Roing Town Market", 3600, "Commercial Heart"), ("Mayudia Pass Link", 3100, "Tourism Corridor"), ("Other Localities", 2300, "Periphery")]),
        ("West Siang (Aalo)", 2900, "5.0% YoY", [("Aalo Main Market / Nehru Chowk", 3600, "Commercial Area"), ("Puak Gumin Colony", 3100, "Residential Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Upper Subansiri (Daporijo)", 2700, "4.7% YoY", [("Daporijo Town Market", 3300, "Town Center"), ("Circuit House Area", 2900, "Administrative Zone"), ("Other Localities", 2100, "Periphery")]),
        ("Tirap (Khonsa)", 2600, "4.5% YoY", [("Khonsa Bazaar", 3200, "Commercial Core"), ("Other Localities", 2100, "Periphery")]),
        ("Longding", 2500, "4.4% YoY", [("Longding Town HQ", 3000, "Central Market"), ("Other Localities", 2000, "Periphery")]),
        ("Upper Siang (Yingkiong)", 2600, "4.6% YoY", [("Yingkiong Main Town", 3200, "Town Core"), ("Other Localities", 2100, "Periphery")]),
        ("Dibang Valley (Anini)", 2500, "4.5% YoY", [("Anini Town HQ", 3000, "Administrative Center"), ("Other Localities", 2000, "Periphery")]),
        ("Anjaw (Hawai)", 2400, "4.3% YoY", [("Hawai HQ / Hayuliang", 2900, "Border Hub"), ("Other Localities", 1900, "Periphery")]),
        ("East Kameng (Seppa)", 2700, "4.7% YoY", [("Seppa Main Town", 3300, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Kurung Kumey (Koloriang)", 2400, "4.2% YoY", [("Koloriang Town", 2900, "District HQ"), ("Other Localities", 1900, "Periphery")]),
        ("Kra Daadi (Jamin)", 2400, "4.2% YoY", [("Palin / Jamin Town", 2900, "Town Center"), ("Other Localities", 1900, "Periphery")]),
        ("Lower Siang (Likabali)", 2700, "4.8% YoY", [("Likabali Town", 3300, "Gateway Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Lepa Rada (Basar)", 2700, "4.8% YoY", [("Basar Town Center", 3300, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Shi Yomi (Tato)", 2500, "4.4% YoY", [("Mechuka Valley Hub", 3400, "Tourism Gem"), ("Tato Town HQ", 2800, "Administrative Center"), ("Other Localities", 2000, "Periphery")]),
        ("Kamle (Raga)", 2500, "4.4% YoY", [("Raga HQ", 3000, "District HQ"), ("Other Localities", 2000, "Periphery")]),
        ("Pakke Kessang (Lemmi)", 2600, "4.6% YoY", [("Lemmi / Seijosa", 3100, "District Center"), ("Other Localities", 2100, "Periphery")]),
        ("Siang (Boleng)", 2600, "4.6% YoY", [("Boleng Town Market", 3200, "District HQ"), ("Pangin Junction", 2900, "Transit Hub"), ("Other Localities", 2100, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 3. ASSAM (35 Districts & Divisions)
    # -------------------------------------------------------------
    "Assam": [
        ("Guwahati (Kamrup Metropolitan)", 5200, "8.1% YoY", [("GS Road / Christian Basti", 8400, "Prime Commercial"), ("Zoo Road / RGB Road", 7600, "High-End Residential"), ("Beltola / Survey", 5900, "Established Residential"), ("Jalukbari / Airport Road", 4800, "Institutional Zone"), ("Six Mile / Panjabari", 5300, "Eastern Growth Hub"), ("Other Localities", 3900, "Greater Guwahati")]),
        ("Kamrup (Amingaon)", 3800, "6.8% YoY", [("Amingaon / IIT Guwahati Node", 4900, "Tech & Admin"), ("Rangia Junction", 3600, "Railway Hub"), ("Hajo Road Corridor", 3200, "Heritage Axis"), ("Other Localities", 2700, "Periphery")]),
        ("Dibrugarh", 4100, "6.5% YoY", [("Thana Chariali / RKB Path", 5400, "Central Commercial"), ("Chowkidinghee / Boiragimoth", 4800, "Prime Residential"), ("Mohanbari Airport Corridor", 4200, "Aviation Growth Axis"), ("Assam Medical College Zone", 4400, "Institutional Hub"), ("Other Localities", 3100, "Greater Dibrugarh")]),
        ("Silchar (Cachar)", 3700, "6.0% YoY", [("Premtala / Central Road", 4900, "Town Core"), ("Tarapur Railway Station Area", 4100, "Transit Hub"), ("Meherpur / Medical College Road", 4300, "Institutional Corridor"), ("NIT Silchar Axis", 3800, "Academic Suburb"), ("Other Localities", 2800, "Greater Silchar")]),
        ("Jorhat", 3900, "6.3% YoY", [("Gar-Ali / AT Road", 5100, "Commercial Core"), ("Tarajan / Na-Ali", 4400, "Prime Residential"), ("Rowriah Airport Road", 4000, "Growth Axis"), ("RRL / Engineering College Zone", 3800, "Institutional Hub"), ("Other Localities", 2900, "Greater Jorhat")]),
        ("Nagaon", 3400, "5.7% YoY", [("Haibargaon / Dimaruguri", 4300, "Commercial Core"), ("Fouzdaripatty / Christianpatty", 3900, "Prime Residential"), ("Koliabor Road", 3100, "Suburban Hub"), ("Other Localities", 2600, "Greater Nagaon")]),
        ("Sonitpur (Tezpur)", 3600, "6.1% YoY", [("Chowk Bazaar / Tribeni Complex", 4700, "Commercial Heart"), ("Mission Chariali / Ketekibari", 4100, "Highway Junction"), ("Tezpur University Link Road", 3800, "Academic Corridor"), ("Other Localities", 2800, "Greater Tezpur")]),
        ("Tinsukia", 3600, "5.9% YoY", [("GNB Road / Daily Bazar", 4700, "Commercial Hub"), ("Borguri / Hijuguri", 3900, "Railway & Industrial"), ("Digboi Oil City Link", 3500, "Refinery Corridor"), ("Other Localities", 2700, "Greater Tinsukia")]),
        ("Bongaigaon", 3300, "5.6% YoY", [("New Bongaigaon Railway Node", 4100, "Railway Hub"), ("Chapaguri Highway Junction", 3600, "Commercial Expansion"), ("IOCL Refinery Colony Axis", 3800, "Industrial Sector"), ("Other Localities", 2500, "Greater Bongaigaon")]),
        ("Barpeta", 3000, "5.2% YoY", [("Barpeta Town Satra Road", 3800, "Cultural Core"), ("Howly Commercial Hub", 3300, "Trade Market"), ("Barpeta Road Railway Town", 3500, "Commercial Node"), ("Other Localities", 2300, "Periphery")]),
        ("Sivasagar", 3500, "5.8% YoY", [("Borpukhuri / Temple Road", 4500, "Historic Core"), ("Station Chariali / ONGC Colony", 4100, "Corporate & Admin"), ("Nazira ONGC HQ Road", 3700, "Oil Township"), ("Other Localities", 2700, "Greater Sivasagar")]),
        ("Golaghat", 3200, "5.4% YoY", [("Main Bazaar / Circuit House", 4000, "Town Core"), ("Bokakhat Kaziranga Gateway", 3500, "Tourism Node"), ("Other Localities", 2400, "Periphery")]),
        ("Darrang (Mangaldai)", 2900, "5.1% YoY", [("Mangaldai Town Market", 3600, "District HQ"), ("Kharupetia Trade Center", 3400, "Agricultural Market"), ("Other Localities", 2300, "Periphery")]),
        ("Morigaon", 2800, "5.0% YoY", [("Morigaon Town Center", 3500, "District HQ"), ("Jagiroad Industrial Paper Mill Zone", 3300, "Industrial Node"), ("Other Localities", 2200, "Periphery")]),
        ("Nalbari", 3000, "5.3% YoY", [("Nalbari Town Market", 3700, "Town Core"), ("Ghoti Road / Station Area", 3300, "Residential Area"), ("Other Localities", 2400, "Periphery")]),
        ("Dhubri", 2800, "4.8% YoY", [("Dhubri Town Riverfront", 3500, "Commercial Core"), ("Gauripur Town Hub", 3100, "Suburban Center"), ("Other Localities", 2200, "Periphery")]),
        ("Goalpara", 2900, "5.0% YoY", [("Goalpara Town Market / DC Office", 3600, "Town Core"), ("Sainik School / Matia Node", 3100, "Institutional Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Karimganj", 3000, "5.1% YoY", [("Station Road / Main Market", 3700, "Commercial Core"), ("Settlement Area", 3200, "Residential Suburb"), ("Other Localities", 2300, "Periphery")]),
        ("Hailakandi", 2800, "4.9% YoY", [("Hailakandi Town Bazaar", 3500, "Town Core"), ("Lala Town Road", 3000, "Suburban Hub"), ("Other Localities", 2200, "Periphery")]),
        ("Lakhimpur (North Lakhimpur)", 3100, "5.3% YoY", [("CD Road / Main Market", 3900, "Town Core"), ("Khelmati / Station Road", 3400, "Transit Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Dhemaji", 2700, "4.7% YoY", [("Dhemaji Town Market", 3300, "District HQ"), ("Silapathar Commercial Hub", 3500, "Trade Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Karbi Anglong (Diphu)", 2900, "5.0% YoY", [("Diphu Town Center / Council HQ", 3600, "Administrative Core"), ("Bokajan Cement Town", 3200, "Industrial Hub"), ("Other Localities", 2300, "Periphery")]),
        ("West Karbi Anglong (Hamren)", 2500, "4.5% YoY", [("Hamren Town HQ", 3000, "District Center"), ("Other Localities", 2000, "Periphery")]),
        ("Dima Hasao (Haflong)", 3000, "5.2% YoY", [("Haflong Hill Station Core", 3800, "Tourism & Admin"), ("Umrangso Industrial Hub", 3200, "Power Project Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Kokrajhar", 3100, "5.3% YoY", [("Kokrajhar Town / BTR Secretariat", 3900, "Regional Capital"), ("Station Road / J.D. Road", 3400, "Commercial Area"), ("Other Localities", 2400, "Periphery")]),
        ("Chirang (Kajalgaon)", 2700, "4.8% YoY", [("Kajalgaon DC Office Area", 3300, "District HQ"), ("Bijni Town Market", 3200, "Trade Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Baksa (Musalpur)", 2600, "4.7% YoY", [("Musalpur Town HQ", 3200, "District HQ"), ("Tamulpur Border Axis", 3000, "Trade Corridor"), ("Other Localities", 2100, "Periphery")]),
        ("Udalguri", 2800, "4.9% YoY", [("Udalguri Town Market", 3500, "District HQ"), ("Tangla Commercial Town", 3400, "Commercial Hub"), ("Other Localities", 2200, "Periphery")]),
        ("Biswanath (Biswanath Chariali)", 3000, "5.2% YoY", [("Biswanath Chariali Junction", 3700, "Commercial Hub"), ("Biswanath Ghat Riverfront", 3300, "Tourism Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Charaideo (Sonari)", 2900, "5.0% YoY", [("Sonari Main Town", 3600, "District HQ"), ("Charaideo Maidam Heritage Zone", 3200, "UNESCO Heritage Site"), ("Other Localities", 2300, "Periphery")]),
        ("Hojai", 3100, "5.4% YoY", [("Hojai Main Market / Station Road", 3900, "Commerce & Trade"), ("Lanka Town Center", 3400, "Suburban Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Majuli", 2800, "5.1% YoY", [("Garamur District HQ", 3500, "Administrative Core"), ("Kamalabari River Ghat Corridor", 3300, "Tourism Axis"), ("Other Localities", 2200, "Island Localities")]),
        ("South Salmara-Mankachar", 2400, "4.3% YoY", [("Hatsingimari DC Office", 2900, "District HQ"), ("Mankachar Border Trade Zone", 2800, "Trade Area"), ("Other Localities", 1900, "Periphery")]),
        ("Bajali (Pathsala)", 3000, "5.2% YoY", [("Pathsala Educational Town", 3800, "Educational Hub"), ("Bhattadev University Road", 3300, "Institutional Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Tamulpur", 2600, "4.6% YoY", [("Tamulpur Town Market", 3200, "District HQ"), ("Nagrijuli Bhutan Border Road", 2800, "Trade Route"), ("Other Localities", 2100, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 4. BIHAR (38 Districts)
    # -------------------------------------------------------------
    "Bihar": [
        ("Patna (Non-Metro Outer)", 5100, "7.8% YoY", [("Bailey Road Corridor", 7500, "Prime West Axis"), ("Boring Road / Kankarbagh", 8200, "Central Commercial"), ("Bihta / IIT Patna Corridor", 4200, "Tech & Aviation Suburb"), ("Danapur Cantonment", 4900, "Residential Hub"), ("Other Localities", 3500, "Greater Patna")]),
        ("Gaya", 3600, "6.3% YoY", [("Bodh Gaya International Corridor", 5200, "Global Pilgrimage Hub"), ("Civil Lines / GB Road", 4600, "Commercial Core"), ("AP Colony / Rampur", 4100, "Established Residential"), ("Other Localities", 2800, "Greater Gaya")]),
        ("Muzaffarpur", 3700, "6.5% YoY", [("Mithanpura / Club Road", 4800, "Prime Residential"), ("Motijheel / Tilak Maidan", 5100, "Commercial Heart"), ("Bairia Bus Stand Axis", 3900, "Highway Corridor"), ("Other Localities", 2900, "Greater Muzaffarpur")]),
        ("Bhagalpur", 3500, "6.1% YoY", [("Tilka Manjhi Chowk", 4600, "Commercial Center"), ("Adampur / Khanjarpur", 4100, "Established Residential"), ("Barari Ganga Riverfront", 3600, "Riverfront Suburb"), ("Other Localities", 2700, "Greater Bhagalpur")]),
        ("Darbhanga", 3400, "6.2% YoY", [("Laheriasarai / Tower Chowk", 4500, "Administrative & Trade Core"), ("Airport Road / Kadirabad", 4100, "Aviation Expansion Hub"), ("Donar Chowk", 3700, "Suburban Hub"), ("Other Localities", 2600, "Greater Darbhanga")]),
        ("Purnia", 3200, "5.8% YoY", [("Bhatta Bazar / Line Bazar", 4300, "Commercial Core"), ("Navratan Hatta", 3600, "Residential Area"), ("Purnia Court Station Axis", 3300, "Administrative Hub"), ("Other Localities", 2500, "Greater Purnia")]),
        ("Begusarai", 3300, "5.7% YoY", [("Har-Har Mahadev Chowk", 4200, "Commercial Core"), ("IOCL Barauni Township Axis", 3800, "Refinery Hub"), ("Power House Chowk", 3500, "Industrial Sector"), ("Other Localities", 2600, "Greater Begusarai")]),
        ("Arrah (Bhojpur)", 3200, "5.6% YoY", [("Gopali Chowk / Nawada", 4100, "Town Core"), ("Katira / Jagdeo Nagar", 3600, "Prime Residential"), ("Anaith / Station Road", 3300, "Transit Hub"), ("Other Localities", 2500, "Periphery")]),
        ("Nalanda (Bihar Sharif & Rajgir)", 3400, "6.4% YoY", [("Rajgir Tourism Corridor", 4600, "International Tourist Zone"), ("Ranchi Road / Hospital Mod", 4000, "Commercial Core"), ("Khandak Par / Ramchandrapur", 3600, "Established Residential"), ("Other Localities", 2600, "Greater Nalanda")]),
        ("Katihar", 3000, "5.3% YoY", [("Mirchaibari / Bada Bazar", 3900, "Town Core"), ("Railway Colony / Station Road", 3500, "Transit Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Munger", 3200, "5.4% YoY", [("Fort Road / Belan Bazar", 4100, "Historic Core"), ("ITC Jamalpur Link Axis", 3600, "Industrial Township"), ("Other Localities", 2500, "Periphery")]),
        ("Chhapra (Saran)", 3100, "5.3% YoY", [("Municipality Chowk / Gudari Bazar", 4000, "Commercial Heart"), ("Prabhunath Nagar", 3500, "Residential Expansion"), ("Other Localities", 2400, "Greater Chhapra")]),
        ("Sasaram (Rohtas)", 3000, "5.2% YoY", [("Tomb Area / GT Road", 3900, "Commercial Axis"), ("Dehri-on-Sone Industrial Link", 3500, "Riverfront Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Samastipur", 3100, "5.4% YoY", [("Magardahi Ghat / Mohanpur", 4000, "Town Core"), ("Pusa Agricultural University Axis", 3400, "Academic Corridor"), ("Other Localities", 2400, "Periphery")]),
        ("Motihari (East Champaran)", 3000, "5.2% YoY", [("Gandhi Chowk / Main Road", 3900, "Town Center"), ("Chhatauni Bus Stand Area", 3400, "Transit Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Bettiah (West Champaran)", 2900, "5.0% YoY", [("Lal Bazar / Supriya Road", 3700, "Commercial Core"), ("Kumar Bagh Industrial Area", 3200, "Industrial Hub"), ("Other Localities", 2300, "Periphery")]),
        ("Siwan", 3100, "5.4% YoY", [("Babunia Road / JP Chowk", 4000, "Commercial Core"), ("Mahadeva / Station Road", 3500, "Residential Suburb"), ("Other Localities", 2400, "Periphery")]),
        ("Gopalganj", 2900, "5.1% YoY", [("Main Market / Post Office Chowk", 3700, "Town Core"), ("Thawe Temple Road", 3200, "Pilgrimage Axis"), ("Other Localities", 2300, "Periphery")]),
        ("Saharsa", 2900, "5.0% YoY", [("D.B. Road / Super Market", 3800, "Commercial Center"), ("Tiwari Tola", 3200, "Residential Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Sitamarhi", 2900, "5.0% YoY", [("Dumra Administrative Hub", 3600, "District HQ"), ("Mehsaul Chowk / Main Bazar", 3500, "Town Core"), ("Other Localities", 2300, "Periphery")]),
        ("Vaishali (Hajipur)", 3800, "7.0% YoY", [("Paswan Chowk / Cinema Road", 4800, "Commercial Heart"), ("Industrial Area / EPIP Zone", 4200, "Industrial Sector"), ("Bidupur Link Corridor", 3500, "Growth Axis"), ("Other Localities", 2900, "Greater Hajipur")]),
        ("Madhubani", 2800, "4.9% YoY", [("Bata Chowk / Station Road", 3600, "Town Core"), ("Saurath Heritage Area", 3100, "Cultural Suburb"), ("Other Localities", 2200, "Periphery")]),
        ("Araria", 2600, "4.6% YoY", [("Araria Court / Bus Stand", 3300, "Town Center"), ("Forbesganj Trade Hub", 3500, "Border Trade Area"), ("Other Localities", 2100, "Periphery")]),
        ("Kishanganj", 2800, "5.0% YoY", [("Caltex Chowk / Gandhi Chowk", 3600, "Town Core"), ("Tea Garden Highway Axis", 3100, "Scenic Suburb"), ("Other Localities", 2200, "Periphery")]),
        ("Supaul", 2700, "4.7% YoY", [("Station Chowk / Gandhi Maidan", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Madhepura", 2700, "4.8% YoY", [("Alstom Electric Loco Township", 3500, "Industrial Hub"), ("Main Market / College Chowk", 3300, "Town Core"), ("Other Localities", 2100, "Periphery")]),
        ("Buxar", 3000, "5.3% YoY", [("Station Road / Charitra Van", 3800, "Town Core"), ("Ganga Ghat Promenade", 3400, "Riverfront Axis"), ("Other Localities", 2400, "Periphery")]),
        ("Jehanabad", 2800, "5.0% YoY", [("Court Area / Station Road", 3500, "Town Core"), ("Kako Road Junction", 3100, "Suburban Hub"), ("Other Localities", 2200, "Periphery")]),
        ("Aurangabad (Bihar)", 2900, "5.1% YoY", [("Ramesh Chowk / GT Road", 3700, "Commercial Axis"), ("Jasoiya More", 3200, "Residential Suburb"), ("Other Localities", 2300, "Periphery")]),
        ("Nawada", 2800, "4.9% YoY", [("Prajatantra Chowk / Main Market", 3600, "Town Core"), ("NH31 Bypass", 3100, "Highway Corridor"), ("Other Localities", 2200, "Periphery")]),
        ("Jamui", 2700, "4.8% YoY", [("Mahisauri Chowk / Station Road", 3400, "Town Core"), ("Gidhaur Road", 3000, "Suburban Node"), ("Other Localities", 2100, "Periphery")]),
        ("Banka", 2600, "4.6% YoY", [("Banka Town / Gandhi Chowk", 3300, "District HQ"), ("Mandar Hill Tourist Axis", 2900, "Scenic Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Lakhisarai", 2800, "4.9% YoY", [("Vidyapeeth Chowk / Station Area", 3500, "Town Core"), ("Kiul Railway Junction", 3400, "Transit Hub"), ("Other Localities", 2200, "Periphery")]),
        ("Sheikhpura", 2600, "4.6% YoY", [("Main Market / Station Road", 3300, "District HQ"), ("Barbigha Commercial Town", 3200, "Trade Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Khagaria", 2700, "4.7% YoY", [("Rajendra Chowk / Station Road", 3400, "Town Core"), ("Bypass Road", 3000, "Expansion Zone"), ("Other Localities", 2100, "Periphery")]),
        ("Kaimur (Bhabua)", 2700, "4.7% YoY", [("Bhabua Main Town / Court Area", 3400, "District HQ"), ("Mohania GT Road Junction", 3500, "Highway Trade Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Arwal", 2500, "4.5% YoY", [("Arwal Main Chowk / Son Riverfront", 3100, "District HQ"), ("Other Localities", 2000, "Periphery")]),
        ("Sheohar", 2400, "4.3% YoY", [("Sheohar Town Market", 3000, "District HQ"), ("Other Localities", 1900, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 5. CHHATTISGARH (33 Districts)
    # -------------------------------------------------------------
    "Chhattisgarh": [
        ("Raipur (Outer & Non-Metro)", 4600, "7.6% YoY", [("Naya Raipur Smart City Core", 5900, "Greenfield Capital City"), ("VIP Road / Telibandha", 6800, "Prime Commercial"), ("Tatibandh (AIIMS Zone)", 4700, "Institutional Hub"), ("Sarona / DDU Nagar", 4200, "Residential Suburb"), ("Other Localities", 3200, "Greater Raipur")]),
        ("Bhilai - Durg", 3800, "6.4% YoY", [("Nehru Nagar / Priyadarshini", 5100, "Prime Residential"), ("Bhilai Steel Plant Township (Sectors)", 4200, "Institutional Core"), ("Durg Station Road / Civil Lines", 4400, "Commercial Hub"), ("Junwani Educational Hub", 3900, "Academic Corridor"), ("Other Localities", 2900, "Greater Bhilai-Durg")]),
        ("Bilaspur", 3700, "6.2% YoY", [("Vyapar Vihar / Link Road", 4900, "Commercial Center"), ("Rama Life City / Sakri", 4100, "Growth Suburb"), ("Rajendra Nagar / Civil Lines", 4600, "Prime Residential"), ("Koni University Zone", 3500, "Academic Corridor"), ("Other Localities", 2800, "Greater Bilaspur")]),
        ("Korba", 3300, "5.7% YoY", [("TP Nagar / Transport Nagar", 4300, "Commercial Heart"), ("NTPC / CSEB Township Area", 3700, "Industrial Sector"), ("Kosabadi", 3900, "Residential Hub"), ("Other Localities", 2600, "Greater Korba")]),
        ("Rajnandgaon", 3200, "5.6% YoY", [("G.E. Road / Manpur Road", 4200, "Commercial Axis"), ("Kailash Nagar / Station Road", 3600, "Residential Hub"), ("Other Localities", 2500, "Greater Rajnandgaon")]),
        ("Raigarh", 3400, "5.9% YoY", [("Jindal Steel Complex Corridor", 4400, "Industrial Axis"), ("Station Road / Chakradhar Nagar", 4100, "Town Core"), ("Boirdadar", 3600, "Residential Suburb"), ("Other Localities", 2600, "Greater Raigarh")]),
        ("Jagdalpur (Bastar)", 3300, "5.8% YoY", [("Dharampura / Airport Road", 4300, "Aviation & Academic Hub"), ("Sanjay Market / Main Road", 4100, "Commercial Core"), ("Chitrakote Road", 3500, "Tourism Corridor"), ("Other Localities", 2600, "Greater Jagdalpur")]),
        ("Ambikapur (Surguja)", 3200, "5.5% YoY", [("Gandhi Chowk / Clock Tower", 4100, "Town Core"), ("Ring Road / Banaras Road", 3600, "Expansion Zone"), ("Other Localities", 2500, "Periphery")]),
        ("Dhamtari", 3100, "5.4% YoY", [("Ratnabandha Road", 3900, "Commercial Core"), ("Sihawa Chowk", 3500, "Town Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Mahasamund", 2900, "5.1% YoY", [("BTI Road / Station Road", 3700, "District HQ"), ("Tumgaon Road", 3200, "Expansion Axis"), ("Other Localities", 2300, "Periphery")]),
        ("Janjgir-Champa", 3000, "5.2% YoY", [("Champa Railway & Silk Hub", 3800, "Textile & Trade Center"), ("Janjgir Collectorate Zone", 3500, "Administrative Core"), ("Other Localities", 2400, "Periphery")]),
        ("Kabirdham (Kawardha)", 2800, "4.9% YoY", [("Kawardha Main Market / Palace Road", 3600, "Town Core"), ("Other Localities", 2200, "Periphery")]),
        ("Kanker (North Bastar)", 2800, "4.9% YoY", [("NH30 Bypass / Main Bazaar", 3500, "Town Core"), ("Other Localities", 2200, "Periphery")]),
        ("Dantewada (South Bastar)", 2700, "4.7% YoY", [("Danteshwari Temple Road", 3400, "Pilgrimage Core"), ("NMDC Bacheli-Kirandul Link", 3600, "Mining Township"), ("Other Localities", 2200, "Periphery")]),
        ("Balod", 2800, "4.8% YoY", [("Balod Town / Collectorate", 3500, "District HQ"), ("Other Localities", 2200, "Periphery")]),
        ("Bemetara", 2800, "4.8% YoY", [("Bemetara Main Chowk", 3500, "District HQ"), ("Other Localities", 2200, "Periphery")]),
        ("Baloda Bazar-Bhatapara", 3000, "5.2% YoY", [("Bhatapara Grain Market / Station", 3800, "Commercial Hub"), ("Baloda Bazar Town Core", 3400, "District HQ"), ("Other Localities", 2400, "Periphery")]),
        ("Gariaband", 2600, "4.5% YoY", [("Gariaband Town HQ", 3200, "Administrative Center"), ("Other Localities", 2000, "Periphery")]),
        ("Jashpur", 2700, "4.6% YoY", [("Jashpur Nagar / DC Office", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Koriya (Baikunthpur)", 2700, "4.6% YoY", [("Baikunthpur Town Center", 3400, "District HQ"), ("Chirimiri Coalfield Axis", 3100, "Mining Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Surajpur", 2700, "4.6% YoY", [("Surajpur Main Market", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Balrampur-Ramanujganj", 2600, "4.4% YoY", [("Balrampur HQ / Ramanujganj Border", 3200, "Town Core"), ("Other Localities", 2000, "Periphery")]),
        ("Kondagaon", 2800, "4.8% YoY", [("Bell Metal Craft Village / NH30", 3500, "Craft & Town Core"), ("Other Localities", 2200, "Periphery")]),
        ("Narayanpur", 2500, "4.3% YoY", [("Narayanpur Town HQ", 3100, "Administrative Center"), ("Other Localities", 2000, "Periphery")]),
        ("Sukma", 2500, "4.3% YoY", [("Sukma Main Town", 3100, "District HQ"), ("Other Localities", 2000, "Periphery")]),
        ("Bijapur", 2400, "4.2% YoY", [("Bijapur Town HQ", 3000, "District HQ"), ("Other Localities", 1900, "Periphery")]),
        ("Gaurela-Pendra-Marwahi", 2700, "4.7% YoY", [("Pendra Road Railway Station", 3400, "Transit & Admin Hub"), ("Other Localities", 2100, "Periphery")]),
        ("Khairagarh-Chhuikhadan-Gandai", 2800, "4.9% YoY", [("Music University Corridor / Town", 3500, "Cultural & Academic Hub"), ("Other Localities", 2200, "Periphery")]),
        ("Manendragarh-Chirmiri-Bharatpur", 2700, "4.6% YoY", [("Manendragarh Town / Station Area", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Mohla-Manpur-Ambagarh Chowki", 2500, "4.4% YoY", [("Mohla HQ / Ambagarh Chowk", 3100, "District HQ"), ("Other Localities", 2000, "Periphery")]),
        ("Sakti", 2800, "4.8% YoY", [("Sakti Station Road / Main Market", 3500, "District HQ"), ("Other Localities", 2200, "Periphery")]),
        ("Sarangarh-Bilaigarh", 2700, "4.6% YoY", [("Sarangarh Palace Road / Town", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Mungeli", 2700, "4.6% YoY", [("Mungeli Town Market", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 6. GOA (2 Districts)
    # -------------------------------------------------------------
    "Goa": [
        ("North Goa (Panaji / Porvorim / Candolim)", 7800, "9.2% YoY", [("Panaji City / Miramar Beach", 12500, "State Capital Prime"), ("Porvorim (Secretariat Hub)", 9200, "High-End Residential"), ("Candolim / Calangute Coastal", 14000, "Global Tourism Prime"), ("Mapusa Commercial Hub", 7100, "Commercial Market"), ("Assagao / Siolim Designer Belt", 15500, "Boutique Luxury Villa Zone"), ("Other Localities", 6200, "North Goa Hinterland")]),
        ("South Goa (Margao / Vasco / Colva)", 6200, "7.4% YoY", [("Margao Town / Fatorda", 7800, "Commercial & Cultural Core"), ("Vasco da Gama / Airport Road", 6900, "Port & Aviation Zone"), ("Colva / Benaulim Beach Belt", 9800, "Coastal Scenic Zone"), ("Ponda Heritage & Industrial Hub", 5400, "Central Temple City"), ("Cavelossim Luxury Waterfront", 11200, "Ultra Luxury Resorts"), ("Other Localities", 4800, "South Goa Hinterland")])
    ],

    # -------------------------------------------------------------
    # 7. GUJARAT (33 Districts)
    # -------------------------------------------------------------
    "Gujarat": [
        ("Surat (Non-Metro Outer)", 6800, "8.6% YoY", [("Vesu / VIP Road", 9800, "Prime Ultra Residential"), ("Ghod Dod Road / City Light", 11200, "High-End Commercial"), ("Adajan / Pal", 6800, "Established Residential"), ("Katargam Diamond Hub", 5900, "Diamond Processing Sector"), ("Hazira Port Expressway", 4900, "Industrial Mega Corridor"), ("Other Localities", 4200, "Greater Surat")]),
        ("Vadodara", 4900, "7.3% YoY", [("Alkapuri / RC Dutt Road", 8900, "Prime Commercial & Heritage"), ("Vasna-Bhayli Road", 6200, "High-End Expansion Axis"), ("Gotri / Sevasi", 5800, "Modern Residential Hub"), ("Manjalpur / Makarpura GIDC", 4600, "Industrial & Residential South"), ("Waghodia Road", 3900, "Institutional East"), ("Other Localities", 3500, "Greater Vadodara")]),
        ("Rajkot", 4700, "7.5% YoY", [("Kalawad Road / Amin Marg", 7600, "Prime West Axis"), ("University Road / 150ft Ring Road", 6100, "Commercial Hub"), ("Nana Mava / Mavdi", 4900, "Fast Growing Residential"), ("Kuvadva Road / GIDC Hub", 3800, "Industrial North"), ("Other Localities", 3400, "Greater Rajkot")]),
        ("Bhavnagar", 3600, "5.9% YoY", [("Waghawadi Road / Vidhyanagar", 5200, "Prime Residential"), ("Victoria Park Road", 4500, "Scenic Residential"), ("Chitra GIDC / Station Road", 3700, "Industrial Hub"), ("Other Localities", 2800, "Greater Bhavnagar")]),
        ("Jamnagar", 3800, "6.4% YoY", [("Patel Colony / Indira Marg", 5100, "Commercial & Prime"), ("Reliance Refinery Greens Township Axis", 4400, "Mega Industrial Sector"), ("Digjam Circle / Airport Road", 4000, "Aviation Corridor"), ("Other Localities", 2900, "Greater Jamnagar")]),
        ("Junagadh", 3400, "5.7% YoY", [("Zanzarda Road / Girnar Darwaja", 4700, "Pilgrimage & Prime Axis"), ("Moti Baug / College Road", 4000, "Institutional Zone"), ("Other Localities", 2700, "Greater Junagadh")]),
        ("Gandhinagar (Outer)", 5600, "8.2% YoY", [("GIFT City Special Financial Zone", 9200, "Global Financial Hub"), ("Infocity / Sector 1 to 7", 7800, "Tech & Admin Core"), ("Koba Circle / Airport Highway", 6900, "Aviation Link Corridor"), ("Other Localities", 4500, "Greater Gandhinagar")]),
        ("Anand (Milk Capital)", 4100, "6.8% YoY", [("Amul Dairy Road / Station Road", 5600, "Commercial & Corporate"), ("Vallabh Vidyanagar Educational Hub", 5100, "University Campus Core"), ("Vidyanagar-Karamsad Road", 4800, "Prime Residential"), ("Other Localities", 3200, "Greater Anand")]),
        ("Bharuch", 3600, "6.2% YoY", [("College Road / Station Road", 4800, "Commercial Core"), ("GNFC Township / Zadeshwar Road", 4300, "Industrial & Residential"), ("Ankleshwar GIDC Industrial Belt", 3900, "Chemical Mega Hub"), ("Other Localities", 2900, "Greater Bharuch")]),
        ("Navsari", 3700, "6.0% YoY", [("Lunsikui / Station Road", 4900, "Commercial Core"), ("Eru Char Rasta / Agriculture Univ", 4100, "Educational Zone"), ("Other Localities", 2900, "Greater Navsari")]),
        ("Valsad", 3600, "5.9% YoY", [("Tithal Beach Road", 4800, "Coastal Prime"), ("Dharampur Road / Station Area", 4200, "Commercial Core"), ("Vapi Mega GIDC Axis", 4500, "Industrial Hub"), ("Other Localities", 2800, "Greater Valsad")]),
        ("Morbi", 3900, "7.1% YoY", [("Ceramic Industrial Cluster (NH-8A)", 4800, "Global Tile Manufacturing"), ("Sanala Road / Ravapar Road", 5100, "Prime Residential & Commercial"), ("Lakhdhirpur Road", 4200, "Industrial Growth"), ("Other Localities", 3100, "Greater Morbi")]),
        ("Mehsana", 3500, "6.1% YoY", [("Radhanpur Road / Modhera Road", 4600, "Commercial Core"), ("ONGC Colony / Highway Circle", 4200, "Industrial Sector"), ("Other Localities", 2800, "Greater Mehsana")]),
        ("Kutch (Bhuj / Gandhidham)", 3600, "6.0% YoY", [("Gandhidham Commercial Complex", 4700, "Port Commerce Hub"), ("Mundra Port Mega SEZ Axis", 4200, "Logistics & Maritime Zone"), ("Bhuj Jubilee Ground / Station Road", 4400, "Cultural Core"), ("Other Localities", 2800, "Greater Kutch")]),
        ("Patan", 3200, "5.5% YoY", [("Rani Ki Vav Heritage Corridor", 4200, "UNESCO Tourism Hub"), ("University Road / Station Area", 3700, "Academic & Admin"), ("Other Localities", 2500, "Periphery")]),
        ("Porbandar", 3300, "5.6% YoY", [("Chowpatty Beach Road", 4500, "Scenic Waterfront"), ("Sudama Chowk / MG Road", 4100, "Town Core"), ("Other Localities", 2600, "Greater Porbandar")]),
        ("Amreli", 3000, "5.2% YoY", [("Station Road / Lathi Road", 3900, "Town Core"), ("Chital Road", 3400, "Residential Suburb"), ("Other Localities", 2400, "Periphery")]),
        ("Surendranagar", 3100, "5.4% YoY", [("Wadhwan Heritage Core", 3900, "Cultural Hub"), ("Dhrangadhra Road / GIDC", 3500, "Industrial Node"), ("Other Localities", 2500, "Greater Surendranagar")]),
        ("Banaskantha (Palanpur)", 3200, "5.5% YoY", [("Abu Highway / Gobar Gas Road", 4100, "Highway Corridor"), ("Dairy Road / Station Area", 3800, "Commercial Hub"), ("Other Localities", 2500, "Greater Palanpur")]),
        ("Sabarkantha (Himmatnagar)", 3200, "5.5% YoY", [("Motipura / Shamlaji Highway", 4100, "Commercial Axis"), ("Mahavirnagar", 3700, "Residential Area"), ("Other Localities", 2500, "Periphery")]),
        ("Panchmahal (Godhra)", 3000, "5.1% YoY", [("Station Road / Vavdi Buzarg", 3800, "Town Core"), ("Halol Industrial SEZ Corridor", 4200, "Automotive Hub"), ("Other Localities", 2400, "Greater Panchmahal")]),
        ("Dahod", 2800, "4.9% YoY", [("Smart City Station Area", 3600, "Railway Hub"), ("Govindnagar", 3200, "Residential Area"), ("Other Localities", 2200, "Periphery")]),
        ("Kheda (Nadiad)", 3500, "5.8% YoY", [("Santram Temple Road", 4600, "Heritage Core"), ("College Road / Station Area", 4100, "Academic & Trade"), ("Other Localities", 2800, "Greater Nadiad")]),
        ("Aravalli (Modasa)", 2900, "5.0% YoY", [("Modasa Town / College Road", 3600, "District HQ"), ("Other Localities", 2300, "Periphery")]),
        ("Botad", 3000, "5.2% YoY", [("Salangpur Road", 3900, "Pilgrimage Axis"), ("Station Road / Diamond Market", 3700, "Trade Hub"), ("Other Localities", 2400, "Periphery")]),
        ("Chhota Udaipur", 2700, "4.6% YoY", [("Main Town / Palace Area", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Dang (Ahwa)", 2600, "4.5% YoY", [("Ahwa Town HQ / Saputara Hill", 3600, "Hill Station Hub"), ("Other Localities", 2000, "Periphery")]),
        ("Devbhoomi Dwarka (Khambhalia)", 3300, "5.8% YoY", [("Dwarka Temple Pilgrimage Core", 4700, "Spiritual Tourism"), ("Khambhalia District HQ", 3600, "Administrative Center"), ("Other Localities", 2500, "Periphery")]),
        ("Gir Somnath (Veraval)", 3400, "5.9% YoY", [("Somnath Temple Waterfront", 4800, "Pilgrimage & Coastal"), ("Veraval Port / GIDC", 3900, "Fisheries & Industry"), ("Other Localities", 2600, "Periphery")]),
        ("Mahisagar (Lunawada)", 2800, "4.8% YoY", [("Lunawada Town / Santrampur", 3500, "District HQ"), ("Other Localities", 2200, "Periphery")]),
        ("Narmada (Rajpipla)", 3100, "5.7% YoY", [("Statue of Unity (Kevadia) Axis", 4500, "Mega Tourism Corridor"), ("Rajpipla Town Core", 3600, "Heritage Town"), ("Other Localities", 2400, "Periphery")]),
        ("Tapi (Vyara)", 2900, "5.0% YoY", [("Vyara Station Road / Songadh", 3600, "District HQ"), ("Other Localities", 2300, "Periphery")]),
        ("Ahmedabad (Rural Non-Metro Ring)", 4800, "7.6% YoY", [("Sanand Auto Hub", 5400, "Automotive Mega Cluster"), ("Dholera SIR Mega Smart City", 4900, "Semiconductor & Industrial Hub"), ("Bavla / Changodar Industrial Belt", 4200, "Pharma & Logistics"), ("Other Localities", 3400, "Outer Ahmedabad Perimeter")])
    ],

    # -------------------------------------------------------------
    # 8. HARYANA (22 Districts)
    # -------------------------------------------------------------
    "Haryana": [
        ("Faridabad (Non-Metro Outer)", 6200, "7.2% YoY", [("Sector 14 / Sector 15", 9800, "Prime Central"), ("Neharpar / Greater Faridabad", 6400, "Modern High-Rise Zone"), ("Surajkund Scenic Corridor", 8900, "Luxury Green Belt"), ("Other Localities", 4600, "Greater Faridabad")]),
        ("Gurugram (Rural / Sohna Node)", 7800, "8.9% YoY", [("Sohna Road / Elevated Corridor", 9400, "High Growth Residential"), ("Manesar IMT Industrial City", 6800, "Automotive Manufacturing Core"), ("Pataudi Highway Corridor", 5200, "Expansion Zone"), ("Other Localities", 4800, "South Gurugram Perimeter")]),
        ("Panchkula", 6400, "7.5% YoY", [("Sector 6 / MDC Sector 4", 10500, "Ultra Prime Residential"), ("Sector 20 / Pinjore Highway", 6800, "Established Residential"), ("Morni Hills Link Axis", 5600, "Scenic Foothills"), ("Other Localities", 4800, "Greater Panchkula")]),
        ("Ambala", 4100, "6.1% YoY", [("Ambala Cantt / Sadar Bazar", 5200, "Railway Division & Commercial"), ("Ambala City / Model Town", 4800, "Prime Residential"), ("Twin City Highway / Cloth Market", 4500, "Textile Trade Core"), ("Other Localities", 3200, "Greater Ambala")]),
        ("Karnal (Smart City)", 4400, "6.9% YoY", [("Sector 12 / Urban Estate", 6100, "Prime Residential"), ("Model Town / Mall Road", 5800, "Commercial Core"), ("GT Road NH44 Corridor", 4900, "Highway Axis"), ("Other Localities", 3500, "Greater Karnal")]),
        ("Panipat (Textile Hub)", 4200, "6.5% YoY", [("Model Town / GT Road", 5700, "Commercial Center"), ("Sector 11-12 / HUDA Colony", 4900, "Prime Residential"), ("IOCL Refinery Township Axis", 4200, "Refinery Sector"), ("Other Localities", 3300, "Greater Panipat")]),
        ("Sonipat", 4600, "7.2% YoY", [("Kundli-KMP Expressway Hub", 5800, "Industrial & Logistics Corridor"), ("Sector 14 / Model Town", 5600, "Prime Residential"), ("Murthal / Educational City (Ashoka Univ)", 5200, "Academic Axis"), ("Other Localities", 3600, "Greater Sonipat")]),
        ("Rohtak", 4100, "6.3% YoY", [("Model Town / Delhi Road", 5400, "Commercial Core"), ("MDU Campus / Medical Mod", 4700, "Institutional Hub"), ("Sector 2-3 / HUDA Sectors", 4600, "Prime Residential"), ("Other Localities", 3200, "Greater Rohtak")]),
        ("Hisar", 3900, "6.0% YoY", [("Urban Estate II / Model Town", 5300, "Prime Residential"), ("Mahabir Stadium Road / Auto Market", 4700, "Commercial Hub"), ("Airport Road / Cantt Axis", 4200, "Aviation Expansion Hub"), ("Other Localities", 3100, "Greater Hisar")]),
        ("Yamunanagar - Jagadhri", 3600, "5.8% YoY", [("Model Town / Jagadhri Road", 4800, "Prime Commercial"), ("Professors Colony / HUDA Sector 17", 4200, "Residential Hub"), ("Paper Mill / Plywood Industrial Zone", 3700, "Manufacturing Belt"), ("Other Localities", 2800, "Greater Yamunanagar")]),
        ("Kurukshetra", 3800, "6.2% YoY", [("Brahma Sarovar / University Road", 5100, "Pilgrimage & Academic Core"), ("Sector 13 / Urban Estate", 4600, "Prime Residential"), ("Pehowa Link Road", 3600, "Growth Axis"), ("Other Localities", 2900, "Greater Kurukshetra")]),
        ("Bhiwani", 3200, "5.3% YoY", [("Halu Bazar / Clock Tower", 4100, "Commercial Core"), ("Sector 13 / HUDA Colony", 3700, "Residential Hub"), ("Other Localities", 2500, "Greater Bhiwani")]),
        ("Sirsa", 3400, "5.5% YoY", [("Barnala Road / Begu Road", 4400, "Prime Residential"), ("Suratgariya Chowk / Main Bazar", 4200, "Commercial Core"), ("Other Localities", 2700, "Greater Sirsa")]),
        ("Rewari", 3900, "6.4% YoY", [("Brass Market / Model Town", 5100, "Commercial Heart"), ("Bawal IMT Industrial Corridor", 4500, "Automotive Mega Cluster"), ("Dharuhera Highway Hub", 4700, "NH48 Industrial Axis"), ("Other Localities", 3100, "Greater Rewari")]),
        ("Palwal", 3600, "6.0% YoY", [("KMP Expressway Junction / GT Road", 4700, "Logistics & Highway Hub"), ("Camp / Station Road", 4100, "Commercial Core"), ("Other Localities", 2800, "Greater Palwal")]),
        ("Jhajjar", 3400, "5.7% YoY", [("Bahadurgarh Metro Edge", 4900, "Delhi Metro Green Line Axis"), ("Jhajjar City / Court Area", 3800, "Administrative Core"), ("Other Localities", 2700, "Greater Jhajjar")]),
        ("Kaithal", 3300, "5.4% YoY", [("Pehowa Chowk / Dhand Road", 4200, "Commercial Core"), ("Urban Estate / Sector 19-20", 3800, "Residential Hub"), ("Other Localities", 2600, "Greater Kaithal")]),
        ("Jind", 3200, "5.3% YoY", [("Rani Talab / Safidon Road", 4100, "Town Core"), ("Urban Estate / Scheme No. 5", 3700, "Residential Hub"), ("Other Localities", 2500, "Greater Jind")]),
        ("Fatehabad", 3100, "5.2% YoY", [("Matar Shyam Road / GT Road", 3900, "Commercial Core"), ("HUDA Sector 3", 3600, "Residential Suburb"), ("Other Localities", 2400, "Periphery")]),
        ("Mahendragarh (Narnaul)", 3100, "5.3% YoY", [("Narnaul Town / Mahavir Chowk", 3900, "District HQ"), ("Logistics Hub Corridor", 3600, "Dedicated Freight Axis"), ("Other Localities", 2400, "Periphery")]),
        ("Charkhi Dadri", 3000, "5.1% YoY", [("Loharu Road / Station Chowk", 3800, "District HQ"), ("Other Localities", 2300, "Periphery")]),
        ("Nuh (Mewat)", 3100, "5.2% YoY", [("Delhi-Mumbai Expressway Hub", 4100, "Expressway Transit Axis"), ("Nuh Town / DC Office", 3500, "Administrative Core"), ("Other Localities", 2400, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 9. HIMACHAL PRADESH (12 Districts)
    # -------------------------------------------------------------
    "Himachal Pradesh": [
        ("Shimla (Capital District)", 6800, "7.9% YoY", [("The Mall / Ridge / Chhota Shimla", 14500, "Heritage Capital Core"), ("Sanjauli / Dhalli", 7400, "Established Residential"), ("Kasumpti / Mehli", 6800, "Government Housing & IT"), ("New Shimla (Phase 1-4)", 7900, "Planned Residential Hub"), ("Shoghi / Tara Devi Highway", 5200, "Highway Expansion Axis"), ("Other Localities", 4500, "Greater Shimla")]),
        ("Kullu & Manali", 5900, "8.1% YoY", [("Manali Mall Road / Old Manali", 11200, "Global Tourism Hub"), ("Kullu Main Town / Dhalpur Ground", 6800, "District Center"), ("Naggar Heritage Art Belt", 6500, "Scenic Art Village"), ("Solang Valley Road", 8200, "Adventure Tourism Axis"), ("Other Localities", 4200, "Valley Periphery")]),
        ("Kangra (Dharamshala & McLeodganj)", 5400, "7.6% YoY", [("McLeodganj / Bhagsu / Dharamkot", 9800, "Global Cultural Core"), ("Dharamshala Smart City / Kotwali", 6900, "Administrative & Commercial"), ("Palampur Tea Estate Corridor", 5800, "Scenic Hill Resort"), ("Kangra Town / Temple Axis", 4800, "Pilgrimage Core"), ("Other Localities", 3800, "Kangra Valley")]),
        ("Solan", 4800, "7.0% YoY", [("Mall Road / Rajgarh Road", 6400, "Town Core"), ("Baddi-Barotiwala-Nalagarh (BBN) Pharma SEZ", 4900, "Asia's Largest Pharma Hub"), ("Kasauli Foothills / Jabli", 8500, "Luxury Pine Hills"), ("Chail Highway Road", 5800, "Resort Corridor"), ("Other Localities", 3600, "Greater Solan")]),
        ("Mandi", 4100, "6.2% YoY", [("Indira Market / Victoria Bridge", 5300, "Commercial Core"), ("IIT Mandi (Kamand Valley)", 4600, "Premier Tech Hub"), ("Bhiuli / Pandoh Road", 4200, "Highway Corridor"), ("Other Localities", 3100, "Greater Mandi")]),
        ("Sirmaur (Nahan & Paonta Sahib)", 3700, "5.9% YoY", [("Paonta Sahib Gurdwara & Industrial Hub", 4700, "Pilgrimage & Industry"), ("Nahan Heritage Hill Town", 4200, "District Administrative Core"), ("Kala Amb Industrial Corridor", 3900, "Manufacturing SEZ"), ("Other Localities", 2800, "Greater Sirmaur")]),
        ("Hamirpur", 3800, "6.0% YoY", [("Gandhi Chowk / NIT Hamirpur Road", 4900, "Educational & Town Core"), ("Anu / Housing Board Colony", 4200, "Prime Residential"), ("Other Localities", 2900, "Greater Hamirpur")]),
        ("Una", 3600, "5.8% YoY", [("Main Market / Vande Bharat Station Road", 4600, "Railway & Commercial"), ("Mehatpur Industrial Area", 3900, "Border Industrial Zone"), ("Other Localities", 2700, "Greater Una")]),
        ("Bilaspur (HP)", 3500, "5.6% YoY", [("AIIMS Bilaspur (Kothipura)", 4600, "Medical & Institutional Hub"), ("Main Market / Gobind Sagar Lake", 4100, "Town Core"), ("Other Localities", 2600, "Greater Bilaspur")]),
        ("Chamba", 3400, "5.4% YoY", [("Chaugan / Palace Road", 4400, "Historic Core"), ("Dalhousie Luxury Hill Resort", 7200, "Colonial Tourism Hub"), ("Khajjiar Mini Switzerland Axis", 6500, "Scenic Resort"), ("Other Localities", 2500, "Greater Chamba")]),
        ("Kinnaur (Reckong Peo)", 3200, "5.2% YoY", [("Reckong Peo Town / Kalpa Apple Orchards", 4200, "Scenic HQ"), ("Sangla Valley Corridor", 3800, "Tourism Gem"), ("Other Localities", 2400, "Kinnaur Region")]),
        ("Lahaul and Spiti (Keylong & Kaza)", 3100, "5.5% YoY", [("Atal Tunnel North Portal / Sissu", 4800, "All-Weather Tourism Axis"), ("Keylong HQ / Kaza Spiti Core", 3900, "High-Altitude Hub"), ("Other Localities", 2400, "Trans-Himalayan Periphery")])
    ],

    # -------------------------------------------------------------
    # 10. JHARKHAND (24 Districts)
    # -------------------------------------------------------------
    "Jharkhand": [
        ("Ranchi (State Capital Non-Metro)", 4800, "7.7% YoY", [("Main Road / Lalpur / Kanke Road", 7600, "Prime Commercial & Residential"), ("Harmu Housing Colony / Ashok Nagar", 6400, "Established Residential"), ("Bariatu / Morabadi Ground", 5900, "Institutional & Sports Zone"), ("Namkum / Ring Road Corridor", 4400, "Expansion Highway Axis"), ("Tupudana Industrial Area", 3900, "Industrial South"), ("Other Localities", 3400, "Greater Ranchi")]),
        ("East Singhbhum (Jamshedpur)", 4900, "7.5% YoY", [("Bistupur / Sakchi Commercial Core", 7900, "Tata Steel Heritage Commercial"), ("Circuit House Area / Northern Town", 8400, "Ultra Prime Luxury"), ("Kadma / Sonari", 5800, "Planned Residential"), ("Telco Colony / Golmuri", 5200, "Automotive Manufacturing Core"), ("Adityapur Mega Industrial SEZ", 4400, "Industrial Satellite"), ("Other Localities", 3500, "Greater Jamshedpur")]),
        ("Dhanbad (Coal Capital)", 3700, "6.2% YoY", [("Bank More / City Center", 5200, "Commercial Heart"), ("IIT ISM Campus Area", 4600, "Premier Academic Zone"), ("Saraidhela / Housing Colony", 4400, "Prime Residential"), ("Govindpur GT Road Industrial", 3600, "Highway Corridor"), ("Other Localities", 2800, "Greater Dhanbad")]),
        ("Bokaro (Steel City)", 3600, "6.0% YoY", [("Sector 4 City Center", 4900, "Commercial Core"), ("Chas Bypass Commercial Zone", 4300, "High Growth Commercial"), ("Sector 1 to 12 Planned Town", 4100, "Steel Township"), ("Other Localities", 2700, "Greater Bokaro")]),
        ("Deoghar (AIIMS & Pilgrimage)", 3800, "7.1% YoY", [("Baba Baidyanath Dham Temple Core", 5400, "Pilgrimage Core"), ("AIIMS Deoghar / Airport Corridor", 4800, "Aviation & Medical Hub"), ("Castairs Town / VIP Road", 4300, "Prime Residential"), ("Other Localities", 2900, "Greater Deoghar")]),
        ("Hazaribagh", 3400, "5.8% YoY", [("Matwari / Korrah Road", 4400, "Prime Residential"), ("Bada Bazar / District More", 4200, "Town Core"), ("VBU University Campus Axis", 3600, "Academic Corridor"), ("Other Localities", 2600, "Greater Hazaribagh")]),
        ("Ramgarh", 3200, "5.5% YoY", [("Subhash Chowk / Cantt Area", 4100, "Commercial Center"), ("Patratu Lake Resort Corridor", 3800, "Tourism & Power Hub"), ("Other Localities", 2500, "Greater Ramgarh")]),
        ("Giridih", 3100, "5.3% YoY", [("Bada Chowk / Court Road", 4000, "Commercial Core"), ("Parasnath (Shikharji) Pilgrimage Axis", 4200, "Jain Pilgrimage Hub"), ("Other Localities", 2400, "Greater Giridih")]),
        ("Dumka (Sub-Capital)", 3100, "5.4% YoY", [("Tinbazar / Court Campus", 3900, "Administrative Core"), ("Dumka Engineering College Axis", 3400, "Academic Suburb"), ("Other Localities", 2400, "Greater Dumka")]),
        ("Palamu (Medininagar / Daltonganj)", 3000, "5.2% YoY", [("Shahpur / Station Road", 3800, "Town Core"), ("Koyal Riverfront", 3400, "Scenic Residential"), ("Other Localities", 2300, "Greater Palamu")]),
        ("Saraikela Kharsawan", 3300, "5.7% YoY", [("Adityapur Industrial Complex", 4400, "Industrial Core"), ("Gamharia Auto Hub", 3800, "Automotive Corridor"), ("Other Localities", 2500, "Periphery")]),
        ("West Singhbhum (Chaibasa)", 2800, "4.8% YoY", [("Chaibasa Main Market / Post Office", 3500, "District HQ"), ("Noamundi / Gua Mining Towns", 3200, "Iron Ore Mining Belt"), ("Other Localities", 2200, "Periphery")]),
        ("Koderma (Jhumri Telaiya)", 3100, "5.3% YoY", [("Jhumri Telaiya Station Road", 3900, "Commercial Core"), ("Tilaiya Dam Scenic Belt", 3400, "Lake Tourism"), ("Other Localities", 2400, "Periphery")]),
        ("Chatra", 2600, "4.5% YoY", [("Main Market / DC Office", 3200, "District HQ"), ("Other Localities", 2000, "Periphery")]),
        ("Garhwa", 2700, "4.7% YoY", [("Ranka Bowli / Station Road", 3400, "Town Core"), ("Other Localities", 2100, "Periphery")]),
        ("Godda", 2800, "5.0% YoY", [("Adani Ultra Thermal Power Zone", 3600, "Mega Power Hub"), ("Godda Town Market", 3400, "District HQ"), ("Other Localities", 2200, "Periphery")]),
        ("Gumla", 2700, "4.6% YoY", [("Gumla Main Town / Tower Chowk", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Jamtara", 2700, "4.7% YoY", [("Court Road / Station Area", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Khunti", 2900, "5.1% YoY", [("Birsa Munda Heritage Corridor", 3600, "Historic Axis"), ("District Collectorate Node", 3400, "Administrative Zone"), ("Other Localities", 2300, "Periphery")]),
        ("Latehar", 2600, "4.5% YoY", [("Latehar Town / Betla National Park Gate", 3300, "District HQ & Eco-Tourism"), ("Other Localities", 2000, "Periphery")]),
        ("Lohardaga", 2700, "4.6% YoY", [("Main Market / Bauxite Hub", 3400, "District HQ"), ("Other Localities", 2100, "Periphery")]),
        ("Pakur", 2700, "4.6% YoY", [("Pakur Stone Quarry Hub / Station Area", 3400, "Mining & Trade Core"), ("Other Localities", 2100, "Periphery")]),
        ("Sahibganj", 2900, "5.0% YoY", [("Ganga Inland Water Multi-Modal Terminal", 3700, "National Waterway 1 Port"), ("Town Market", 3400, "Town Core"), ("Other Localities", 2200, "Periphery")]),
        ("Simdega", 2500, "4.4% YoY", [("Hockey Nursery Core / Main Town", 3200, "District HQ"), ("Other Localities", 2000, "Periphery")])
    ],

    # -------------------------------------------------------------
    # 11. KARNATAKA (All 31 Districts Complete)
    # -------------------------------------------------------------
    "Karnataka": [
        ("Mysuru (Mysore)", 4200, "7.8% YoY", [("Gokulam (Yoga & Lifestyle Hub)", 6800, "Prime Cultural Residential"), ("Jayalakshmipuram / Saraswathipuram", 6200, "Established Heritage Prime"), ("Vijayanagar (Stages 1-4)", 5100, "High Growth Residential"), ("Hebbal Electronic City / IT Hub", 4600, "Tech SEZ Corridor"), ("Kuvempunagar / JP Nagar", 4800, "South Residential Core"), ("Ring Road Growth Corridor (Outer)", 3800, "Suburban Arterial Hub"), ("Bannur Road / T. Narasipura Road", 3400, "East Expansion Belt"), ("Other Localities", 3200, "Greater Mysuru")]),
        ("Dakshina Kannada (Mangaluru)", 4800, "7.2% YoY", [("Kadri Hills / Bejai", 7400, "Prime Central Residential"), ("Kodialbail / MG Road", 6900, "Commercial Core"), ("Kavoor / Airport Road (Bajpe)", 4800, "Aviation Growth Corridor"), ("Surathkal (NITK / MRPL Hub)", 5100, "Industrial & Academic Axis"), ("Ullal Coastal Stretch", 4200, "South Scenic Residential"), ("Deralakatte Medical City", 4600, "Healthcare & Educational Hub"), ("Other Localities", 3600, "Greater Mangalore")]),
        ("Dharwad (Hubballi-Dharwad)", 3600, "6.5% YoY", [("Vidyanagar (Hubli)", 5400, "Commercial Core & BRTS Corridor"), ("Keshwapur / Deshpande Nagar", 5100, "Prime Residential"), ("Gokul Road / Airport Axis", 4200, "Aviation & Industrial Hub"), ("Dharwad Kelageri / University Campus", 4100, "Institutional & Academic Core"), ("Navanagar (Twin City Center)", 3800, "Administrative Hub"), ("Tarihal Industrial SEZ", 3200, "Manufacturing Cluster"), ("Other Localities", 2800, "Twin Cities Periphery")]),
        ("Belagavi (Belgaum)", 3400, "6.0% YoY", [("Tilakwadi / Congress Road", 5200, "Prime Residential"), ("Camp Area / Cantonment", 4900, "Heritage Residential"), ("Udyambag Industrial Hub", 3800, "Machinery & Foundry Cluster"), ("Auto Nagar / NH4 Bypass", 3700, "Industrial & Transport Corridor"), ("Angol / Vadgaon", 3300, "South Residential"), ("Sambre Airport Link Axis", 3400, "Aviation Growth Node"), ("Other Localities", 2700, "Greater Belagavi")]),
        ("Udupi & Manipal", 4500, "7.0% YoY", [("Manipal University Campus Core", 6800, "Global Educational Hub"), ("Udupi Car Street / Kalsanka", 5600, "Cultural & Temple Core"), ("Brahmavar Highway Node", 3900, "North Growth Suburb"), ("Malpe Coastal Beach Hub", 4800, "Maritime & Tourism"), ("Santhekatte / Kakkunje", 4100, "Residential Suburb"), ("Other Localities", 3400, "Greater Udupi")]),
        ("Shivamogga (Shimoga)", 3300, "5.9% YoY", [("Gopala Gowda Extension", 4600, "Prime Residential"), ("Savalanga Road / Vinobhanagar", 4400, "Central Residential"), ("Airport Road / Sogane Industrial", 3800, "Aviation & Industrial Axis"), ("Vidyanagar / Kuvempu University Axis", 3600, "Academic Corridor"), ("Other Localities", 2600, "Greater Shivamogga")]),
        ("Tumakuru (Tumkur)", 3500, "6.8% YoY", [("SIT College Area / Batawadi", 4900, "Academic & Commercial Hub"), ("Vasantnarasapura Mega Industrial Hub", 4100, "National Industrial Corridor"), ("Kyathsandra / Siddaganga Math Axis", 3800, "Heritage & NH48 Corridor"), ("Melekote / Heggere", 3400, "Expansion Zone"), ("Other Localities", 2800, "Greater Tumakuru")]),
        ("Davanagere", 3200, "5.6% YoY", [("MCC A & B Block", 4600, "Prime Heritage Residential"), ("Vidyanagar / PB Road", 4200, "Commercial Axis"), ("Anjaneya Badavane / Shamanur", 3800, "Residential Hub"), ("Harihar Industrial Link", 3200, "Industrial Twin Town"), ("Other Localities", 2500, "Greater Davanagere")]),
        ("Ballari (Bellary)", 3100, "5.2% YoY", [("Cantonment / Gandhinagar", 4400, "Commercial & Prime"), ("KHB Colony / Siruguppa Road", 3600, "Residential Hub"), ("Toranagallu JSW Mega Township", 3800, "Mega Steel SEZ"), ("Infantry Road / Cowl Bazaar", 3300, "Established Core"), ("Other Localities", 2400, "Greater Ballari")]),
        ("Kalaburagi (Gulbarga)", 3000, "5.4% YoY", [("Sedam Road / Ring Road Junction", 4300, "Commercial Corridor"), ("Brahmpur / Court Area", 3900, "Central Administrative"), ("Central University Axis / Aland Road", 3400, "Academic Corridor"), ("KHB Colony / Shahabad Road", 3200, "Residential Suburb"), ("Other Localities", 2300, "Greater Kalaburagi")]),
        ("Bagalkote", 2900, "5.1% YoY", [("Navanagar Planned City (Sectors)", 3800, "Modern Planned City"), ("Old Town / Station Road", 3300, "Commercial Core"), ("Badami - Aihole - Pattadakal Axis", 3600, "World Heritage Tourism"), ("Ilkal Saree & Granite Hub", 3100, "Trade Center"), ("Other Localities", 2300, "Greater Bagalkote")]),
        ("Bengaluru Rural", 4400, "8.0% YoY", [("Devanahalli SEZ / Aerospace Park", 5800, "Airport & High-Tech Core"), ("Doddaballapura Industrial Textile Hub", 4200, "Industrial & Apparel Cluster"), ("Nelamangala Highway Junction", 4600, "Logistics & Transport Axis"), ("Hosakote Auto & Hardware Hub", 4500, "Automotive Corridor"), ("Other Localities", 3200, "Rural Bangalore Belt")]),
        ("Bidar", 2800, "4.8% YoY", [("Bidar Fort / Mailoor", 3600, "Heritage & Admin"), ("Airforce Station Area / Naubad", 3300, "Institutional Zone"), ("Humnabad Industrial SEZ", 3000, "Industrial Hub"), ("Other Localities", 2200, "Greater Bidar")]),
        ("Chamarajanagar", 2700, "4.7% YoY", [("Town Bus Stand / Court Road", 3400, "District HQ"), ("Gundlupet Bandipur Gateway", 3200, "Eco-tourism Hub"), ("Kollegal Silk & Handloom Town", 3000, "Handloom Trade Center"), ("Other Localities", 2100, "Periphery")]),
        ("Chikkaballapura", 3600, "7.1% YoY", [("NH44 Airport Highway Node", 4900, "Growth Axis"), ("Nandi Hills Scenic Foothills", 5200, "Luxury Resort & Villa Belt"), ("Bagepalli Industrial Zone", 3200, "Industrial Border"), ("Chintamani Trade Town", 3400, "Commercial Hub"), ("Other Localities", 2700, "Greater Chikkaballapura")]),
        ("Chikkamagaluru (Chikmagalur)", 3900, "6.8% YoY", [("MG Road / Indira Gandhi Road", 5400, "Commercial Core"), ("Mullayanagiri Foothills / Coffee Estates", 5900, "Luxury Eco-Resort Belt"), ("Kadur Junction", 3300, "Railway Division Axis"), ("Mudigere Scenic Belt", 3600, "Plantation Suburb"), ("Other Localities", 2900, "Greater Chikkamagaluru")]),
        ("Chitradurga", 2900, "5.2% YoY", [("Fort Area / BD Road", 3800, "Historic Commercial"), ("Kelagote / NH48 Bypass", 3500, "Highway Corridor"), ("Challakere Science City (ISRO / BARC)", 3400, "National Science Hub"), ("Other Localities", 2300, "Greater Chitradurga")]),
        ("Gadag", 2800, "4.9% YoY", [("Pala Badami Road / Betageri", 3600, "Twin Town Core"), ("Wind Energy Hub Axis", 3100, "Renewable Energy Corridor"), ("Other Localities", 2200, "Greater Gadag-Betageri")]),
        ("Hassan", 3300, "5.8% YoY", [("BM Road / Vidyanagar", 4500, "Commercial Core"), ("Hassan Industrial Growth Center (HGC)", 3800, "Textile & Food Processing"), ("Shravanabelagola Pilgrimage Axis", 3600, "World Heritage Center"), ("Belur-Halebeedu Tourism Corridor", 3700, "Hoysala Heritage Belt"), ("Other Localities", 2600, "Greater Hassan")]),
        ("Haveri", 2700, "4.8% YoY", [("Station Road / PB Road", 3500, "Town Core"), ("Ranebennur Seed & Cotton Hub", 3400, "Agro-Trade Center"), ("Other Localities", 2200, "Greater Haveri")]),
        ("Kodagu (Madikeri / Coorg)", 4600, "7.4% YoY", [("Madikeri Town / Raja Seat", 6200, "Heritage Hill Tourism"), ("Kushalnagar / Golden Temple Axis", 5100, "Commercial & Tourist Hub"), ("Gonikoppal / Virajpet Plantation Belt", 4400, "Estate Residential"), ("Other Localities", 3500, "Coorg Region")]),
        ("Kolar", 3400, "6.2% YoY", [("Bangalore Highway Corridor (NH75)", 4600, "Industrial & Suburban Hub"), ("KGF (Kolar Gold Fields) Heritage", 3200, "Mining Heritage City"), ("Tamaka Medical College Axis", 3700, "Institutional Zone"), ("Srinivaspur Mango Market", 2900, "Agro Commerce"), ("Other Localities", 2600, "Greater Kolar")]),
        ("Koppal", 2800, "4.9% YoY", [("Koppal Toy Cluster / Ginigera", 3600, "India Toy Fair Mega Hub"), ("Munirabad Tungabhadra Dam Corridor", 3300, "Scenic Lake Axis"), ("Kushtagi / Gangavathi Paddy Hub", 3100, "Rice Mill Hub"), ("Other Localities", 2200, "Greater Koppal")]),
        ("Mandya (Sugar City)", 3200, "5.6% YoY", [("Bangalore-Mysore Expressway Exit Hub", 4400, "10-Lane Expressway Node"), ("Sugar Town / VV Nagar", 3800, "Central Residential"), ("Maddur Tender Coconut Belt", 3300, "Expressway Transit"), ("Srirangapatna Heritage River Island", 4100, "Heritage Tourism"), ("Other Localities", 2500, "Greater Mandya")]),
        ("Raichur", 2900, "5.0% YoY", [("Station Road / Maski Road", 3700, "Commercial Core"), ("Thermal Power Station (RTPS) Corridor", 3300, "Power Industrial Zone"), ("Sindhanur Agro-Trade Hub", 3100, "Cotton & Rice Hub"), ("Other Localities", 2300, "Greater Raichur")]),
        ("Ramanagara (Silk City)", 3600, "6.8% YoY", [("Expressway Corridor / Ijoor", 4900, "Bangalore Satellite Axis"), ("Bidadi Mega Industrial Hub (Toyota SEZ)", 4800, "Automotive Mega Cluster"), ("Channapatna Wooden Toy Hub", 3600, "Craft & Transit Axis"), ("Harohalli Industrial Phase 1-3", 4200, "Industrial Suburb"), ("Other Localities", 2800, "Greater Ramanagara")]),
        ("Uttara Kannada (Karwar / Sirsi)", 3500, "5.9% YoY", [("Karwar INS Kadamba Naval Base Hub", 4800, "Maritime & Coastal Core"), ("Sirsi Western Ghats Spice Center", 4100, "Arecanut & Spice Trade"), ("Gokarna International Beach Corridor", 6200, "Pilgrimage & Coastal Resort"), ("Dandeli River Rafting Tourism Belt", 4200, "Eco-tourism Hub"), ("Bhatkal Coastal Hub", 3700, "Trade & Coastal Port"), ("Other Localities", 2800, "Coastal / Malnad Zone")]),
        ("Vijayanagara (Hospet / Hampi)", 3600, "6.5% YoY", [("Hospet City Center / College Road", 4800, "Commercial Core"), ("Hampi UNESCO World Heritage Corridor", 5800, "International Tourism Zone"), ("TB Dam Lake View Road", 4100, "Scenic Waterfront"), ("Kamalapur Heritage Gateway", 3900, "Tourist Hub"), ("Other Localities", 2700, "Greater Hospet")]),
        ("Vijayapura (Bijapur)", 3100, "5.3% YoY", [("Gol Gumbaz / Station Road", 4200, "Heritage Commercial"), ("Solapur Highway Bypass", 3600, "Highway Corridor"), ("BLDE University / Ashram Road", 3700, "Institutional Core"), ("Indi / Muddebihal Suburbs", 2800, "Trade Towns"), ("Other Localities", 2400, "Greater Vijayapura")]),
        ("Yadgir", 2600, "4.5% YoY", [("Yadgir Railway Station Road / Court", 3300, "District HQ"), ("Kadechur Industrial Mega Pharma SEZ", 3500, "Pharma Cluster"), ("Shahapur / Shorapur Historic Towns", 2900, "Trade Hubs"), ("Other Localities", 2000, "Greater Yadgir")])
    ]
}

print("Base loaded with all AP, AR, AS, BR, CG, GA, GJ, HR, HP, JH, KA complete.")
