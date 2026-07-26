/* ==========================================================================
   THE APOTHECARY INDEX — data.js
   A ledger of common ailments for general education only.
   Nothing here is a prescription. Categories:
     minor     -> usually safe to self-care, OTC options exist
     doctor    -> needs diagnosis / prescription-level management
     emergency -> act now, call local emergency services
     crisis    -> mental health crisis, reach out to a crisis line now
   ========================================================================== */

const AILMENTS = [
  {
    id: "001",
    name: "Common Cold",
    aliases: ["cold", "runny nose", "common cold", "rhinovirus", "stuffy nose"],
    category: "minor",
    overview: "A mild viral infection of the nose and throat that usually clears on its own within a week to ten days.",
    symptoms: ["Runny or stuffy nose", "Sneezing", "Sore throat", "Mild cough", "Low-grade fatigue", "Mild headache"],
    selfCare: ["Rest and sleep", "Drink plenty of fluids", "Use a humidifier or try steam inhalation", "Gargle warm salt water for a sore throat", "Honey in warm water for cough (not for infants under 1 year)"],
    remedies: ["Decongestants for a stuffy nose, per package directions", "Fever/pain relievers such as acetaminophen or ibuprofen", "Saline nasal spray or drops", "Throat lozenges"],
    seekCareIf: ["Fever above 39.4°C (103°F)", "Symptoms last more than 10 days", "Symptoms worsen after initially improving", "Difficulty breathing or chest pain"]
  },
  {
    id: "002",
    name: "Influenza (Flu)",
    aliases: ["flu", "influenza"],
    category: "minor",
    overview: "A viral respiratory illness that comes on more suddenly and severely than a cold, usually lasting one to two weeks.",
    symptoms: ["Sudden fever and chills", "Body aches", "Headache", "Dry cough", "Extreme fatigue", "Sore throat"],
    selfCare: ["Rest and stay home to avoid spreading it", "Stay hydrated", "Use a humidifier"],
    remedies: ["Fever/pain relievers such as acetaminophen or ibuprofen", "Decongestants or cough suppressants for symptom relief", "Antiviral medication if prescribed early by a doctor — most effective within 48 hours of symptoms starting"],
    seekCareIf: ["Difficulty breathing or chest pain", "Persistent dizziness", "Symptoms that improve, then return worse", "You're pregnant, over 65, or living with a chronic condition — see a doctor promptly regardless of severity"]
  },
  {
    id: "003",
    name: "Tension Headache",
    aliases: ["headache", "tension headache", "head pain"],
    category: "minor",
    overview: "A common headache felt as dull, pressing pain, often linked to stress, poor posture, dehydration, or eye strain.",
    symptoms: ["Dull, aching head pain", "Tightness across the forehead or scalp", "Tenderness in neck or shoulders"],
    selfCare: ["Rest in a quiet, dark room", "Stay hydrated", "Gentle neck and shoulder stretches", "Keep a regular sleep schedule", "Limit screen time"],
    remedies: ["Pain relievers such as acetaminophen, ibuprofen, or aspirin, per package directions"],
    seekCareIf: ["Sudden \u2018worst headache of your life\u2019", "Headache with fever and a stiff neck", "Headache after a head injury", "Headaches that are worsening or becoming more frequent"]
  },
  {
    id: "004",
    name: "Migraine",
    aliases: ["migraine", "migraines"],
    category: "doctor",
    overview: "A neurological condition causing recurring, often one-sided throbbing headaches, sometimes with nausea and light sensitivity.",
    symptoms: ["Throbbing, often one-sided head pain", "Nausea or vomiting", "Sensitivity to light and sound", "Visual disturbances (aura) in some cases"],
    selfCare: ["Rest in a dark, quiet room", "Cold compress on the forehead or neck", "Track and avoid personal triggers (certain foods, stress, sleep changes)", "Keep a headache diary"],
    management: ["Early acute treatment with pain relievers can help mild attacks", "Prescription migraine-specific medication for frequent or severe attacks", "Preventive medication for people with frequent migraines", "The right combination is chosen by a doctor based on frequency and severity"],
    seekCareIf: ["A sudden severe headache unlike your usual migraines", "Headache with confusion, weakness, or vision loss", "Migraines increasing in frequency or severity"]
  },
  {
    id: "005",
    name: "Sore Throat",
    aliases: ["sore throat", "pharyngitis", "throat pain", "scratchy throat"],
    category: "minor",
    overview: "Irritation and pain in the throat, most often from a viral infection, typically resolving within a week.",
    symptoms: ["Pain or scratchiness in the throat", "Pain that's worse when swallowing", "Mild fever", "Swollen glands"],
    selfCare: ["Gargle warm salt water", "Stay hydrated", "Use a humidifier", "Rest your voice"],
    remedies: ["Throat lozenges or sprays", "Pain/fever relievers such as acetaminophen or ibuprofen"],
    seekCareIf: ["Severe pain making it hard to swallow or breathe", "High fever", "White patches on the tonsils", "Symptoms lasting more than a week (may need testing for strep throat)"]
  },
  {
    id: "006",
    name: "Cough",
    aliases: ["cough", "dry cough", "chesty cough", "productive cough"],
    category: "minor",
    overview: "A reflex that clears the airway, commonly triggered by colds, allergies, or irritants, usually easing within two to three weeks.",
    symptoms: ["Dry or productive (mucus-producing) cough", "Throat tickle", "Chest tightness in some cases"],
    selfCare: ["Stay hydrated", "Use a humidifier", "Honey in warm water or tea (not for infants under 1 year)", "Avoid smoke and other irritants"],
    remedies: ["Cough suppressants for a dry, irritating cough", "Expectorants to loosen mucus for a productive cough", "Throat lozenges"],
    seekCareIf: ["Cough lasting more than 3 weeks", "Coughing up blood", "High fever", "Shortness of breath or chest pain"]
  },
  {
    id: "007",
    name: "Seasonal Allergies",
    aliases: ["allergies", "hay fever", "allergic rhinitis", "seasonal allergies", "pollen allergy"],
    category: "minor",
    overview: "An immune reaction to pollen, dust, or other allergens causing nasal and eye symptoms, often seasonal.",
    symptoms: ["Sneezing", "Runny or blocked nose", "Itchy, watery eyes", "Itchy throat"],
    selfCare: ["Track local pollen counts and stay indoors on high days", "Keep windows closed during peak season", "Shower after time outdoors", "Use a HEPA air filter indoors"],
    remedies: ["Antihistamines for sneezing and itching", "Nasal corticosteroid sprays for congestion", "Saline nasal rinses", "Eye drops for itchy eyes"],
    seekCareIf: ["Symptoms don't improve with OTC treatment", "They interfere significantly with sleep or daily life", "You notice wheezing or shortness of breath alongside them"]
  },
  {
    id: "008",
    name: "Occasional Heartburn",
    aliases: ["heartburn", "acid reflux", "indigestion"],
    category: "minor",
    overview: "A burning sensation in the chest caused by stomach acid backing up into the esophagus, often after meals.",
    symptoms: ["Burning chest pain after eating", "Sour taste in the mouth", "Bloating", "Worse when lying down"],
    selfCare: ["Eat smaller meals", "Avoid lying down right after eating", "Limit spicy, fatty, or acidic foods and alcohol", "Elevate the head of your bed"],
    remedies: ["Antacids for quick relief", "H2 blockers or proton pump inhibitors for more persistent symptoms, for short-term use per package directions"],
    seekCareIf: ["Heartburn more than twice a week", "Difficulty or pain when swallowing", "Unintended weight loss", "Chest pain that could be cardiac — seek emergency care if in doubt"]
  },
  {
    id: "009",
    name: "Mild Diarrhea",
    aliases: ["diarrhea", "loose motions", "stomach upset", "loose stools"],
    category: "minor",
    overview: "Loose, watery stools usually caused by a viral infection or dietary trigger, typically resolving within a few days.",
    symptoms: ["Frequent loose stools", "Mild cramping", "Occasional nausea"],
    selfCare: ["Drink oral rehydration solution or fluids with electrolytes", "Eat bland foods (rice, bananas, toast)", "Avoid dairy, caffeine, and fatty foods until recovered"],
    remedies: ["Oral rehydration salts", "Anti-diarrheal medication for short-term relief in adults without fever or blood in stool"],
    seekCareIf: ["Diarrhea lasting more than 2 days", "Signs of dehydration", "Blood in the stool", "High fever or severe abdominal pain"]
  },
  {
    id: "010",
    name: "Constipation",
    aliases: ["constipation"],
    category: "minor",
    overview: "Infrequent or difficult bowel movements, often related to diet, hydration, or activity levels.",
    symptoms: ["Fewer than 3 bowel movements a week", "Hard or lumpy stools", "Straining", "Bloating"],
    selfCare: ["Increase fiber and water intake", "Regular physical activity", "Don't delay the urge to go"],
    remedies: ["Fiber supplements", "Osmotic or stimulant laxatives, for short-term use per package directions"],
    seekCareIf: ["Constipation lasting more than 2\u20133 weeks", "Blood in the stool", "Severe abdominal pain", "Unexplained weight loss"]
  },
  {
    id: "011",
    name: "Nausea / Motion Sickness",
    aliases: ["nausea", "motion sickness", "feeling sick", "queasy"],
    category: "minor",
    overview: "A queasy, uneasy stomach feeling, often triggered by travel, mild stomach upset, or early illness.",
    symptoms: ["Queasiness", "Urge to vomit", "Dizziness", "Cold sweat"],
    selfCare: ["Get fresh air", "Take small sips of water or ginger tea", "Focus on the horizon during travel", "Eat small, bland meals"],
    remedies: ["Antihistamine-based motion sickness tablets", "Antacids for stomach-related nausea"],
    seekCareIf: ["Severe or persistent vomiting", "Signs of dehydration", "Blood in vomit", "Severe abdominal pain, or nausea alongside chest pain or confusion — seek emergency care"]
  },
  {
    id: "012",
    name: "Minor Muscle Strain",
    aliases: ["muscle pain", "sprain", "strain", "sore muscles", "pulled muscle"],
    category: "minor",
    overview: "Overstretched or mildly torn muscle or ligament fibers from overexertion or an awkward movement, usually improving within days to a couple of weeks.",
    symptoms: ["Localized pain", "Swelling", "Stiffness", "Bruising", "Reduced range of motion"],
    selfCare: ["Rest the area", "Ice for the first 48 hours, then gentle heat", "Compression bandage", "Elevate the limb", "Gentle stretching once pain eases"],
    remedies: ["Topical or oral anti-inflammatory pain relievers such as ibuprofen, per package directions"],
    seekCareIf: ["Unable to bear weight or move the joint", "Visible deformity", "Numbness", "Severe swelling or no improvement after a week"]
  },
  {
    id: "013",
    name: "Mild Acne",
    aliases: ["acne", "pimples", "breakouts", "spots"],
    category: "minor",
    overview: "A common skin condition from clogged pores and inflammation, ranging from occasional pimples to more persistent breakouts.",
    symptoms: ["Whiteheads and blackheads", "Small red bumps", "Occasional tenderness"],
    selfCare: ["Gentle cleansing twice daily", "Avoid over-scrubbing or popping pimples", "Use non-comedogenic skincare and makeup"],
    remedies: ["Topical benzoyl peroxide", "Topical salicylic acid or adapalene", "Consistent use for several weeks for visible results"],
    seekCareIf: ["Acne is painful, cystic, or scarring", "No improvement after 2\u20133 months of consistent OTC care — a dermatologist can offer stronger options"]
  },
  {
    id: "014",
    name: "Mild Eczema Flare",
    aliases: ["eczema", "dry itchy skin", "dermatitis"],
    category: "minor",
    overview: "A flare of dry, itchy, inflamed skin, often triggered by irritants, weather, or stress.",
    symptoms: ["Dry patches", "Itching", "Redness", "Occasional cracking or oozing in severe cases"],
    selfCare: ["Moisturize frequently with a fragrance-free cream", "Take lukewarm, not hot, showers", "Avoid known triggers and harsh soaps", "Use a humidifier in dry weather"],
    remedies: ["Fragrance-free emollient moisturizers", "Low-strength hydrocortisone cream for short-term flare relief"],
    seekCareIf: ["Signs of skin infection (increasing redness, warmth, pus)", "The flare doesn't improve", "It covers a large area or disrupts sleep"]
  },
  {
    id: "015",
    name: "Occasional Insomnia",
    aliases: ["insomnia", "trouble sleeping", "can't sleep", "sleeplessness"],
    category: "minor",
    overview: "Difficulty falling or staying asleep, often tied to stress, screen use, caffeine, or an irregular schedule.",
    symptoms: ["Trouble falling asleep", "Waking during the night", "Waking too early", "Daytime tiredness"],
    selfCare: ["Keep a consistent sleep/wake schedule", "Limit screens and caffeine in the evening", "Keep the bedroom cool and dark", "Build a relaxation routine before bed"],
    remedies: ["Short-term, occasional use of OTC sleep aids", "Melatonin, taken as directed"],
    seekCareIf: ["Insomnia lasting more than a few weeks", "It's affecting daily functioning", "It's accompanied by mood changes"]
  },
  {
    id: "016",
    name: "Mild Fever",
    aliases: ["fever", "high temperature", "temperature"],
    category: "minor",
    overview: "A temporary rise in body temperature — usually a sign the body is fighting an infection.",
    symptoms: ["Temperature above 38°C (100.4°F)", "Chills", "Sweating", "Headache", "Muscle aches"],
    selfCare: ["Rest", "Drink plenty of fluids", "Dress lightly", "Lukewarm sponging if uncomfortable"],
    remedies: ["Fever reducers such as acetaminophen or ibuprofen, per package directions"],
    seekCareIf: ["Fever above 39.4°C (103°F)", "Lasts more than 3 days", "Comes with a rash, stiff neck, confusion, or difficulty breathing", "In an infant under 3 months — seek care immediately"]
  },
  {
    id: "017",
    name: "Hypertension",
    aliases: ["hypertension", "high blood pressure", "blood pressure"],
    category: "doctor",
    overview: "A long-term condition where blood pressure against artery walls stays consistently elevated, raising the risk of heart disease and stroke if unmanaged.",
    symptoms: ["Often no symptoms at all (it's sometimes called \u2018silent\u2019)", "Occasionally headaches, dizziness, or nosebleeds at very high readings"],
    selfCare: ["Reduce sodium intake", "Regular physical activity", "Maintain a healthy weight", "Limit alcohol", "Manage stress", "Monitor blood pressure regularly"],
    management: ["Managed with lifestyle changes and, when needed, prescription medication such as ACE inhibitors, diuretics, or beta blockers", "The specific drug and dose is chosen by a doctor based on individual health factors"],
    seekCareIf: ["A very high reading with symptoms like severe headache, chest pain, or vision changes — seek emergency care", "Any new diagnosis or before starting or changing medication"]
  },
  {
    id: "018",
    name: "Type 2 Diabetes",
    aliases: ["diabetes", "type 2 diabetes", "high blood sugar"],
    category: "doctor",
    overview: "A chronic condition where the body doesn't use insulin effectively, leading to elevated blood sugar over time.",
    symptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision", "Slow-healing wounds"],
    selfCare: ["Balanced diet with attention to carbohydrates", "Regular physical activity", "Weight management", "Routine blood sugar monitoring"],
    management: ["Managed with lifestyle changes and, when needed, medication such as metformin or other glucose-lowering drugs", "Sometimes insulin — the plan is individualized by a doctor"],
    seekCareIf: ["Any new symptoms suggesting very high or low blood sugar", "For diagnosis, ongoing monitoring, and medication adjustment"]
  },
  {
    id: "019",
    name: "Asthma",
    aliases: ["asthma", "wheezing"],
    category: "doctor",
    overview: "A chronic condition causing inflammation and narrowing of the airways, leading to episodes of breathing difficulty.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing, often worse at night or with exercise"],
    selfCare: ["Identify and avoid personal triggers", "Keep rescue medication on hand", "Monitor symptoms with a peak flow meter if advised"],
    management: ["Managed with a doctor-prescribed fast-acting rescue inhaler for flare-ups", "Often combined with a daily controller inhaler to reduce inflammation long-term"],
    seekCareIf: ["A rescue inhaler isn't relieving symptoms", "Difficulty speaking full sentences due to breathlessness", "Lips or fingertips turning blue — seek emergency care immediately"]
  },
  {
    id: "020",
    name: "Urinary Tract Infection",
    aliases: ["uti", "urinary tract infection", "bladder infection"],
    category: "doctor",
    overview: "A bacterial infection most often affecting the bladder, causing pain and urinary changes. It typically needs antibiotics to fully clear.",
    symptoms: ["Burning sensation when urinating", "Frequent urge to urinate", "Cloudy or strong-smelling urine", "Pelvic discomfort"],
    selfCare: ["Drink plenty of water", "Urinate when you need to rather than holding it", "Avoid irritants like caffeine while symptomatic"],
    management: ["Usually requires a course of antibiotics prescribed by a doctor after a urine test", "OTC products may ease discomfort but won't clear the infection on their own"],
    seekCareIf: ["Fever, back or side pain, or nausea/vomiting — possible kidney infection, seek prompt care", "Any UTI symptoms at all, since diagnosis and antibiotics require a doctor"]
  },
  {
    id: "021",
    name: "Strep Throat / Sinus Infection",
    aliases: ["strep throat", "sinus infection", "sinusitis"],
    category: "doctor",
    overview: "A bacterial infection of the throat or sinuses that, unlike most colds, often requires antibiotics to treat and to prevent complications.",
    symptoms: ["Sudden, severe sore throat or facial pain/pressure", "Fever", "Swollen, tender lymph nodes", "Thick, discolored nasal discharge lasting over 10 days"],
    selfCare: ["Rest and hydration", "Warm salt water gargles", "Saline nasal rinses while awaiting diagnosis"],
    management: ["Diagnosed with a throat swab or clinical exam", "Treated with a specific antibiotic prescribed by a doctor if the cause is bacterial"],
    seekCareIf: ["Any suspected case — testing is needed to confirm a bacterial cause before antibiotics make sense"]
  },
  {
    id: "022",
    name: "Depression",
    aliases: ["depression", "feeling depressed", "low mood"],
    category: "doctor",
    overview: "A persistent mental health condition involving low mood and loss of interest that affects daily functioning, and that responds well to professional treatment.",
    symptoms: ["Persistent sadness or emptiness", "Loss of interest in activities", "Changes in sleep or appetite", "Low energy", "Difficulty concentrating"],
    selfCare: ["Maintain routine and social connection", "Regular physical activity", "Adequate sleep", "Reach out to people you trust"],
    management: ["Often managed with talk therapy and, when appropriate, prescription medication", "Prescribed and monitored by a doctor or psychiatrist — the right approach depends on the individual"],
    seekCareIf: ["Symptoms last more than two weeks or affect daily life — talk to a doctor or mental health professional", "If you're having thoughts of harming yourself, reach out to a crisis line or emergency services right away"]
  },
  {
    id: "023",
    name: "Anxiety",
    aliases: ["anxiety", "anxious", "panic attacks", "panic attack"],
    category: "doctor",
    overview: "A mental health condition involving excessive worry or fear, which can be persistent (generalized anxiety) or come in sudden episodes (panic attacks).",
    symptoms: ["Excessive worry", "Restlessness", "Rapid heartbeat", "Muscle tension", "Trouble concentrating", "Sudden intense fear with physical symptoms, in panic attacks"],
    selfCare: ["Slow breathing exercises", "Regular exercise", "Limit caffeine", "Maintain a sleep routine", "Grounding techniques during acute anxiety"],
    management: ["Often managed with talk therapy such as CBT", "When appropriate, prescription medication prescribed and monitored by a doctor or psychiatrist"],
    seekCareIf: ["Anxiety is persistent or interfering with daily life", "Panic attacks are frequent — a doctor or mental health professional can help find the right approach"]
  },
  {
    id: "024",
    name: "Chronic Acid Reflux (GERD)",
    aliases: ["gerd", "chronic acid reflux", "chronic heartburn"],
    category: "doctor",
    overview: "A chronic form of acid reflux where stomach acid regularly flows back into the esophagus, potentially causing damage over time if untreated.",
    symptoms: ["Frequent heartburn, more than twice a week", "Regurgitation", "Difficulty swallowing", "Chronic cough or hoarseness"],
    selfCare: ["Smaller meals", "Avoid trigger foods", "Don't lie down soon after eating", "Elevate the head of your bed", "Maintain a healthy weight"],
    management: ["Diagnosed and managed by a doctor, often with prescription-strength acid-reducing medication", "In some cases, further testing to check for complications"],
    seekCareIf: ["Difficulty or pain when swallowing", "Unintended weight loss", "Vomiting blood", "Symptoms not improving with lifestyle changes and OTC treatment"]
  },
  {
    id: "025",
    name: "Chest Pain / Suspected Heart Attack",
    aliases: ["chest pain", "heart attack", "cardiac arrest"],
    category: "emergency",
    overview: "Chest pain can signal a heart attack, especially with certain accompanying symptoms. This is a medical emergency, not something to self-treat.",
    symptoms: ["Chest pain or pressure", "Pain spreading to the arm, jaw, or back", "Shortness of breath", "Cold sweat", "Nausea", "Lightheadedness"],
    action: "Call emergency services immediately. Chew an aspirin only if advised by emergency dispatch and you're not allergic. Do not drive yourself."
  },
  {
    id: "026",
    name: "Stroke Symptoms",
    aliases: ["stroke", "face drooping", "slurred speech"],
    category: "emergency",
    overview: "A stroke happens when blood flow to the brain is interrupted. Every minute matters, so this requires immediate emergency care.",
    symptoms: ["Sudden face drooping", "Arm weakness", "Slurred or confused speech", "Sudden vision loss", "Sudden severe headache", "Loss of balance"],
    action: "Call emergency services immediately. Note the time symptoms started. Do not give food, drink, or medication."
  },
  {
    id: "027",
    name: "Severe Allergic Reaction (Anaphylaxis)",
    aliases: ["anaphylaxis", "severe allergic reaction", "allergy emergency"],
    category: "emergency",
    overview: "A rapid, severe allergic reaction that can be life-threatening within minutes and requires immediate treatment.",
    symptoms: ["Swelling of the face or throat", "Difficulty breathing", "Widespread hives", "Rapid pulse", "Dizziness or fainting", "A sense of impending doom"],
    action: "Use an epinephrine auto-injector immediately if available, then call emergency services even if symptoms improve. Do not wait to see if it passes."
  },
  {
    id: "028",
    name: "Severe Difficulty Breathing",
    aliases: ["can't breathe", "shortness of breath severe", "breathing difficulty", "trouble breathing"],
    category: "emergency",
    overview: "Sudden, severe trouble breathing can indicate a serious underlying problem and needs immediate medical attention.",
    symptoms: ["Gasping for air", "Blue-tinged lips or fingertips", "Inability to speak full sentences", "Chest tightness", "Confusion"],
    action: "Call emergency services immediately. Sit upright, try to stay calm, and use a rescue inhaler if one is prescribed and available."
  },
  {
    id: "029",
    name: "Suicidal Thoughts / Self-Harm",
    aliases: ["suicidal", "suicide", "self harm", "want to die", "hurting myself", "self-harm"],
    category: "crisis",
    overview: "If you're having thoughts of suicide or self-harm, you deserve immediate support. Please reach out right now — you don't have to handle this alone.",
    action: "In the US, call or text 988 (Suicide & Crisis Lifeline). Outside the US, contact your local emergency number or a crisis line such as findahelpline.com. If you or someone else is in immediate danger, call emergency services now."
  }
];