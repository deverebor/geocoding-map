import { express } from "../../app";

const router = express.Router();
const axios = require("axios");
const url = require("url");

router.get("/:query", async (request: any, response: any) => {
  try{
    // add api key & query strings
    const params = new URLSearchParams({
      access_token: process.env.GEOMAP_API_KEY,
      ...url.parse(request.url, true).query,
    });

    const query = request.params.query;
    const result = await axios(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?${params}`);
    const data = result.data;

    response.status(200).json(data);
  }
  catch(error: any){
    response.status(500).json({ error: error.message });
  }
})

module.exports = router;