import express from "express";
import axios from "axios";
import path from "path";
import generateName from "sillyname";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//static files
app.use(express.static(path.join(__dirname, "public")));

const zoneSpecies = {
    sunlit: "Thunnus thynnus", //tuna
    twilight: "Myctophum punctatum", //lantern fish
    midnight: "Vampyroteuthis infernalis", //vampire squid
    abyss: "Grimpoteuthis discoveryi", //dumbo octopus
    trench: "Pseudoliparis swirei" //marina snailfish
};

//call WoRMS REST API with a scientific name
async function getSpeciesInfo(scientificName) {
    try {
        const url = `https://www.marinespecies.org/rest/AphiaRecordsByName/${encodeURIComponent(scientificName)}?like=false&marine_only=true`;

        const response = await axios.get(url);

        console.log("RAW WORMS DATA for", scientificName, ":\n", response.data);

        const record = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

        if (!record) {
            return null;
        }

        return {
            scientificName: record.scientificname,
            authority: record.authority,
            rank: record.rank,
            status: record.status,
            validName: record.valid_name,
            kingdom: record.kingdom,
            phylum: record.phylum,
            class: record.class,
            order: record.order,
            family: record.family
        };
    } catch (err) {
        console.error("Error fetching WoRMS species:", err.message);
        return null;
    }
}

//home
app.get("/", async (req, res) => {

    res.render("home", {
        title: "Home"
    });
});

//sunlit Zone
app.get("/sunlit", async (req, res) => {
    const species = await getSpeciesInfo(zoneSpecies.sunlit);
    const sillyName = generateName();

    res.render("sunlit", {
        title: "Sunlit Zone",
        species,
        sillyName,
        speciesCommonName: "Atlantic Bluefin Tuna",
        speciesInfo: "The Atlantic bluefin tuna is a powerful, fast, predator that cruises the sunlit surface waters in search of smaller fish and squid. It can reach incredible speeds and is one of the largest bony fish in the ocean. Known for their powerful migrations, some individuals cross entire oceans during their lifetime",
        speciesImage: "tuna.jpg"
    });
});

//twilight
app.get("/twilight", async (req, res) => {
    const species = await getSpeciesInfo(zoneSpecies.twilight);
    const sillyName = generateName();

    res.render("twilight", {
        title: "Twilight Zone",
        species,
        sillyName,
        speciesCommonName: "Lantern Fish",
        speciesInfo: "Lanternfish get their name from the rows of natural lights that cover their bodies like glowing constellations. These lights help them communicate, camouflage, and confuse predators. They are a part of the 'daily vertical migration', rising toward the surface at night to feed and returning to the depths by day.",
        speciesImage: "lantern.jpg"
    });
});

//midnight
app.get("/midnight", async (req, res) => {
    const species = await getSpeciesInfo(zoneSpecies.midnight);
    const sillyName = generateName();

    res.render("midnight", {
        title: "Midnight Zone",
        species,
        sillyName,
        speciesCommonName: "Vampire Squid",
        speciesInfo: "Despite its name, the vampire squid is a gentle creature that does not attack living prey. It floats through the dark midwaters using minimal energy and feeds on drifting marine snow. Its reddish skin, cloak-like arms, and glowing blue eyes give it a striking, eerie appearance in the darkness.",
        speciesImage: "squid.jpg"
    });
});

//abyss
app.get("/abyss", async (req, res) => {
    const species = await getSpeciesInfo(zoneSpecies.abyss);
    const sillyName = generateName();

    res.render("abyss", {
        title: "Abyss",
        species,
        sillyName,
        speciesCommonName: "Dumbo Octopus",
        speciesInfo: "Dumbo octopuses are named for their charming ear like fins, which resemble the floppy ears of Dumbo the elephant. These fins allow them to glide gracefully through deep ocean waters. Found at depths up to 7,000 meters, they flap and drift in a slow, ghostly movement that looks more like flying than swimming.",
        speciesImage: "dumbo.jpg"
    });
});

//trench
app.get("/trench", async (req, res) => {
    const species = await getSpeciesInfo(zoneSpecies.trench);
    const sillyName = generateName();

    res.render("trench", {
        title: "Deep Trenches",
        species,
        sillyName,
        speciesCommonName: "Marina Snailfish",
        speciesInfo: "The Mariana snailfish holds the record as one of the deepest living fish ever discovered. Found more than 8,000 meters below the surface, its soft, scaleless body and flexible bones help it withstand enormous pressure. Far from being sluggish, these tiny fish are surprisingly active predators in their extreme environment.",
        speciesImage: "snailfish.jpg"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});